const { client } = require('../../../config/clientSQS');
const { SendMessageCommand } = require('@aws-sdk/client-sqs');
const crypto = require('crypto');

module.exports.cadastroProducer = async (objAlunos) => {
  const input = {
    QueueUrl: process.env.SQS_QUEUE_CADASTRO_URL,
    MessageBody: JSON.stringify(objAlunos),
    DelaySeconds: 0,
    MessageDeduplicationId: crypto.randomUUID(),
    MessageGroupId: 'cadastro',
  };

  try {
    const command = new SendMessageCommand(input);
    const response = await client.send(command);
    console.log('Mensagem enviada com sucesso!', response.MessageId);
    return response;

  } catch (erro) {
    console.log(erro);
  }
};
