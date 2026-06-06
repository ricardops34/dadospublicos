import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

import { CnpjModule } from './modules/cnpj/cnpj.module';
import { CnpjRaizModule } from './modules/cnpj-raiz/cnpj-raiz.module';
import { PesquisaModule } from './modules/pesquisa/pesquisa.module';
import { GeocodeModule } from './modules/geocode/geocode.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConsumoModule } from './modules/consumo/consumo.module';
import { EtlModule } from './modules/etl/etl.module';
import { HealthModule } from './modules/health/health.module';
import { PlanosModule } from './modules/planos/planos.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { AssinaturasModule } from './modules/assinaturas/assinaturas.module';
import { FaturasModule } from './modules/faturas/faturas.module';
import { AdminModule } from './modules/admin/admin.module';
import { PortalModule } from './modules/portal/portal.module';
import { AnalyticsLpModule } from './modules/analytics-lp/analytics-lp.module';
import { AccessLogModule } from './modules/access-log/access-log.module';
import { AccessLogMiddleware } from './modules/access-log/access-log.middleware';
import { SuporteModule } from './modules/suporte/suporte.module';
import { ParametrosModule } from './modules/parametros/parametros.module';
import { RedisCacheModule } from './modules/redis-cache/redis-cache.module';
import { EmailModule } from './modules/email/email.module';
import { ParametrosService } from './modules/parametros/parametros.service';
import { InterPixModule } from './modules/inter-pix/inter-pix.module';
import { Painel360Module } from './modules/painel-360/painel-360.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get('DB_HOST', 'localhost'),
        port: cfg.get<number>('DB_PORT', 5432),
        username: cfg.get('DB_USER', 'rfb_user'),
        password: cfg.get('DB_PASSWORD', ''),
        database: cfg.get('DB_NAME', 'dados_rfb'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    TypeOrmModule.forRootAsync({
      name: 'buscadados',
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get('DB_HOST', 'localhost'),
        port: cfg.get<number>('DB_PORT', 5432),
        username: cfg.get('DB_USER', 'rfb_user'),
        password: cfg.get('DB_PASSWORD', ''),
        database: cfg.get('DB_SISTEMA_NAME', 'buscadados'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    TypeOrmModule.forRootAsync({
      name: 'viacep',
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get('DB_HOST', 'localhost'),
        port: cfg.get<number>('DB_PORT', 5432),
        username: cfg.get('DB_USER', 'rfb_user'),
        password: cfg.get('DB_PASSWORD', ''),
        database: cfg.get('DB_VIACEP_NAME', 'dados_viacep'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    ScheduleModule.forRoot(),

    // Rate limit padrão para plano gratuito — ApiRateLimitGuard customizado validará os tokens
    ThrottlerModule.forRootAsync({
      imports: [ParametrosModule, ConfigModule],
      inject: [ParametrosService, ConfigService],
      useFactory: async (params: ParametrosService, config: ConfigService) => {
        const host = config.get('REDIS_HOST') || await params.getValor('REDIS_HOST', 'localhost');
        const port = config.get('REDIS_PORT') || await params.getValor('REDIS_PORT', '6379');
        return {
          throttlers: [{ ttl: 60000, limit: 3 }],
          storage: new ThrottlerStorageRedisService(`redis://${host}:${port}`),
        };
      },
    }),

    // Infra
    RedisCacheModule,
    EmailModule,
    AdminModule,
    AuthModule,
    PortalModule,
    AccessLogModule,
    ParametrosModule,

    // API de dados
    CnpjModule,
    CnpjRaizModule,
    PesquisaModule,
    GeocodeModule,
    ConsumoModule,
    EtlModule,
    HealthModule,

    // Analytics
    AnalyticsLpModule,
    SuporteModule,

    // Plataforma comercial
    PlanosModule,
    ClientesModule,
    AssinaturasModule,
    FaturasModule,
    Painel360Module,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AccessLogMiddleware)
      .forRoutes({ path: 'cnpj/*path', method: RequestMethod.ALL },
                 { path: 'cnpj', method: RequestMethod.ALL },
                 { path: 'cnpj-raiz/*path', method: RequestMethod.ALL },
                 { path: 'cnpj-raiz', method: RequestMethod.ALL },
                 { path: 'pesquisa/*path', method: RequestMethod.ALL },
                 { path: 'pesquisa', method: RequestMethod.ALL },
                 { path: 'geocode/*path', method: RequestMethod.ALL },
                 { path: 'geocode', method: RequestMethod.ALL },
                 { path: 'suframa/*path', method: RequestMethod.ALL },
                 { path: 'suframa', method: RequestMethod.ALL },
                 { path: 'consumo/*path', method: RequestMethod.ALL },
                 { path: 'consumo', method: RequestMethod.ALL },
                 { path: 'mapa/*path', method: RequestMethod.ALL },
                 { path: 'mapa', method: RequestMethod.ALL });
  }
}
