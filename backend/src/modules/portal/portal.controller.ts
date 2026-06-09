import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { PortalService } from './portal.service';
import { LoginPortalDto } from './dto/login-portal.dto';
import { AdminGuard } from '../admin/admin.guard';
import { JwtPortalGuard } from './jwt-portal.guard';

class SeedAdminDto {
  @IsEmail() email: string;
  @IsNotEmpty() @MinLength(8) senha: string;
  @IsNotEmpty() nome: string;
}

class TrocarSenhaDto {
  @IsNotEmpty() senhaAtual: string;
  @IsNotEmpty() @MinLength(8) novaSenha: string;
}

@ApiTags('Portal')
@Controller('portal')
export class PortalController {
  constructor(private readonly service: PortalService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login unificado — retorna JWT com perfil (admin | cliente)' })
  login(@Body() dto: LoginPortalDto) {
    return this.service.login(dto);
  }

  @Patch('me/senha')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('token')
  @ApiOperation({ summary: 'Troca a senha do usuário autenticado' })
  trocarSenha(@Req() req: any, @Body() dto: TrocarSenhaDto) {
    return this.service.trocarSenha(req.usuario.sub, dto.senhaAtual, dto.novaSenha);
  }

  @Post('seed-admin')
  @UseGuards(AdminGuard)
  @ApiSecurity('token')
  @ApiOperation({ summary: '[Admin] Cria ou promove usuário a admin' })
  seedAdmin(@Body() dto: SeedAdminDto) {
    return this.service.seedAdmin(dto.email, dto.senha, dto.nome);
  }
}
