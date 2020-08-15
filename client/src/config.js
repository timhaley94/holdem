export default {
  serverUrl: (
    process.env.NODE_ENV
      ? 'http://poker-app-ebs-prod.eba-bmep5uxm.us-east-2.elasticbeanstalk.com'
      : 'http://localhost:80'
  ),
  timUrl: 'https://timhaley.me',
  lauraUrl: 'http://thehaleycreative.com/',
};
