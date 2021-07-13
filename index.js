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
  const response = (error) => {
    if (error) console.log(error);
    callback(null, {
      statusCode: error ? '500' : '200',
      body: error ? 'error' : 'success',
    });
  };

  const { error, value } = bodySchema.validate(JSON.parse(event.body));
  if (error) {
    console.log('error', error);
    callback(null, {
      statusCode: 400,
      body: 'Validation error',
    });
    return;
  }

  transporter.sendMail(
    {
      from: 'Message',
      to: email,
      subject: 'Title',
      html: `<html>
            <body>
              <center>
                <div style= margin: 0; padding: 5px; height: 1500px; width: 1500px;">
                  <h2 style="color: #292536; text-align: center">Nova mensagem</h2>
                    <div style="padding: 5px 15px">
                     <p style="font-size: 20px; color: #034C8C"> ${message} </p>                    
                  </div>
                </div>
              </center>
            </body>          
          </html>
          `,
    },
    (error, info) => {
      if (error) return response(error);
      console.log(info);
      response();
    }
  );
};
