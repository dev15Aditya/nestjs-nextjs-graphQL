import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { NotFoundException } from '@nestjs/common';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private users: Model<UserDocument>) {}

  async findAll(role?: string): Promise<User[]> {
    if (role) {
      const roles = this.users.find({ role }).exec();
      if (!roles) throw new NotFoundException('User Role not found');
      return roles;
    }

    return this.users.find().exec();
  }

  // async findOne(id: string): Promise<User> {
  //   const user = this.users.findById(id).exec();
  //   if (!user) throw new NotFoundException('User not found');
  //   return user;
  // }

  async findByUserId(userId: string): Promise<User> {
    // there is a field userId in user schema
    const user = this.users.findOne({ userId }).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(user: CreateUserDto): Promise<User> {
    const newUser = new this.users(user);
    return newUser.save();
  }

  update(_id: string, updatedUserDto: UpdateUserDto) {
    return this.users
      .findByIdAndUpdate(_id, updatedUserDto, { new: true })
      .exec();
  }

  delete(id: string) {
    return this.users.findByIdAndDelete(id).exec();
  }
}
