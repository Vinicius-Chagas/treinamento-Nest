import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({
    message: 'Informe a nova senha',
  })
  @ApiProperty()
  password: string

  @IsString()
  @IsNotEmpty({
    message: 'Informe o token',
  })
  @ApiProperty()
  token: string
}
