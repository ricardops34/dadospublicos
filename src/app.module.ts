import { Module } from '@nestjs/common';
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

    // 3 req/min para plano gratuito (guard por token sobrescreve para pagos)
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 3 }]),

    CnpjModule,
    CnpjRaizModule,
    PesquisaModule,
    GeocodeModule,
    AuthModule,
    ConsumoModule,
    EtlModule,
    HealthModule,
  ],
})
export class AppModule {}
