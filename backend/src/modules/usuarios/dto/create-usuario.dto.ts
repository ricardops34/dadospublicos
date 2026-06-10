import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

/** Item de CNAE secundário aceito como string (código) ou objeto { codigo, descricao } */
export type CnaeSecundarioInput = string | { codigo: string; descricao?: string | null };

export class CreateUsuarioDto {
  @ApiProperty({ example: 'João Silva' }) @IsString() nome: string;
  @ApiProperty({ example: 'joao@empresa.com' }) @IsEmail() email: string;
  @ApiProperty({ example: 'Senha@123', minLength: 8 }) @IsString() @MinLength(8) senha: string;
  @ApiPropertyOptional({ example: 'J', enum: ['F', 'J'] }) @IsOptional() @IsString() tipoPessoa?: 'F' | 'J';
  @ApiPropertyOptional() @IsOptional() @IsString() cpf?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dataNascimento?: string;
  @ApiPropertyOptional({ example: '12.345.678/0001-90' }) @IsOptional() @IsString() cnpj?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() razaoSocial?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() telefone?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() whatsapp?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() cep?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() logradouro?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() numero?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() complemento?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bairro?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() municipio?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() uf?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() inscricaoEstadual?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() inscricaoMunicipal?: string;
  @ApiPropertyOptional({ example: '6201501' }) @IsOptional() @IsString() cnaePrincipal?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cnaePrincipalDescricao?: string;
  @ApiPropertyOptional({ type: [String], description: 'Códigos de CNAE secundários (PJ)' }) @IsOptional() @IsArray() cnaesSecundarios?: CnaeSecundarioInput[];
  @ApiPropertyOptional({ enum: ['admin', 'cliente'] }) @IsOptional() @IsIn(['admin', 'cliente']) perfil?: 'admin' | 'cliente';
}

export class LoginUsuarioDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() senha: string;
}

/** Criação de usuário adicional do Cliente — feita pelo usuário principal */
export class CriarUsuarioClienteDto {
  @ApiProperty({ example: 'Maria Souza' }) @IsString() nome: string;
  @ApiProperty({ example: 'maria@empresa.com' }) @IsEmail() email: string;
  @ApiProperty({ example: '(11) 9 9999-9999' }) @IsString() telefone: string;
  @ApiProperty({ minLength: 8 }) @IsString() @MinLength(8) senha: string;
}

/** Edição de usuário do Cliente — feita pelo usuário principal */
export class EditarUsuarioClienteDto {
  @ApiPropertyOptional() @IsOptional() @IsString() nome?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() telefone?: string;
  @ApiPropertyOptional({ minLength: 8 }) @IsOptional() @IsString() @MinLength(8) senha?: string;
}

export class AgendarExclusaoDto {
  @ApiProperty({ enum: ['agora', 'fim-plano'] })
  @IsString()
  agendarPara: 'agora' | 'fim-plano';
}

export class RecuperarSenhaDto {
  @ApiProperty({ example: 'joao@empresa.com' }) @IsEmail() email: string;
}

export class VerificarEmailCodigoDto {
  @ApiProperty({ example: 'joao@empresa.com' }) @IsEmail() email: string;
  @ApiProperty({ example: '123456' }) @IsString() codigo: string;
}

export class UpdateUsuarioDto {
  @ApiPropertyOptional() @IsOptional() nome?: string;
  @ApiPropertyOptional({ example: 'avatar_05.png' }) @IsOptional() @IsString() avatar?: string;
  @ApiPropertyOptional() @IsOptional() onboardingPendente?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string;
  @ApiPropertyOptional({ minLength: 8 }) @IsOptional() @IsString() @MinLength(8) senha?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tipoPessoa?: 'F' | 'J';
  @ApiPropertyOptional() @IsOptional() @IsString() cpf?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dataNascimento?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cnpj?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() razaoSocial?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() telefone?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() whatsapp?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() cep?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() logradouro?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() numero?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() complemento?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bairro?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() municipio?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() uf?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() inscricaoEstadual?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() inscricaoMunicipal?: string;
  @ApiPropertyOptional({ example: '6201501' }) @IsOptional() @IsString() cnaePrincipal?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cnaePrincipalDescricao?: string;
  @ApiPropertyOptional({ type: [String], description: 'Códigos de CNAE secundários (PJ)' }) @IsOptional() @IsArray() cnaesSecundarios?: CnaeSecundarioInput[];
  @ApiPropertyOptional({ enum: ['admin', 'cliente'] }) @IsOptional() @IsIn(['admin', 'cliente']) perfil?: 'admin' | 'cliente';
}
