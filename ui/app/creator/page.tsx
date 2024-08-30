'use client'
import React, { useEffect, useRef, useState } from 'react'
// import { FFmpeg } from '@ffmpeg/ffmpeg'
// import { fetchFile, toBlobURL } from '@ffmpeg/util'
import MarkmapHooks from '@/components/markmap/markmap-hooks'
import { getSummary } from '@/lib/actions';

interface SubtitleItem {
  FinalSentence: string
  StartMs: number
  EndMs: number
}

const initValue = `
# markmap

## title1

- item1
- item2

## title2
### subtitle1

- beautiful
- useful
- easy
- interactive

### subtitle2

- great
- nice
`;

const Page = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [subtitleObj, setSubtitleObj] = useState<SubtitleItem[]>([{
    FinalSentence: '中国大陆国产游戏黑神话悟空才上线短短三天，',
    StartMs: 0,
    EndMs: 7500
  },
  {
    FinalSentence: '全球销售就突破1000万套，', 
    StartMs: 7500,
    EndMs: 10100
  },
  {
    FinalSentence: '最高同时在线人数超过300万人。',
    StartMs: 10250,
    EndMs: 13150
  },
  {
    FinalSentence: '官方微博数据统计，',  
    StartMs: 13250,
    EndMs: 14950
  },
  {
    FinalSentence: '目前初步进账已超过26亿人民币，',
    StartMs: 14950,
    EndMs: 18150
  },
  {
    FinalSentence: '折合约新台币118亿元。', 
    StartMs: 18150,
    EndMs: 20950
  },
  {
    FinalSentence: '现在幕后花絮陆续释出，',
    StartMs: 21100,
    EndMs: 23475
  },
  {
    FinalSentence: '持续炒热话题，',
    StartMs: 23475,
    EndMs: 25050
  },
  {
    FinalSentence: '一个角色的完整塑造，',
    StartMs: 25350,
    EndMs: 27075
  },
  {
    FinalSentence: '都是由动捕演员的一部分的捕捉加后期动画师共同来完成的，',
    StartMs: 27075,
    EndMs: 31875
  },
  {
    FinalSentence: '给到我们自己创作的空间很大，',
    StartMs: 31875,
    EndMs: 34000
  },
  {
    FinalSentence: '从演员的角度来说是更有激情。',
    StartMs: 34000,
    EndMs: 36600
  }]);
  // const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // useEffect(() => {
  //   (async () => {
  //     const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
  //     const ffmpeg = ffmpegRef.current;
  //     ffmpeg.on("log", ({ message }) => {});
  //     // toBlobURL is used to bypass CORS issue, urls with the same
  //     // domain can be used directly.
  //     await ffmpeg.load({
  //       coreURL: await toBlobURL(
  //         `${baseURL}/ffmpeg-core.js`,
  //         "text/javascript"
  //       ),
  //       wasmURL: await toBlobURL(
  //         `${baseURL}/ffmpeg-core.wasm`,
  //         "application/wasm"
  //       ),
  //     });
  //   })();
  // }, []);

  // const transcode = async () => {
  //   const ffmpeg = ffmpegRef.current;
  //   // u can use 'https://ffmpegwasm.netlify.app/video/video-15s.avi' to download the video to public folder for testing
  //   await ffmpeg.writeFile("input.mp4", await fetchFile(previewUrl));
  //   await ffmpeg.exec(["-i", "input.mp4", "-vn", "output.mp3"]);
  //   const data = (await ffmpeg.readFile("output.mp3")) as any;
  //   const buffer = Buffer.from(data)
  //   const base64Str = buffer.toString('base64')
  //   // console.log(base64Str);
  //   await fetch("/api/formatAudio", {
  //     method: "POST",
  //     body: JSON.stringify({buffer: base64Str})
  //   });
  //   // if (videoRef.current)
  //   // videoRef.current.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }))
  // };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert("请上传一个有效的视频文件");
    }
  };

  const handleUpload = async () => {
    if (!videoFile) {
      alert("请先选择一个视频文件");
      return;
    }
    setUploading(true);

    const formData = new FormData();
    formData.append("file", videoFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json()
      if(result.status === 200) {
        setSubtitle(result.audioText)
        setSubtitleObj(result.audioDetail)
      }
      
    } catch (error) {
      console.error(error)
    } finally {
      setUploading(false)
    }
  };

  const fetchSummary = async() => {
    const summary = await getSummary([{
      messageId: 'test',
      chatId: 'test',
      createdAt: new Date(),
      content: '中国大陆国产游戏黑神话悟空才上线短短三天，全球销售就突破1000万套，最高同时在线人数超过300万人。官方微博数据统计，目前初步进账已超过26亿人民币，折合约新台币118亿元。现在幕后花絮陆续释出，持续炒热话题，一个角色的完整塑造，都是由动捕演员的一部分的捕捉加后期动画师共同来完成的，给到我们自己创作的空间很大，从演员的角度来说是更有激情。穿着黑色紧身衣，从头到脚肢体关节都布满反光点，透过多台摄影机进行360°的拍摄。赋予游戏角色生命的大陆动作捕捉演员英凯今年28岁，他从5岁开始便接触武术，毕业于上海体育大学，由于他惟妙惟肖的神态动作，让黑神话悟空角色更。会鲜活，我们当时是要去录他的战斗技能嘛，他的普攻啊，各种招式。首先，导演组那边会给我一个大概的一个框架，比如说武器是棍子，可能要打几下，具体怎么打其实并没有很明确，都是我们现场，我们一起共同参与，共同设计动作捕捉完成后再加入动画师精修提升美感。但光是前期的动作捕捉就整整拍了四年之久。英凯表示，小时候学武术就学过孙悟空的猴棍，他除了扮演主角，其他60%的角色也都由他包办。我们一是会借助一些道具，比如我们有一些角色是可以借助一些类似于拐杖啊，就相当于充当自己的假肢，把胳膊加长啊，去做一些表演。黑神话悟空爆红，结果不少大陆工艺师跳出来指控角色的场景和服装涉嫌抄袭，引发网友热议。',
      role: 'user'
    }]);
  }

  useEffect(() => {
    fetchSummary()
  }, [])

  return (
    <div className="flex flex-wrap p-7">
      <div className="flex flex-col">
        <div>
          <input type="file" accept="video/*" onChange={handleFileChange} />
        </div>
        {previewUrl && (
          <div>
            <video ref={videoRef} src={previewUrl} width="400" controls></video>
          </div>
        )}
        <button
          className="mt-3 w-28 h-7 bg-black rounded-md text-white"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "分析中..." : "分析视频"}
        </button>
      </div>
      <div className="w-[399px] h-[500px] overflow-y-auto rounded-xl bg-[#F5F5F5]">
        {
          subtitleObj && subtitleObj.map((item, index) => (
            <div key={index} className='flex p-3 mb-5 text-sm'>
              <span className='mr-7'>00:{Math.round(item.StartMs/1000)}</span>
              <span>{item.FinalSentence}</span>
            </div>
          ))
        }
      </div>
      <div className="flex-1">
        <MarkmapHooks data={initValue} />
      </div>
    </div>
  );
}

export default Page;
