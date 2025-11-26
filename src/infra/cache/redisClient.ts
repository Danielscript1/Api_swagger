import { createClient } from 'redis';
import { env } from '../config/env';


const url = env.REDIS_PASSWORD
  ? `redis://default:${env.REDIS_PASSWORD}@${env.REDIS_HOST}:${env.REDIS_PORT}`
  : `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`;


export const redisClient = createClient({
  url,
});

redisClient.on('connect', () => {
  console.log('[Redis] conectando...');
});

redisClient.on('ready', () => {
  console.log('[Redis] pronto para uso');
});

redisClient.on('error', (err) => {
  console.error('[Redis] erro', err);
});

redisClient.on('end', () => {
  console.log('[Redis] conexão fechada');
});

export async function initRedis(): Promise<void> {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}
