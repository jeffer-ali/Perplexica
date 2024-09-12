import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
const ffmpeg: any = require('fluent-ffmpeg');
// const pathToFfmpeg: any = require("ffmpeg-static");

export async function GET(req: Request, res: Response) {
  const videoPath = './public/videos/input.mp4';
  const outputFolder = './public/videos';

  const timeToMilliseconds = (timeString: string) => {
    // 提取小时、分钟、秒和毫秒
    const [h, m, s] = timeString.split(':');
    const [seconds, milliseconds] = s.split('.');

    // 转换为整数
    const hours = parseInt(h, 10);
    const minutes = parseInt(m, 10);
    const secs = parseInt(seconds, 10);
    const millisecs = parseInt(milliseconds, 10);

    // 计算总毫秒数
    const totalMilliseconds =
      hours * 3600000 + minutes * 60000 + secs * 1000 + millisecs;

    return totalMilliseconds;
  };

  // 读取 .vtt 文件的函数
  const readVTTFile = (filePath: string) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  };

  // 解析 .vtt 文件内容
  const parseVTTContent = (content: any) => {
    const lines = content.split('\n');
    const cues: any = [];
    let cue: any = {};

    lines.forEach((line: string) => {
      line = line.trim();
      if (line.startsWith('WEBVTT')) {
        return; // 跳过文件头
      }
      if (!line) {
        // 空行表示一个 cue 的结束
        if (cue.start && cue.end) {
          cues.push(cue);
          cue = {}; // 重置 cue
        }
        return;
      }
      if (!cue.start && !cue.end) {
        // 解析时间戳
        const timeMatch = line.match(
          /(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})/,
        );
        if (timeMatch) {
          cue.start = timeToMilliseconds(timeMatch[1]);
          cue.end = timeToMilliseconds(timeMatch[2]);
        }
      } else {
        // 解析字幕文本
        cue.text = (cue.text || '') + line;
      }
    });

    return cues;
  };

  const filePath = './public/videos/subs/subtitles.cmn-Hans-CN.vtt';
  try {
    const content = await readVTTFile(filePath);
    const subs = parseVTTContent(content);
    console.log(subs); // 打印解析后的字幕
  } catch (error) {
    console.error('Error reading VTT file:', error);
  }
  // ffmpeg('./public/videos/video.mp4')
  // .outputOptions('-map', '0:s:0')
  // .save(`${outputFolder}/subs.srt`)
  // .on('end', () => {
  //     console.log('提取字幕成功')
  // })
  // .on('error', (err:any) => {
  //     console.error('提取关键帧时发生错误: ', err.message);
  // })
  // .run();

  // fs.rm(outputFolder, { recursive: true, force: true }, (err) => {
  //     if (err) {
  //       console.error('Error removing directory:', err);
  //     } else {
  //       console.log('Directory removed successfully!');
  //     }
  //   });

  // return NextResponse.json({
  //     status: 200
  // });

  const videoFrames = (
    videoPath: string,
    outputFolder: string,
  ): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      try {
        // 创建输出文件夹（如果不存在）
        fs.mkdirSync(outputFolder, { recursive: true });

        ffmpeg(videoPath)
          .outputOptions([
            '-vf',
            'select=eq(pict_type\\,I)', // 选择关键帧
            '-vsync',
            'vfr',
            '-frame_pts',
            'true',
          ])
          .output(`${outputFolder}/frame-%04d.png`)
          .on('end', () => {
            console.log('关键帧提取完成');
            let numbers: any = [];
            // 提取完成后读取文件夹内容
            fs.readdir(outputFolder, (err, files) => {
              if (err) {
                return reject(err); // 读取文件错误
              }

              // 遍历文件
              files.forEach((file) => {
                // 检查文件是否是 .png 格式
                if (path.extname(file) === '.png') {
                  // 使用正则表达式提取文件名中的数字
                  const match = file.match(/(\d+)/); // 匹配数字
                  if (match) {
                    numbers.push(parseInt(match[0], 10)); // 将匹配的数字转换为整数并添加到数组
                  }
                }
              });
              resolve(files); // 成功读取文件，返回文件列表
            });
          })
          .on('error', (err: any) => {
            console.error('提取关键帧时发生错误: ', err.message);
            return reject(err); // 发生错误时调用 reject
          })
          .run();
      } catch (error) {
        reject(error); // 捕获同步错误
      }
    });
  };
}
