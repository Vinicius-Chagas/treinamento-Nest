import { Column, Entity } from 'typeorm'
import { Roles } from '../enums'
import { AbstractEntity } from '../../../database/typeorm/abstract.entity'

@Entity({
  name: 'users',
})
export class User extends AbstractEntity<User> {
  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  email: string

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
    length: 11,
  })
  cpf: string

  @Column({
    type: 'varchar',
    nullable: false,
  })
  telephone: string

  @Column({
    type: 'varchar',
    nullable: false,
    select: false,
  })
  password: string

  @Column({
    type: 'boolean',
    nullable: false,
    default: true,
  })
  active: boolean

  @Column({type: 'enum', enum: Roles,default: Roles.USER})
  role: Roles
}
