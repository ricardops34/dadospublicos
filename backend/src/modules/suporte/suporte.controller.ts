import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { SuporteService, ContatoDto } from './suporte.service';

class ContatoBodyDto implements ContatoDto {
  @IsString() @IsNotEmpty() @MaxLength(100) nome: string;
  @IsEmail()  @IsNotEmpty()                 email: string;
  @IsString() @IsNotEmpty() @MaxLength(2000) mensagem: string;
}

@ApiTags('Suporte')
@Controller('suporte')
export class SuporteController {
  constructor(private readonly svc: SuporteService) {}

  @Get('config')
  @ApiOperation({ summary: 'Configurações públicas do canal de suporte (WhatsApp, atendente, msg)' })
  config() {
    const cfg = this.svc.getConfig();
    // Nunca expõe o e-mail de destino publicamente
    return {
      whatsappNumero:     cfg.whatsappNumero,
      atendente:          cfg.atendente,
      mensagemBoasVindas: cfg.mensagemBoasVindas,
    };
  }

  @Post('contato')
  @ApiOperation({ summary: 'Recebe mensagem do chat e envia e-mail ao suporte' })
  contato(@Body() dto: ContatoBodyDto) {
    return this.svc.enviarContato(dto);
  }
}
