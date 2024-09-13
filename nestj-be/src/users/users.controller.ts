import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get() // Get /users or /users?role=intern
  findAll(@Query('role') role?: string) {
    return this.userService.findAll(role);
  }

  // @Get(':id') // Get /users/:id
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(id);
  // }

  @Get(':userId') // Get /users/:userId
  findByUserId(@Param('userId') userId: string) {
    return this.userService.findByUserId(userId);
  }

  @Post() // Post /users
  create(
    @Body(ValidationPipe)
    createUserDto: CreateUserDto,
  ) {
    try {
      return this.userService.create(createUserDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id') // Patch /users/:id
  update(
    @Param('id') id: string,
    @Body(ValidationPipe)
    updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id') // Delete /users/:id
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
