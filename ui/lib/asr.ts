const tencentcloud: any = require("tencentcloud-sdk-nodejs-asr");

//腾讯sdk
const AsrClient = tencentcloud.asr.v20190614.Client;

const clientConfig = {
  credential: {
    a: 1
  },
  region: "",
  profile: {
    httpProfile: {
      endpoint: "asr.tencentcloudapi.com",
    },
  },
};

const client = new AsrClient(clientConfig);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

//轮询查询语音识别任务
const pullRecTask = async (TaskId: any) => {
  const params = { TaskId };

  try {
    const data = await client.DescribeTaskStatus(params);
    const {
      Data: { Status, Result, ResultDetail },
    } = data;

    if (Status === 2) {
      console.log(Result);
      console.log("\n------------------------\n");
      console.log(ResultDetail);
      return {
        result: Result,
        resultDetail: ResultDetail
      }
    } else if (Status === 3) {
      console.log("提取失败");
      return "";
    } else {
      await sleep(3000); // 等待 3 秒
      return await pullRecTask(TaskId); // 递归调用
    }
  } catch (err) {
    console.error("error", err);
    return "";
  }
};

// 腾讯语音识别
export const useTecentAsr = async (filePath: string) => {
  // const base64Audio = fileToBase64(filePath);
  const params = {
    EngineModelType: "16k_zh_large",
    SourceType: 0,
    Url: filePath,
    // Data: filePath,
    ChannelNum: 1,
    ResTextFormat: 3,
  };

  try {
    const data = await client.CreateRecTask(params);
    const {
      Data: { TaskId },
    } = data;

    const result = await pullRecTask(TaskId);
    return result;
  } catch (err) {
    console.error("error", err);
    return "";
  }
};
