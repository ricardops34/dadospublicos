import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginPortalDto {
  @IsEmail({}, { message: 'E-mail inválido.' })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  senha: string;
}
