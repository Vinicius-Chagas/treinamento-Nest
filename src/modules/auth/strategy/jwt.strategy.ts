import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ForbiddenError } from 'src/common/errors'
import { User } from 'src/modules/users/entities/user.entity'
import { Roles } from 'src/modules/users/enums'
import { UsersService } from 'src/modules/users/users.service'

export type PayloadType = {
  id: number,
  role: Roles
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    })
  }

  async validate(payload: PayloadType) {
    const { id } = payload

    const { user } = await this.usersService.findOne(id)

    if (!user.active) {
      throw new ForbiddenError()
    }

    return user
  }
}
