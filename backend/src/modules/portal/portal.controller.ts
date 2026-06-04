import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { PortalService } from './portal.service';
import { LoginPortalDto } from './dto/login-portal.dto';
import { AdminGuard } from '../admin/admin.guard';

class SeedAdminDto {
  @IsEmail() email: string;
  @IsNotEmpty() @MinLength(8) senha: string;
  @IsNotEmpty() nome: string;
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

  @Post('seed-admin')
  @UseGuards(AdminGuard)
  @ApiSecurity('token')
  @ApiOperation({ summary: '[Admin] Cria ou promove usuário a admin' })
  seedAdmin(@Body() dto: SeedAdminDto) {
    return this.service.seedAdmin(dto.email, dto.senha, dto.nome);
  }
}
