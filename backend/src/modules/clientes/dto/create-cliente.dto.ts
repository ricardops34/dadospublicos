import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({ example: 'João Silva' })    @IsString()              nome: string;
  @ApiProperty({ example: 'joao@empresa.com' }) @IsEmail()            email: string;
  @ApiProperty({ example: 'Senha@123', minLength: 8 }) @IsString() @MinLength(8) senha: string;
  @ApiPropertyOptional({ example: '12.345.678/0001-90' }) @IsOptional() @IsString() cnpj?: string;
  @ApiPropertyOptional()                      @IsOptional() @IsString() razaoSocial?: string;
  @ApiPropertyOptional()                      @IsOptional() @IsString() telefone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cep?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() logradouro?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() numero?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() complemento?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bairro?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() municipio?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() uf?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() inscricaoEstadual?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() inscricaoMunicipal?: string;
}

export class LoginClienteDto {
  @ApiProperty() @IsEmail()   email: string;
  @ApiProperty() @IsString()  senha: string;
}

export class RecuperarSenhaDto {
  @ApiProperty({ example: 'joao@empresa.com' }) @IsEmail() email: string;
}

export class UpdateClienteDto {
  @ApiPropertyOptional() @IsOptional() @IsString() nome?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cnpj?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() razaoSocial?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() telefone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cep?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() logradouro?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() numero?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() complemento?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bairro?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() municipio?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() uf?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() inscricaoEstadual?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() inscricaoMunicipal?: string;
}
