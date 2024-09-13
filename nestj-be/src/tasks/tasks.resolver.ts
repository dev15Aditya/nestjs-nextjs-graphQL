import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task } from './tasks.entity';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.schema';

@Resolver(() => Task)
export class TasksResolver {
  constructor(
    private usersService: UsersService,
    private tasksService: TasksService,
  ) {}

  @Query(() => [Task])
  async tasks(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Query(() => Task)
  async task(@Args('id', { type: () => ID }) id: number): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Query(() => [Task])
  async findByUserId(@Args('userId') userId: string): Promise<Task[]> {
    return this.tasksService.findByUserId(userId);
  }

  @Mutation(() => Task)
  async create(
    @Args('createTaskInput') createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @Mutation(() => Task)
  async update(
    @Args('id', { type: () => ID }) id: number,
    @Args('updateTaskInput') updateTaskInput: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskInput);
  }

  @Mutation(() => Task)
  async delete(@Args('id') id: number): Promise<void> {
    await this.tasksService.delete(id);
  }

  @ResolveField(() => User)
  async user(@Parent() task: Task) {
    return this.usersService.findByUserId(task.userId);
  }
}
