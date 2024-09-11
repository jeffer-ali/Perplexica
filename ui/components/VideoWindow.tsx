'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom'
import Error from 'next/error';
import { cn } from '@/lib/utils';
import { ImageDown, Maximize, Minimize, LayoutList, LayoutGrid } from 'lucide-react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VideoChatWindow from '@/components/VideoChatWindow'
import MarkmapHooks from '@/components/markmap/markmap-hooks'

export type VideoInfo = {
  messageId: string;
  chatId: string;
  createdAt: Date;
  content: string;
  role: 'user' | 'assistant';
  suggestions?: string[];
};

const loadVideoData = async (
  id: string,
  setVideoInfo: (info: VideoInfo) => void,
  setNotFound: (notFound: boolean) => void,
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/video/${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (res.status === 404) {
    setNotFound(true);
    return;
  }

  const data = await res.json();

  const VideoInfo = {
      ...data.info,
      ...JSON.parse(data.metadata),
  };

  setVideoInfo(VideoInfo);
};

const VideoWindow = ({ 
  id
}: { 
  id: string
}) => {
  const [isReady, setIsReady] = useState(false);
  const [loadChat, setLoadChat] = useState(false);
  const [videoChatId, setVideoChatId] = useState('');
  const [intialInput, setIntialInput] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo>();
  const [markmapData, setMarkmapData] = useState('');
  const [newScene, setNewScene] = useState<any>()
  const [scene, setScene] = useState([{
    startTime: 0,
    endTime: 14000,
    url: '/videos/output/frame-0001.png'
  }, {
    startTime: 14000,
    endTime: 20000,
    url: '/videos/output/frame-0151.png'
  }, {
    startTime: 20000,
    endTime: 25000,
    url: '/videos/output/frame-0301.png'
  }, {
    startTime: 25000,
    endTime: 27000,
    url: '/videos/output/frame-0451.png'
  }, {
    startTime: 27000,
    endTime: 36000,
    url: '/videos/output/frame-0601.png'
  }]);
  const [subtitles, setSubtitles] = useState({
    result: 'aaaaaaaa',
    resultDetail: [{
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
    }]
  });

  const streamOutput = (text: string) => {
    const lines = text.split('\n');
    let accumulatedText = '';

    lines.map((line, index) => {
      setTimeout(() => {
        accumulatedText += line + '\n';
        setMarkmapData(accumulatedText);
      }, index * 100); // 每隔500毫秒输出一行，可以根据需要调整时间间隔
    });
  }

  useEffect(() => {
    (async() => {
      // await loadVideoData(id, setVideoInfo, setNotFound)
      setIsReady(true)
      setLoadChat(true)
      // setVideoChatId('e0382e783093c157977312ce824b4459dbe371a1')
      setIntialInput('怎么改写视频文案')
const addTxt = `
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
- nice`;
streamOutput(addTxt)

    })()    
  }, []);

  useEffect(() => {
    if(subtitles?.resultDetail && subtitles?.resultDetail.length > 0) {
      const newScene = scene.map(s => {
        // 找出当前 scene 包含的 subtitles
        const relatedSubtitles = subtitles.resultDetail.filter(sub => 
          sub.StartMs >= s.startTime && sub.StartMs <= s.endTime
        );

        // 返回新的 scene 对象，添加 relatedSubtitles 属性
        return {
          ...s,
          relatedSubtitles
        };
      });

      setNewScene(newScene);
      console.log(newScene)
    }
  }, [scene, subtitles]);

  return isReady ? (
    notFound ? (
      <Error statusCode={404} />
    ) : (
      <>
        <div className="fixed z-40 top-0 left-0 right-0 px-4 lg:pl-[104px] lg:pr-6 lg:px-8 flex flex-row items-center justify-center w-full py-4 text-sm text-black dark:text-white/70 border-b bg-light-secondary dark:bg-dark-secondary border-light-100 dark:border-dark-200">
          <p className="hidden lg:flex">title</p>
        </div>
        <div className="w-full flex py-20 space-x-5">
          <div className="w-[270px]">
            <div className="sticky top-10">
              <div className="w-[270px] aspect-video">
                <video src={'/videos/input.mp4'} width="270" controls></video>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="h-7 bg-black rounded-md text-white">
                  share Link
                </button>
                {/* <button className="h-7 bg-black rounded-md text-white" onClick={handleLoadChat}>
                  一键改编
                </button> */}
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline">Open Drawer</Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="flex flex-col mx-auto w-full max-w-screen-lg h-screen-200">
                      <DrawerHeader>
                        <DrawerTitle>问一问 AI</DrawerTitle>
                        <DrawerDescription>可以继续描述你的改写需求</DrawerDescription>
                      </DrawerHeader>
                      <div className="flex-1 overflow-y-auto">
                        <VideoChatWindow id={videoChatId} intialInput={intialInput} sendChatId={setVideoChatId} />
                      </div>
                      <DrawerClose asChild>
                        <Button className='absolute top-5 right-5' variant="outline">关闭对话</Button>
                      </DrawerClose>
                    </div>
                  </DrawerContent>
                </Drawer>
                <button className="h-7 bg-black rounded-md text-white">
                  share Link
                </button>
                <button className="h-7 bg-black rounded-md text-white">
                  share Link
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-5">
            <div className="grid grid-cols-3 gap-5 text-card-foreground">
              <div className='shadow-sm rounded-lg bg-card px-6 py-4'>
                <div className="">平台</div>
                <div>Tiktok</div>
              </div>
              <div className='shadow-sm rounded-lg bg-card px-6 py-4'>
                <div className="">时长</div>
                <div>20秒</div>
              </div>
              <div className='shadow-sm rounded-lg bg-card px-6 py-4'>
                <div className="">平台</div>
                <div>Tiktok</div>
              </div>
              <div className='shadow-sm rounded-lg bg-card px-6 py-4'>
                <div className="">观看数</div>
                <div>Tiktok</div>
              </div>
              <div className='shadow-sm rounded-lg bg-card px-6 py-4'>
                <div className="">点赞数</div>
                <div>Tiktok</div>
              </div>
              <div className='shadow-sm rounded-lg bg-card px-6 py-4'>
                <div className="">评论数</div>
                <div>Tiktok</div>
              </div>
            </div>

            <div className="relative h-80 shadow-sm rounded-lg bg-card">
                <MarkmapHooks data={markmapData} />
                <div className='absolute right-4 bottom-4 space-x-2'>
                  <Button variant="outline" size="icon">
                    <ImageDown size={20} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Maximize size={20} />
                  </Button>
                </div>
            </div>

            <div className="p-8 shadow-sm rounded-lg bg-card text-card-foreground">
              <Tabs defaultValue="list" className="w-full">
                <TabsList className='w-full'>
                  <TabsTrigger value="list">
                    <LayoutList size={25} />
                  </TabsTrigger>
                  <TabsTrigger value="grid">
                    <LayoutGrid size={25} />
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="list">
                  <div>
                    <table className="border-collapse">
                      <thead>
                        <tr className='text-[#A0AEC0] text-left'>
                          <th className='px-6 py-3 border-b border-tbborder'>场景</th>
                          <th className='w-[100px] px-0 py-3 border-b border-tbborder'></th>
                          <th className='px-6 py-3 border-b border-tbborder'>文案</th>
                        </tr>
                      </thead>
                      <tbody>
                      {newScene && newScene.map((s:any, sceneIndex:any) => (
                        (s.relatedSubtitles && s.relatedSubtitles.length > 0) ? (
                          s.relatedSubtitles.map((subtitle:any, subtitleIndex:any) => (
                            <tr key={`${sceneIndex}-${subtitleIndex}`}>
                              {subtitleIndex === 0 && (
                                <td className='px-6 py-3 border-b border-tbborder' rowSpan={s.relatedSubtitles.length}>
                                  <img src={s.url} width="100" alt={`Scene ${sceneIndex}`} />
                                </td>
                              )}
                              <td className='px-0 py-3 text-sm border-b border-tbborder'>
                                <p className="">
                                  {`${(subtitle.StartMs / 1000).toFixed(2)} - ${(subtitle.EndMs / 1000).toFixed(2)}`}
                                </p>
                              </td>
                              <td className='px-6 py-3 border-b border-tbborder'>
                                <p className="">
                                  {subtitle.FinalSentence}
                                </p>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr key={`${sceneIndex}`}>
                            <td className='px-6 py-3 border-b border-tbborder'>
                              <img src={s.url} alt={`Scene ${sceneIndex}`} />
                            </td>
                            <td className='px-6 py-3 border-b border-tbborder'></td>
                            <td className='px-6 py-3 border-b border-tbborder'>无字幕</td>
                          </tr>
                        )
                      ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                <TabsContent value="grid">
                  <div className='grid grid-cols-3 gap-4'>
                  {newScene && newScene.map((s:any, sceneIndex:any) => (
                    <div key={`scene-${sceneIndex}`}>
                      <div className=''>
                        <img src={s.url} alt={`Scene ${sceneIndex}`} />
                      </div>

                      <div className='px-3 py-2 text-sm'>
                      {(s.relatedSubtitles && s.relatedSubtitles.length > 0) ? (
                        s.relatedSubtitles.map((subtitle:any, subtitleIndex:any) => (
                          <p key={`sub-${subtitleIndex}`} className="line-clamp-1">
                            {subtitle.FinalSentence}
                          </p>
                        ))
                      ) : (
                        <p>无字幕</p>
                      )}
                      </div>
                    </div>
                  ))}
                  </div>
                </TabsContent>
              </Tabs>
              
            </div>
          </div>
        </div>
        {/* {loadChat && createPortal(
          <div className={cn('',
            openChatWindow ? '' : 'hidden'
          )}>
            <VideoChatWindow intialInput={intialInput} />
          </div>,
          document.body
        )} */}
      </>
    )
  ) : (
    <div className="flex flex-row items-center justify-center min-h-screen">
      <svg
        aria-hidden="true"
        className="w-8 h-8 text-light-200 fill-light-secondary dark:text-[#202020] animate-spin dark:fill-[#ffffff3b]"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100.003 78.2051 78.1951 100.003 50.5908 100C22.9765 99.9972 0.997224 78.018 1 50.4037C1.00281 22.7993 22.8108 0.997224 50.4251 1C78.0395 1.00281 100.018 22.8108 100 50.4251ZM9.08164 50.594C9.06312 73.3997 27.7909 92.1272 50.5966 92.1457C73.4023 92.1642 92.1298 73.4365 92.1483 50.6308C92.1669 27.8251 73.4392 9.0973 50.6335 9.07878C27.8278 9.06026 9.10003 27.787 9.08164 50.594Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4037 97.8624 35.9116 96.9801 33.5533C95.1945 28.8227 92.871 24.3692 90.0681 20.348C85.6237 14.1775 79.4473 9.36872 72.0454 6.45794C64.6435 3.54717 56.3134 2.65431 48.3133 3.89319C45.869 4.27179 44.3768 6.77534 45.014 9.20079C45.6512 11.6262 48.1343 13.0956 50.5786 12.717C56.5073 11.8281 62.5542 12.5399 68.0406 14.7911C73.527 17.0422 78.2187 20.7487 81.5841 25.4923C83.7976 28.5886 85.4467 32.059 86.4416 35.7474C87.1273 38.1189 89.5423 39.6781 91.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    </div>
  );
};

export default VideoWindow;
