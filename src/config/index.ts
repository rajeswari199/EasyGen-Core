export default () => ({
  port: Number(process.env.PORT),
  apiBaseUrl: process.env.API_BASE_URL,
  backendPrefix: process.env.BACKEND_PREFIX,
  MongoURI: process.env.MONGO_URI,
  jwtAccessTokenTTL: Number(process.env.JWT_ACCESS_TOKEN_TTL),
  jwtSecretKey: process.env.JWT_SECRET_KEY,
});
