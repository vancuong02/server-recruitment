import {
    HealthCheck,
    HealthCheckService,
    HttpHealthIndicator,
    MemoryHealthIndicator,
    MongooseHealthIndicator,
} from '@nestjs/terminus'
import { ApiTags } from '@nestjs/swagger'
import { Controller, Get } from '@nestjs/common'
import { Public } from '@/decorator/customize.decorator'

@ApiTags('Health')
@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private memory: MemoryHealthIndicator,
        private db: MongooseHealthIndicator,
    ) {}

    @Get()
    @Public()
    @HealthCheck()
    check() {
        return this.health.check([
            // Kiểm tra kết nối database
            () => this.db.pingCheck('database'),

            // Kiểm tra memory
            () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB
            () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024), // 150MB

            // Kiểm tra các API endpoint
            () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
        ])
    }
}
