export default {
  serverUrl: (
    process.env.NODE_ENV === 'production'
      ? 'http://api.holdemhounds.com'
      : 'http://localhost:8080'
  ),
  timUrl: 'https://timhaley.me',
  lauraUrl: 'http://thehaleycreative.com/',
};
