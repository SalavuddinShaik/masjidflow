import { Twilio } from 'twilio';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

interface SmsProvider {
  sendSms(to: string, message: string): Promise<boolean>;
}

class MockSmsProvider implements SmsProvider {
  async sendSms(to: string, message: string): Promise<boolean> {
    logger.info(`[MOCK SMS] To: ${to}`);
    logger.info(`[MOCK SMS] Message: ${message}`);
    console.log('\n' + '='.repeat(50));
    console.log('📱 MOCK SMS');
    console.log('='.repeat(50));
    console.log(`To: ${to}`);
    console.log(`Message: ${message}`);
    console.log('='.repeat(50) + '\n');
    return true;
  }
}

class TwilioSmsProvider implements SmsProvider {
  private client: Twilio;
  private fromNumber: string;

  constructor() {
    this.client = new Twilio(
      config.sms.twilio.accountSid,
      config.sms.twilio.authToken
    );
    this.fromNumber = config.sms.twilio.phoneNumber;
  }

  async sendSms(to: string, message: string): Promise<boolean> {
    try {
      await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to,
      });
      logger.info('SMS sent successfully', { to });
      return true;
    } catch (error) {
      logger.error('Failed to send SMS', error as Error);
      return false;
    }
  }
}

function createSmsProvider(): SmsProvider {
  if (config.sms.provider === 'twilio') {
    return new TwilioSmsProvider();
  }
  return new MockSmsProvider();
}

const smsProvider = createSmsProvider();

export const smsService = {
  async sendOtp(phone: string, countryCode: string, otp: string): Promise<boolean> {
    const fullNumber = `${countryCode}${phone}`;
    const message = `Your MasjidFlow verification code is: ${otp}. This code expires in ${config.otp.expiresInMinutes} minutes.`;
    return smsProvider.sendSms(fullNumber, message);
  },
};
