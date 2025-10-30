import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { TasksService } from './service/tasks.service';
import { TasksController } from './controller/tasks.controller';
import { Task } from './entities/task.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
