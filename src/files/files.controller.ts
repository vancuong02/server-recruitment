import {
    Post,
    Controller,
    UploadedFile,
    UseInterceptors,
    ParseFilePipeBuilder,
    UnprocessableEntityException,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FilesService } from './files.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { ResponseMessage } from '@/decorator/customize.decorator'

@ApiTags('Files')
@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Post('upload')
    @ResponseMessage('Tải file lên thành công')
    @UseInterceptors(FileInterceptor('fileUpload'))
    uploadFile(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: /^(image\/(jpeg|png|gif|webp)|application\/(pdf|msword)|text\/plain)$/,
                })
                .addMaxSizeValidator({
                    maxSize: 1024 * 1024 * 5,
                    message: 'Dung lượng file vượt quá 5MB',
                })
                .build({
                    exceptionFactory: (error) => {
                        if (error.includes('Validation failed (expected type is')) {
                            throw new UnprocessableEntityException(
                                'Chỉ chấp nhận các định dạng: jpeg, png, gif, webp, pdf, doc, txt',
                            )
                        } else {
                            throw new UnprocessableEntityException(error)
                        }
                    },
                }),
        )
        file: Express.Multer.File,
    ) {
        return {
            fileUrl: (file as any).location,
        }
    }
}
