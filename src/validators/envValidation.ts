import { cleanEnv, email, str, num } from 'envalid'

const env = cleanEnv(process.env, {
  PORT: num({ default: 3333 }),
  MONGODB_URI: str(),
  JWT_SECRET_KEY: str(),
  JWT_REFRESH_KEY: str(),
  JWT_CONFIRM_KEY: str(),
  JWT_RESET_KEY: str(),
  EMAIL: email(),
  EMAIL_PASSWORD: str(),
  BASE_URL: str(),
  AUTH_CLIENT_URL: str(),
})

export default env
