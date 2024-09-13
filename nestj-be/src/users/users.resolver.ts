import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './users.schema';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { Task } from 'src/tasks/tasks.entity';
import { TasksService } from 'src/tasks/tasks.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private tasksService: TasksService,
    private usersService: UsersService,
  ) {}

  @Query(() => [User])
  async users(
    @Args('role', { nullable: true }) role?: string,
  ): Promise<User[]> {
    return this.usersService.findAll(role);
  }

  // @Query(() => User)
  // async user(@Args('id') id: string): Promise<User> {
  //   return this.usersService.findOne(id);
  // }

  @Query(() => User)
  async findByUserId(@Args('userId') userId: string) {
    return this.usersService.findByUserId(userId);
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id') id: string,
    @Args('updateUserInput') updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Mutation(() => User)
  async deleteUser(@Args('id') id: string): Promise<User> {
    return this.usersService.delete(id);
  }

  @ResolveField(() => [Task])
  async tasks(@Parent() user: User) {
    return this.tasksService.findByUserId(user.userId);
  }
}
