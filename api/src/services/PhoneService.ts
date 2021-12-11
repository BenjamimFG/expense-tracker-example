import twilio from 'twilio';

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

class PhoneService {
  public static async isValid(phone: string): Promise<boolean> {
    return twilioClient.lookups.v1
      .phoneNumbers(phone)
      .fetch()
      .then(() => true)
      .catch(() => false);
  }

  public static sendConfirmationCode(phone: string) {}

  private static generateRandomCode(size: number) {
    let code = '';

    for (let i = 0; i < size; ++i) {
      // appends to code a random digit between 0-9
      code += Math.floor(Math.random() * 10).toString(10);
    }

    return code;
  }
}

export default PhoneService;
