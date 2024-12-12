import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UsersRepository } from './repositories/typeorm/users-repository'
import { ForgotPassword } from '../auth/entities/forgot-password.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ForgotPassword]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
