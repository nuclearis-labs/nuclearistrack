import Email from 'email-templates';
import path from 'path';

export async function sendMail({
  to,
  name,
  id
}: {
  to: string;
  name: string;
  id: string;
}): Promise<any> {
  const email = new Email({
    message: {
      from: process.env.MAIL_FROM
    },
    send: true,
    preview: false,
    transport: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PWD
      }
    },
    juice: true,
    juiceResources: {
      preserveImportant: true,
      webResources: {
        relativeTo: path.join(__dirname, '..', '..', 'mail_templates', 'css')
      }
    }
  });
  try {
    await email.send({
      template: path.join(
        __dirname,
        '..',
        '..',
        'mail_templates',
        'invitation'
      ),
      message: {
        to
      },
      locals: {
        name,
        id,
        host:process.env.HOST
      }
    });
  } catch (e) {
    throw e;
  }
}
