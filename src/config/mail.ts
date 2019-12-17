import Email from 'email-templates';
import path from 'path';

export function sendMail({
  to,
  name,
  id
}: {
  to: string;
  name: string;
  id: string;
}): any {
  const email = new Email({
    message: {
      from: 'sistemas@nuclearis.com'
    },
    send: true,
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

  email
    .send({
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
    })
    .then(console.log)
    .catch(console.error);
}
