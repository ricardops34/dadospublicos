import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('RFB Data Service')
    .setDescription('API de dados públicos CNPJ — Receita Federal do Brasil')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x_api_token', in: 'header' }, 'token')
    .build();

  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`RFB Data Service rodando em http://localhost:${port}`);
  console.log(`Swagger em http://localhost:${port}/docs`);
}

bootstrap();
