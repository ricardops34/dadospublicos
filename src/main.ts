import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

// Módulos expostos publicamente na documentação
import { CnpjModule } from './modules/cnpj/cnpj.module';
import { CnpjRaizModule } from './modules/cnpj-raiz/cnpj-raiz.module';
import { PesquisaModule } from './modules/pesquisa/pesquisa.module';
import { GeocodeModule } from './modules/geocode/geocode.module';
import { ConsumoModule } from './modules/consumo/consumo.module';
import { HealthModule } from './modules/health/health.module';
import { PlanosModule } from './modules/planos/planos.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();

  const adminKey = process.env.ADMIN_KEY ?? '';

  // ── Swagger público — somente endpoints da API vendida ──────────────────────
  const configPublico = new DocumentBuilder()
    .setTitle('BuscaDados API')
    .setDescription(
      'API de dados públicos CNPJ — Receita Federal do Brasil.\n\n' +
      'Autenticação: envie seu token no header `x_api_token` ou query param `?token=...`\n\n' +
      'Para obter um token, crie uma conta em https://buscadados.com.br',
    )
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x_api_token', in: 'header' }, 'token')
    .build();

  const docPublico = SwaggerModule.createDocument(app, configPublico, {
    include: [CnpjModule, CnpjRaizModule, PesquisaModule, GeocodeModule, ConsumoModule, HealthModule, PlanosModule],
  });

  SwaggerModule.setup('docs', app, docPublico, {
    swaggerOptions: { persistAuthorization: true },
  });

  // ── Swagger interno — todos os endpoints, protegido por ADMIN_KEY ───────────
  const configInterno = new DocumentBuilder()
    .setTitle('BuscaDados — Documentação Interna')
    .setDescription('Todos os endpoints: API pública + portal + ETL + analytics + autenticação.')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x_api_token',  in: 'header' }, 'token')
    .addBearerAuth()
    .build();

  const docInterno = SwaggerModule.createDocument(app, configInterno);

  // Middleware que protege /docs-admin com x_admin_key
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.use('/docs-admin', (req: any, res: any, next: any) => {
    const key = req.headers['x_admin_key'] ?? req.query?.admin_key;
    if (!adminKey || key === adminKey) return next();
    res.status(401).json({ message: 'Acesso negado. Envie x_admin_key válida.' });
  });

  SwaggerModule.setup('docs-admin', app, docInterno, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`RFB Data Service rodando em http://localhost:${port}`);
  console.log(`Swagger público em  http://localhost:${port}/docs`);
  console.log(`Swagger interno em  http://localhost:${port}/docs-admin  (requer x_admin_key)`);
}

bootstrap();
