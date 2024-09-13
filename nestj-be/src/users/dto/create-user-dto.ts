import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateUserDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  role?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  userId: string;
}
