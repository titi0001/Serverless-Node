const nodemailer = require('nodemailer');
// const { buildEmail } = require('../../../utils/buildEmail');

const emailTransport = async () => {
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'maria.grimes@ethereal.email',
      pass: 'cxVTpnH2xtM4Fr8J8U',
    },
  });
};

module.exports.enviaEmailNoCadastro = async (event) => {
  const body = JSON.parse(event.Records[0].body);
  const transport = await emailTransport();

  await transport.sendMail({
    from: 'maria.grimes@ethereal.email',
    to: body.to,
    subject: body.subject,
    text: body.subject,
  });
};
