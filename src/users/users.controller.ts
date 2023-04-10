import {
  Controller,
  Param,
  Response,
  Get,
  Post,
  Body,
  Delete,
  Logger,
} from '@nestjs/common';
import * as fs from 'fs';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

import { downloadFile } from 'src/helpers/download-file.helper';
import { UsersRepository } from './repository/users.repository';
import { AvatarRepository } from '../avatar/repository/avatar.repository';
import { UserDto } from './dto/user.dto';
import { AvatarDto } from '../avatar/dto/avatar.dto';
import { UsersService } from './services/users.services';
import { EmailService } from 'src/email/services/email.service';

@Controller('api/user')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private avatarRepository: AvatarRepository,
    private userService: UsersService,
    private emailService: EmailService,
  ) {}

  @MessagePattern({ cmd: 'sent-email' })
  async getSentEmailStatus(message) {
    this.logger.log(message);

    return message;
  }

  @EventPattern('send-email')
  async sendEmail(emailPayload) {
    await this.emailService.sendEmail(emailPayload);
  }

  @Post()
  async create(@Body() userDto: UserDto) {
    const user = await this.usersRepository.create(userDto);

    if (user) {
      const welcomeEmailPayload = {
        template: {
          name: 'WELCOME',
          data: {
            firstName: user.first_name,
            lastName: user.last_name,
          },
        },
        destinations: [user.email],
        subject: 'Welcome!',
      };

      await this.emailService.sendWelcomeEmail(welcomeEmailPayload);
    }

    return user;
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.getUser(id);
  }

  @Get(':id/avatar')
  async findAvatar(@Param('id') id: number) {
    const avatar = await this.avatarRepository.findOneByUserId(id);

    if (!avatar?.user_id) {
      const user = await this.userService.getUser(id).toPromise();
      const imagePath = `./static/${user.id}.jpg`;

      await downloadFile(user.avatar, imagePath);

      const base64Image = fs.readFileSync(imagePath, 'base64');
      const parsedBase64Image = `data:image/jpg;base64,${base64Image}`;

      const avatar: AvatarDto = {
        file_system_path: imagePath,
        user_id: user.id,
        hash: parsedBase64Image,
      };

      return this.avatarRepository.create(avatar);
    }

    return avatar;
  }

  @Delete(':id/avatar')
  async remove(@Param('id') id: number, @Response() response) {
    const avatar = await this.avatarRepository.findOneByUserId(id);

    if (!avatar) {
      return response.status(404).send({
        message: 'Invalid avatar information, please try again!',
      });
    }

    fs.unlinkSync(avatar.file_system_path);

    this.avatarRepository.removeByUserId(id);

    return response.status(204).send('');
  }
}
