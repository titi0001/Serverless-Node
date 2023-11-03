const { cadatrarAlunos } = require('../cadastroAlunos/cadastrarAlunos');

module.exports.cadastroConsumer = async (events) => {
  console.log('DADOS ENVENTO DO CONSUMER', events);

  try {
    const { body } = events.Records[0];
    return await cadatrarAlunos(body);
  } catch (error) {
    console.log('falha no envio para cadastro');
    console.error(error);
  }
};
