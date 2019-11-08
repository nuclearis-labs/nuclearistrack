import nodeMailer from 'nodemailer';
module.exports.sendMail = function sendMail({ to, data }) {
    const subject = 'Confirmación de tu usuario';
    const html = `
  Estimado,<br><br>
  Le avisamos que se genero una cuenta en la plataforma NuclearPoE<br><br>
  
  Le pedimos que haga click en el siguiente enlace para confirmar la inscripción y definir su clave<br><br>
  
  <a href="http://localhost:3000/user-form/${data}">Confirmar Cuenta</a><br><br>

  Muchas gracias<br>
  Saludos<br>
  La Blockchain`;
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'sistemas@nuclearis.com',
            pass: 'vwthkppvxvkyuxyd'
        }
    });
    const mailOptions = {
        from: '"Sistemas NRS" <sistemas@nuclearis.com>',
        to,
        subject,
        html // plain text body
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            throw Error('Problem sending mail');
        }
        return info;
    });
};
//# sourceMappingURL=mail.js.map