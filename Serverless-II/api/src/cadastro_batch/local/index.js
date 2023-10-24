const { convertDadosCsv } = require("../convertDadosCsv");
const { fazUploadNoBucket, obtemDadosDoCsvDoBucket } = require("./serverS3");

module.exports.simulandoUploadDoCsv = async (event) => {
  try {
    await fazUploadNoBucket();

    return {
      statusCode: 200,
      body: JSON.stringify({
        mensagem: "Simulando o upload do arquivo...",
      }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify(error),
    };
  }
};

module.exports.cadastrarAlunos = async (event) => {
  const eventoS3 = event.Records[0].s3;

  const nomeBucket = eventoS3.bucket.name;
  const chaveBucket = decodeURIComponent(
    eventoS3.object.key.replace(/\+/g, " ")
  );

  const dados = await obtemDadosDoCsvDoBucket(nomeBucket, chaveBucket);

  const alunos = convertDadosCsv(dados);
};
