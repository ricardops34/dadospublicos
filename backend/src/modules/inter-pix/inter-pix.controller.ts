import { Controller, Post, Body, Req, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
// import { FaturasService } from '../faturas/faturas.service'; 
// (Implementaremos a baixa no FaturasService no futuro, ou em breve)

@ApiTags('Webhooks PIX')
@Controller('webhooks/inter/pix')
export class InterPixController {
  private readonly logger = new Logger(InterPixController.name);

  // constructor(private faturasService: FaturasService) {}

  @Post()
  @ApiOperation({ summary: 'Recebe notificação de pagamento do Banco Inter' })
  async webhookRecebimento(@Req() req: any, @Body() body: any) {
    this.logger.log('Recebida notificação de Webhook PIX');
    
    // Formato de resposta do Banco Inter:
    // { "pix": [ { "txid": "...", "valor": "...", "horario": "..." } ] }
    if (body && body.pix && Array.isArray(body.pix)) {
      for (const pix of body.pix) {
        const txid = pix.txid;
        this.logger.log(`Pagamento confirmado via webhook para o TXID: ${txid}`);
        
        // TODO: Chamar this.faturasService.marcarComoPaga(txid)
      }
    }

    return { received: true };
  }
}
