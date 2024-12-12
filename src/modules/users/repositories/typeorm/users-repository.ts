import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { CreateUserDto } from '../../dto/create-user.dto'
import { PaginateParams } from 'src/common/utils/DTOs/paginate-params.dto'
import { paginateData } from 'src/common/utils/paginate-data'
import { User } from '../../entities/user.entity'


@Injectable()
export class UsersRepository extends Repository<User>{
  constructor(
    dataSource: DataSource,
    
  ) {
    super(User, dataSource.createEntityManager())
  }

  async _create(data: CreateUserDto) {
    const user = this.create(data)

    return await this.save(user)
  }

  async _findAll(
    { page, limit, search, active }: PaginateParams,
    userId: number,
  ) {
    const queryBuilder = this.createQueryBuilder('Users')
      .select([
        'Users.id',
        'Users.name',
        'Users.email',
        'Users.cpf',
        'Users.active',
      ])
      .where('Users.id != :userId', { userId })
      .orderBy('Users.name', 'ASC')

    if (search) {
      queryBuilder.andWhere('Users.name LIKE :q', { q: `%${search}%` })
    }

    if (active !== null) {
      queryBuilder.andWhere('Users.active = :active', { active })
    }

    const data = await paginateData(page, limit, queryBuilder)

    return data
  }

  async _findOneById(id: number) {
    const user = await this.findOne({
      where: {
        id,
      },
    })

    return {
      user,
    }
  }

  async _findUserByCpf(cpf: string): Promise<{ user: User | null }> {
    const user = await this.findOne({
      where: {
        cpf,
      },
    })

    return {
      user,
    }
  }

  async _update(id: number, data: Partial<User>) {
    return await this.save({ id, ...data })
  }

  async _findUserByEmail(email: string): Promise<{ user: User | null }> {
    const user = await this.findOne({
      where: {
        email,
      },
    })

    return {
      user,
    }
  }
}
