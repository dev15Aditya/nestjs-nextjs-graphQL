import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksResolver } from './tasks.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), forwardRef(() => UsersModule)],
  controllers: [TasksController],
  providers: [TasksService, TasksResolver],
  exports: [TasksService],
})
export class TasksModule {}
