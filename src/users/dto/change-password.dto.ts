import { IsNotEmpty, MinLength } from 'class-validator'

export class ChangePasswordDto {
    @IsNotEmpty({ message: 'Mật khẩu hiện tại không được để trống' })
    currentPassword: string

    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    newPassword: string
}
