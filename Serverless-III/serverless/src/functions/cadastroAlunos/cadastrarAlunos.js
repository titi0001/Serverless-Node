const config = require('../../../config/config.json');
const { fetchApi, buildResponse } = require('../../../utils/fetchHelpers');

module.exports.cadastrarAlunos = async (aluno) => {
  try {
    const chamadaApi = await fetchApi(
      `${config.fetchApi.prod}/alunos`,
      'POST',
      'application/json',
      aluno
    );

    const res = buildResponse(chamadaApi.statusCode, chamadaApi.body, chamadaApi.headers);

    if (res.statusCode !== 201) {
      return {
        menssagem: 'Erro ao cadastrar aluno',
        status: res.statusCode,
      };
    }

    return {
      menssagem: 'outro status',
      status: res.statusCode,
    };
  } catch (error) {
    throw new Error(error);
  }
};
