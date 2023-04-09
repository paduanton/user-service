import { Module } from '@nestjs/common';
import { UsersRepository } from './repository/users.repository';
import { AvatarRepository } from '../avatar/repository/avatar.repository';

import { UsersService } from './services/users.services';
import { HttpModule } from '@nestjs/axios';

import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Avatar, AvatarSchema } from '../avatar/schemas/avatar.schema';
import { AvatarModule } from 'src/avatar/avatar.module';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Avatar.name,
        schema: AvatarSchema,
      },
    ]),
    AvatarModule,
  ],
  controllers: [UsersController],
  providers: [UsersRepository, AvatarRepository, UsersService],
})
export class UsersModule {}
