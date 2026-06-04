import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePlanoDto {
  @ApiProperty({ example: 'Básico' }) @IsString() nome: string;
  @ApiProperty({ example: 'basico' }) @IsString() slug: string;
  @ApiPropertyOptional() @IsOptional() @IsString() descricao?: string;
  @ApiProperty({ example: 99 }) @IsNumber() precoMensal: number;
  @ApiPropertyOptional({ example: 534.6 }) @IsOptional() @IsNumber() precoSemestral?: number;
  @ApiPropertyOptional({ example: 1009.8 }) @IsOptional() @IsNumber() precoAnual?: number;
  @ApiPropertyOptional({ example: 160000 }) @IsOptional() @IsInt() limiteMensal?: number;
  @ApiProperty({ example: 120 }) @IsInt() @Min(1) rateLimitPorMinuto: number;
  @ApiPropertyOptional({ default: true }) @IsOptional() @IsBoolean() acessoCnpj?: boolean;
  @ApiPropertyOptional({ default: false }) @IsOptional() @IsBoolean() acessoCnpjRaiz?: boolean;
  @ApiPropertyOptional({ default: false }) @IsOptional() @IsBoolean() acessoPesquisa?: boolean;
  @ApiPropertyOptional({ default: false }) @IsOptional() @IsBoolean() acessoGeocode?: boolean;
  @ApiPropertyOptional({ default: false }) @IsOptional() @IsBoolean() acessoSuframa?: boolean;
  @ApiPropertyOptional({ default: false }) @IsOptional() @IsBoolean() acessoMapa?: boolean;
  @ApiPropertyOptional({ default: 0 }) @IsOptional() @IsInt() ordem?: number;
  @ApiPropertyOptional({ default: false }) @IsOptional() @IsBoolean() maisPopular?: boolean;
  @ApiPropertyOptional({ example: 'Mais popular' }) @IsOptional() @IsString() seloDestaque?: string;
}
