import { envs } from "./envs";

/**
 * Setting for redies connection
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const _connectionOpts: any = {
  pkg: "ioredis",
  host: envs.REDIS_URL,
  username: envs.REDIS_USERNAME,
  password: envs.REDIS_PASSWORD,
  port: envs.REDIS_PORT,
  database: envs.REDIS_DATABASE || 3,
  options: { password: envs.REDIS_PASSWORD },
};