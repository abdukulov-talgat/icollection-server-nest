import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TasksService } from './tasks.service';

@Module({
    imports: [AuthModule],
    providers: [TasksService],
})
export class TasksModule {}
