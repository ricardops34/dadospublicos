import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { CnaeSecundarioInput } from '../../usuarios/dto/create-usuario.dto';

export class CreateClienteDto {
  @ApiPropertyOptional({ enum: ['F', 'J'] }) @IsOptional() @IsString() tipoPessoa?: 'F' | 'J';
  @ApiPropertyOptional() @IsOptional() @IsString() nome?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cpf?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dataNascimento?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cnpj?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() razaoSocial?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nomeFantasia?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() porteEmpresa?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() situacaoCadastral?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() telefone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cep?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() logradouro?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() numero?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() complemento?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bairro?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() municipio?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() uf?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cnaePrincipal?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cnaePrincipalDescricao?: string;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() cnaesSecundarios?: CnaeSecundarioInput[];
  @ApiPropertyOptional() @IsOptional() @IsString() naturezaJuridicaCodigo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() naturezaJuridicaDescricao?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() inscricaoEstadual?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() inscricaoMunicipal?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() ativo?: boolean;
}

export class UpdateClienteDto extends CreateClienteDto {}
