import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

@InputType()
export class CreateTaskDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  taskName: string;

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  description?: string;

  @Field()
  @IsBoolean()
  isActive: boolean;

  @Field()
  @IsString()
  userId: string;
}
