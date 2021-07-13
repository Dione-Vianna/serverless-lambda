const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const Joi = require('joi');

const email = 'email@com';

const bodySchema = Joi.object().keys({
  message: Joi.string().allow('').default(' - '),
});

const transporter = nodemailer.createTransport(
  smtpTransport({
    host: 'smtp.mail@com',
    port: 555,
    auth: {
      user: 'mail@com',
      pass: 'password',
    },
  })
);

module.exports.handler = (event, context, callback) => {
  const done = (err) => {
    if (err) console.log(err);
    callback(null, {
      statusCode: err ? '500' : '200',
      body: err ? 'ERROR' : 'OK',
    });
  };

  const { error, value } = bodySchema.validate(JSON.parse(event.body));
  if (error) {
    console.log('Validation error', error);
    callback(null, {
      statusCode: 400,
      body: 'VALIDATION ERROR',
    });
    return;
  }

  transporter.sendMail(
    {
      from: 'Email <email@com>',
      to: email,
      subject: 'Nova mensagem enviada',
      text: `
      Mensagem: ${value.message}
    `,
    },
    (err, info) => {
      if (err) return done(err);
      console.log(info);
      done();
    }
  );
};
