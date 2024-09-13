import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Task {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  taskName: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @Column()
  userId: string;
}
