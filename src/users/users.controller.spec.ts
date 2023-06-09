import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersRepository } from './repository/users.repository';
import { AvatarRepository } from '../avatar/repository/avatar.repository';
import { Avatar, AvatarDocument } from '../avatar/schemas/avatar.schema';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';

import { EmailService } from '../email/services/email.service';
import { UsersService } from './services/users.services';
import { ConfigService } from './../config/config.service';
/*
export class EmailService {
  sendEmail(payload: {
    template: {
      name: string;
      data: object;
    };
    destinations: Array<string>;
    subject: string;
  }) {
    console.log(payload);
  }

  sendWelcomeEmail(payload: {
    template: {
      name: string;
      data: object;
    };
    destinations: Array<string>;
    subject: string;
  }) {
    console.log(payload);
  }
}

export class UsersService {
  getUsers(): void {}

  getUser(id) {}
}

jest.mock('./services/users.services', () => {
  return {
    __esModule: true,
    UsersService: {
      getUsers: jest.fn(),
      getUser: jest.fn(),
    },
  };
});

jest.mock('../config/config.service', () => {
  return {
    __esModule: true,
    default: jest.fn(() => 42),
    ConfigService: {
      get: jest.fn(),
    },
  };
});
jest.mock('../email/services/email.service', () => {
  return {
    __esModule: true,
    EmailService: {
      sendEmail: jest.fn(),
      sendWelcomeEmail: jest.fn(),
    },
  };
});
*/

export function downloadFile() {
  return jest.fn();
}

jest.mock('../helpers/download-file.helper', () => {
  return {
    __esModule: true,
    downloadFile: downloadFile,
  };
});

describe('UsersController', () => {
  let controller: UsersController;
  const userModel = Model<UserDocument>;
  const avatarModel = Model<AvatarDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersRepository,
        AvatarRepository,
        UsersService,
        EmailService,
        {
          provide: 'MAIL_SERVICE',
          useValue: {
            connect: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(() => ({
              id: 11,
              email: 'george.edwards@reqres.in',
              first_name: 'George',
              last_name: 'Edwards',
              avatar: 'https://reqres.in/img/faces/11-image.jpg',
            })),
          },
        },
        { provide: getModelToken(Avatar.name), useValue: avatarModel },
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
