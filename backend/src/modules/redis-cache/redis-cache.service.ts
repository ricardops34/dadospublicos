import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisCacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisCacheService.name);
  private client: Redis;
  private available = false;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    const host = this.config.get<string>('REDIS_HOST', 'localhost');
    const port = this.config.get<number>('REDIS_PORT', 6379);
    this.client = new Redis({ host, port, lazyConnect: true, maxRetriesPerRequest: 1 });
    this.client
      .connect()
      .then(() => { this.available = true; this.logger.log(`Redis conectado em ${host}:${port}`); })
      .catch(err => this.logger.warn(`Redis indisponível (${err.message}) — cache desativado`));
  }

  async onModuleDestroy() {
    await this.client?.quit().catch(() => {});
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.available) return null;
    try {
      const val = await this.client.get(key);
      return val ? (JSON.parse(val) as T) : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    if (!this.available) return;
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch { }
  }

  async del(...keys: string[]): Promise<void> {
    if (!this.available || !keys.length) return;
    try { await this.client.del(...keys); } catch { }
  }

  async delPattern(pattern: string): Promise<void> {
    if (!this.available) return;
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length) await this.client.del(...keys);
    } catch { }
  }
}
