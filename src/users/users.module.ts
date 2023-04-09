import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from 'src/config/config.module';

import { UsersRepository } from './repository/users.repository';
import { AvatarRepository } from '../avatar/repository/avatar.repository';
import { EmailService } from 'src/email/services/email.service';
import { UsersService } from './services/users.services';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { Avatar, AvatarSchema } from '../avatar/schemas/avatar.schema';
import { AvatarModule } from 'src/avatar/avatar.module';
import { ConfigService } from 'src/config/config.service';

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
    ClientsModule.registerAsync([
      {
        name: 'MAIL_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`${configService.get('rb_url')}`],
            queue: `${configService.get('mailer_queue')}`,
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersRepository,
    AvatarRepository,
    UsersService,
    EmailService,
    ConfigService,
  ],
})
export class UsersModule {}
