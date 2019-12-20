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
      from: 'sistemas@nuclearis.com'
    },
    send: false,
    preview: false,
    transport: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'sistemas@nuclearis.com',
        pass: 'vwthkppvxvkyuxyd'
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
        id
      }
    });
  } catch (e) {
    throw e;
  }
}
