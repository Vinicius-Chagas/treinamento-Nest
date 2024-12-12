import { ConflictException, NotFoundException } from '@nestjs/common'

export class ConflictUser extends ConflictException {
  constructor(attribute: string) {
    super(`Atenção! Já existe um usuário cadastrado com esse ${attribute}.`)
  }
}

export class NotFoundUser extends NotFoundException {
  constructor() {
    super('Usuário não encontrado.')
  }
}
