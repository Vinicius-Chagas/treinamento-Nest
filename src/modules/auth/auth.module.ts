import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UsersModule } from '../users/users.module'
import { JwtStrategy } from './strategy/jwt.strategy'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ForgotPassword } from './entities/forgot-password.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([ForgotPassword]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: `${process.env.JWT_SECONDS_EXPIRE}s` },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
