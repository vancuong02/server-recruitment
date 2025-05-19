import { OmitType } from '@nestjs/mapped-types'
import { AdminCreateUserDto, CreateUserDto } from './create-user.dto'

export class UpdateUserDto extends OmitType(CreateUserDto, ['password', 'email'] as const) {}

export class AdminUpdateUserDto extends OmitType(AdminCreateUserDto, ['password'] as const) {}
