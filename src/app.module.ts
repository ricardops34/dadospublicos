import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';

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

    ScheduleModule.forRoot(),

    // Rate limit padrão para plano gratuito — AuthGuard sobrescreve para tokens pagos
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 3 }]),

    // Infra
    AdminModule,
    AuthModule,
    PortalModule,
    AccessLogModule,

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

    // Plataforma comercial
    PlanosModule,
    ClientesModule,
    AssinaturasModule,
    FaturasModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AccessLogMiddleware)
      .forRoutes({ path: 'cnpj*', method: RequestMethod.ALL },
                 { path: 'cnpj-raiz*', method: RequestMethod.ALL },
                 { path: 'pesquisa*', method: RequestMethod.ALL },
                 { path: 'geocode*', method: RequestMethod.ALL },
                 { path: 'suframa*', method: RequestMethod.ALL },
                 { path: 'consumo*', method: RequestMethod.ALL },
                 { path: 'mapa*', method: RequestMethod.ALL });
  }
}
