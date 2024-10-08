export default function getHost() {
  switch (process.env.VERCEL_ENV) {
    case 'production':
    case 'preview':
      // return 'https://x-answer-aidc-fe.vercel.app'
      return 'https://thrift.xanswer.com'
    case 'development':
    default:
      return 'http://localhost:3000'
  }
}