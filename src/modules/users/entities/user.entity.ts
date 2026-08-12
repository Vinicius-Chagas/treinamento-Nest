import { Column, Entity } from 'typeorm';
import { Roles } from '../enums';
import { AbstractEntity } from '../../../database/typeorm/abstract.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

@Entity({
  name: 'users',
})
export class User extends AbstractEntity<User> {
  @Column({
    type: 'varchar',
    nullable: false,
  })
  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'Informe o nome do usuário',
  })
  name: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
    length: 11,
  })
  cpf: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  telephone: string;

  @Column({
    type: 'varchar',
    nullable: false,
    select: false,
  })
  password: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: true,
  })
  @IsBoolean()
  active: boolean;

  @Column({ type: 'enum', enum: Roles, default: Roles.USER })
  role: Roles;
}
