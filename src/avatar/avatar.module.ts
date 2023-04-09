import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';

import { Avatar, AvatarSchema } from './schemas/avatar.schema';
import { AvatarRepository } from './repository/avatar.repository';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: Avatar.name,
        schema: AvatarSchema,
      },
    ]),
  ],
  controllers: [],
  providers: [AvatarRepository],
})
export class AvatarModule {}
