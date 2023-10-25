const { cadastrarAlunosNoBd } = require("../cadastarAlunosNoBd");
const { convertDadosCsv } = require("../convertDadosCsv");

async function obtemDadosDoCsvDoBucket(nome, chave) {
  const client = new S3Client({});

  const comando = new GetObjectCommand({
    Bucket: nome,
    Key: chave,
  });

  const response = await client.send(comando);
  const dadosCsv = await response.Body.transformToString("utf-8");

  return dadosCsv;
}

module.exports.cadastrarAlunos = async (event) => {
  try {
    const eventoS3 = event.Records[0].s3;

    const nomeBucket = eventoS3.bucket.name;
    const chaveBucket = decodeURIComponent(
      eventoS3.object.key.replace(/\+/g, " ")
    );

    const dados = await obtemDadosDoCsvDoBucket(nomeBucket, chaveBucket);
    const alunos = await convertDadosCsv(dados);

    await cadastrarAlunosNoBd(alunos);
    console.log("Cadastro dos alunos realizado com sucesso ");
  } catch (error) {
    console.log(error);
  }
};
