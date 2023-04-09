import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { AvatarModule } from './avatar/avatar.module';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRoot(process.env.MONGODB_URL),
    UsersModule,
    AvatarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
