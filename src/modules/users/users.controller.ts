import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseGuards,
  Query,
  Get,
  Param,
  Put,
  Patch,
  Delete,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { User } from './entities/user.entity'
import { UpdateUserDto } from './dto/update-user.dto'
import { ChangePasswordDto } from './dto/change-password.dto'
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard'
import { PaginateParams } from 'src/common/utils/DTOs/paginate-params.dto'
import { GetUser } from 'src/common/decorators/get-user.decorator'
import { RolesGuard } from 'src/common/guard/roles.guard'
import { Roles } from './enums'
import { Role } from 'src/common/decorators/roles.decorator'
import { LogDecorator } from 'src/common/decorators/logs.decorator'
import { Public } from 'src/common/decorators/public.decorator';

@Controller('users')
@ApiBearerAuth()
@ApiTags('Usuários')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @LogDecorator()
  @Role(Roles.ADMIN)
  @UseGuards(RolesGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Post('create')
  @LogDecorator()
  @Role(Roles.ADMIN)
  @UseGuards(RolesGuard)
  createWithCreatePath(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get()
  @ApiTags('Usuários')
  @Public()
  findAll(@Query() dto: PaginateParams) {
    return this.usersService.findAll(dto)
  }

  @Get('me')
  me(@GetUser() user: User) {
    return this.usersService.findOne(user.id)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id)
  }


  @Patch('/change-password')
  changePassword(@GetUser() user: User, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(user, dto)
  }

  @Patch(':id/toggle-active')
  @Role(Roles.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  toggleActive(@Param('id') id: string): Promise<void> {
    return this.usersService.toggleActive(+id)
  }

  @Put(':id')
  @Role(Roles.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+id, updateUserDto)
  }

}
