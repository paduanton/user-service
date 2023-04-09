import _ from 'lodash';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SES } from 'aws-sdk';
import { ConfigService } from 'src/config/config.service';
import { join } from 'path';
import { readFileSync } from 'fs';

enum EmailTemplates {
  WELCOME = 'welcome',
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private ses: SES;

  constructor(
    @Inject('MAIL_SERVICE') private client: ClientProxy,
    private configService: ConfigService,
  ) {
    this.client.connect();
    this.ses = new SES({
      ...this.configService.get('aws'),
    });
  }

  public async sendWelcomeEmail(payload: {
    template: {
      name: string;
      data: object;
    };
    destinations: Array<string>;
    subject: string;
  }) {
    this.client.emit('send-email', payload);
  }

  public async sendEmail(payload: {
    template: {
      name: string;
      data: object;
    };
    destinations: Array<string>;
    subject: string;
  }): Promise<void> {
    this.logger.log(payload);

    const { template, destinations, subject } = payload;
    const templatePath = join(
      __dirname,
      './templates/',
      `${EmailTemplates[template.name]}.html`,
    );

    let _content = readFileSync(templatePath, 'utf-8');

    const compiled = _.template(_content);

    _content = compiled(template.data);

    this.ses
      .sendEmail({
        Source: this.configService.get('sourceEmail'),
        Destination: {
          ToAddresses: destinations,
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: _content,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: subject,
          },
        },
      })
      .promise()
      .catch((error) => this.logger.error(error));
  }
}
