import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import {
    ForbiddenInvalidCredentials,
    InternalServerError,
} from 'src/common/errors'
import { comparePassword, hashPassword } from 'src/common/utils/bcrypt'
import { generateToken } from 'src/common/utils/generate-token'
import { sendEmailWelcomeUser } from 'src/mails'
import { sendEmail } from 'src/mails/send-mail'
import { changePasswordSuccessTemplate } from 'src/mails/templates/change-password-success'
import { Repository } from 'typeorm'
import { LoginDto } from '../auth/dto/login.dto'
import { ForgotPassword } from '../auth/entities/forgot-password.entity'
import { ChangePasswordDto } from './dto/change-password.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { ConflictUser, NotFoundUser } from './errors'
import { UsersRepository } from './repositories/typeorm/users-repository'
import { PaginateParams } from 'src/common/utils/DTOs/paginate-params.dto'
import { deleteFile } from 'src/common/utils/delete-file'

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService,

    @InjectRepository(ForgotPassword)
    private readonly forgotPasswordRepository: Repository<ForgotPassword>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { user: userByCpf } = await this.usersRepository._findUserByCpf(
      createUserDto.cpf,
    )

    if (userByCpf) {
      throw new ConflictUser('CPF')
    }

    const { user: userByEmail } = await this.usersRepository._findUserByEmail(
      createUserDto.email,
    )

    if (userByEmail) {
      throw new ConflictUser('e-mail')
    }

    const { hashPassword: password } = await hashPassword(
      createUserDto.password
    )

    try {
      const user = await this.usersRepository._create({
        ...createUserDto,
        password,
      })

      this.sendEmailWelcome(user)
    } catch (e) {
      throw new InternalServerError()
    }
  }

  async findAll(dto: PaginateParams, user: User) {
    return this.usersRepository._findAll(dto, user.id)
  }

  async findOne(id: number) {
    const { user } = await this.usersRepository._findOneById(id)

    if (!user) {
      throw new NotFoundUser()
    }

    return {
      user,
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ) {
    const { user } = await this.findOne(id)

    if (updateUserDto?.cpf && user.cpf !== updateUserDto.cpf) {
      const { user: userByCpf } = await this.usersRepository._findUserByCpf(
        updateUserDto.cpf,
      )

      if (userByCpf) {
        throw new ConflictUser('CPF')
      }
    }

    if (updateUserDto?.email && user.email !== updateUserDto.email) {
      const { user: userByEmail } = await this.usersRepository._findUserByEmail(
        updateUserDto.email,
      )

      if (userByEmail) {
        throw new ConflictUser('e-mail')
      }
    }

    try {
      return await this.usersRepository._update(user.id, updateUserDto)
    } catch (e) {
      throw new InternalServerError()
    }
  }

  async findOneByEmail(email: string) {
    const { user } = await this.usersRepository._findUserByEmail(email)

    if (!user) {
      throw new NotFoundUser()
    }

    return {
      user,
    }
  }

  async checkCredentials(dto: LoginDto) {
    const { user } = await this.usersRepository._findUserByEmail(dto.email)

    if (!user) {
      throw new ForbiddenInvalidCredentials()
    }

    const userWithPassword = await this.usersRepository.findOne({
      where: {
        id: user.id,
      },
      select: ['password'],
    })

    if (!userWithPassword) {
      throw new ForbiddenInvalidCredentials()
    }

    const { isMatch } = await comparePassword(
      dto.password,
      userWithPassword.password,
    )

    if (!isMatch) {
      throw new ForbiddenInvalidCredentials()
    }

    return {
      user,
    }
  }

  async toggleActive(id: number) {
    const { user } = await this.findOne(id)

    try {
      await this.usersRepository.update(user.id, {
        active: !user.active,
      })
    } catch (e) {
      throw new InternalServerError()
    }
  }

  async changePassword(userAuth: User, dto: ChangePasswordDto): Promise<void> {
    const { user } = await this.checkCredentials({
      email: userAuth.email,
      password: dto.currentPassword,
    })

    await this.updatePassword(user, dto.password)
  }

  async updatePassword(user: User, newPassword: string): Promise<void> {
    const { hashPassword: password } = await hashPassword(String(newPassword))

    try {
      await this.usersRepository.update(user.id, {
        password,
      })

      const frontUrl = process.env.FRONT_APP_URL

      if(!frontUrl) throw new Error()

      const html = changePasswordSuccessTemplate(
        frontUrl
      )

      await sendEmail(
        user.email,
        'ABC | Você alterou sua senha de acesso',
        html,
      )
    } catch (e) {
      throw new InternalServerError()
    }
  }

  private async sendEmailWelcome(user: User): Promise<void> {
    const { token } = generateToken()

    const forgotPassword = this.forgotPasswordRepository.create({
      token,
      isValid: true,
      user,
    })

    try {
      await this.forgotPasswordRepository.save(forgotPassword)

      await sendEmailWelcomeUser(user.email, token)
    } catch (e) {
      throw new InternalServerError()
    }
  }
}
