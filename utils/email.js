const nodemailer = require('nodemailer');

const sendEmail = async options => {
  //1. Create transporter (service to send the email)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  //2. Define options
  const mailOptions = {
    from: 'Alvaro Serrano <alvaro@natours.io>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };
  //3. Send email
  await transporter.sendMail(mailOptions);
};

module.export = sendEmail;
