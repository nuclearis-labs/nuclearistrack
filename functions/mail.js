const nodeMailer = require("nodemailer");

module.exports.sendMail = function sendMail(to, id, cc, user) {
  let subject = "Se guardo un archivo nuevo en la Blockchain";
  let html =
    "Estimado,<br><br>Le avisamos que se genero un archivo nuevo en la Blockchain con los siguientes datos:<br><br>Nombre de archivo: " +
    user +
    "-" +
    cc +
    "-" +
    id +
    "<br><br>Le pedimos de revisar el archivo y modificar su codificación<br><br>Muchas gracias<br>Saludos<br>La Blockchain";

  let transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "sistemas@nuclearis.com",
      pass: "vwthkppvxvkyuxyd"
    }
  });
  let mailOptions = {
    from: '"Sistemas NRS" <sistemas@nuclearis.com>', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    html: html // plain text body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    return info;
  });
};
