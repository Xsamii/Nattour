const nodemailer = require('nodemailer');

const emailSender = async options => {
  const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'c85431bf4b2c52',
      pass: '7610018f49b1ba'
    }
  });

  const emailOptions = {
    from: 'Ahmed Samy <fake@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  await transport.sendMail(emailOptions);
};

module.exports = emailSender;
