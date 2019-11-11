"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
function sendMail({ to, data }) {
    const subject = 'Confirmación de tu usuario';
    const html = `
  Estimado,<br><br>
  Le avisamos que se genero una cuenta en la plataforma NuclearPoE<br><br>
  
  Le pedimos que haga click en el siguiente enlace para confirmar la inscripción y definir su clave<br><br>
  
  <a href="http://localhost:3000/user-form/${data}">Confirmar Cuenta</a><br><br>

  Muchas gracias<br>
  Saludos<br>
  La Blockchain`;
    const transporter = nodemailer_1.default.createTransport({
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
}
exports.sendMail = sendMail;
//# sourceMappingURL=mail.js.map