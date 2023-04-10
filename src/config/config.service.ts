import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
config();

interface Config {
  rabbitMQURL: string;
  mailerQueue: string;
  aws: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  };
  sourceEmail: string;
}

@Injectable()
export class ConfigService {
  private config = {} as Config;
  constructor() {
    this.config.rabbitMQURL = process.env.RABBITMQ_URL;
    this.config.mailerQueue = process.env.RABBITMQ_MAILER_QUEUE;
    this.config.aws = {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
    };
    this.config.sourceEmail = process.env.SOURCE_EMAIL;
  }

  public get(key: keyof Config): any {
    return this.config[key];
  }
}
