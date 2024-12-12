import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator'
import { Roles } from '../enums'

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'Informe o nome do usuário',
  })
  name: string

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty({
    message: 'Informe o e-mail do usuário',
  })
  email: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'Informe o CPF do usuário',
  })
  @Length(11, 11)
  @Transform(({ value }) => value.replace(/\D/g, ''))
  cpf: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'Informe o telefone do usuário',
  })
  @Transform(({ value }) => value.replace(/\D/g, ''))
  telephone: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'Informe a senha do usuário',
  })
  password: string

  @ApiProperty()
  @IsEnum(Roles)
  @IsNotEmpty({
    message: 'Informe o papel do usuário',
  })
  role: Roles
}
