import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class PesquisaDto {
  @ApiPropertyOptional({ example: '4711301' }) @IsOptional() @IsString() atividade_principal_id?: string;
  @ApiPropertyOptional({ example: '4711302' }) @IsOptional() @IsString() atividade_secundaria_id?: string;
  @ApiPropertyOptional({ example: 'SP' })      @IsOptional() @IsString() uf?: string;
  @ApiPropertyOptional({ example: '3550308' }) @IsOptional() @IsString() municipio_ibge?: string;
  @ApiPropertyOptional()                        @IsOptional() @IsString() razao_social?: string;
  @ApiPropertyOptional()                        @IsOptional() @IsString() nome_fantasia?: string;
  @ApiPropertyOptional({ example: '2062' })    @IsOptional() @IsString() natureza_juridica_id?: string;
  @ApiPropertyOptional({ example: '01', description: 'ME=01 EPP=03 Demais=05' }) @IsOptional() @IsString() porte_id?: string;
  @ApiPropertyOptional({ example: '02', description: '02=Ativa 04=Inapta 08=Baixada' }) @IsOptional() @IsString() situacao_cadastral?: string;
  @ApiPropertyOptional({ example: '01310100' }) @IsOptional() @IsString() cep?: string;
  @ApiPropertyOptional()                         @IsOptional() @IsDateString() data_inicio_atividade_de?: string;
  @ApiPropertyOptional()                         @IsOptional() @IsDateString() data_inicio_atividade_ate?: string;
  @ApiPropertyOptional()                         @IsOptional() @Transform(({ value }) => value === 'true') @IsBoolean() simples?: boolean;
  @ApiPropertyOptional()                         @IsOptional() @Transform(({ value }) => value === 'true') @IsBoolean() mei?: boolean;
  @ApiPropertyOptional({ default: 20 })          @IsOptional() @Type(() => Number) @IsNumber() @Min(1) @Max(100) limite?: number = 20;
  @ApiPropertyOptional()                         @IsOptional() @IsString() cursor?: string;
}
