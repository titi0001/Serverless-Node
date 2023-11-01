const { geraUrlPreassinada } = require('./geradorUrlS3');
const { buildResponse } = require('../../../utils/fetchHelpers');

module.exports.enviarUrlPreassinada = async (events) => {
  const { nomeArquivo } = JSON.parse(events.body);
  const url = await geraUrlPreassinada(nomeArquivo);

  return buildResponse(201, { url });
};


