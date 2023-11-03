const config = require('../../../config/config.json');
const { fetchApi, buildResponse } = require('../../../utils/fetchHelpers');
const { FetchErro } = require('./erros/FetchErro');

module.exports.cadastrarAlunos = async (aluno) => {
  try {
    const chamadaApi = await fetchApi(
      `${config.fetchApi.prod}/alunos`,
      'POST',
      'application/json',
      aluno
    );

    const res = buildResponse(
      chamadaApi.statusCode,
      chamadaApi.body,
      chamadaApi.headers
    );

  
    if (res.statusCode === 201) {
      return {
        menssagem: 'sucesso no cadastro',
        status: res.statusCode,
      };
    }

    throw new FetchErro(res.statusCode, aluno);

  } catch (error) {
    console.log(error);
    throw error;
  }
};
