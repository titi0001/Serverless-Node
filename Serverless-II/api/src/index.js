const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

function createClientS3() {
  return new S3Client({
    forcePathStyle: true,
    credentials: {
      accessKeyId: "S3RVER",
      secretAccessKey: "S3RVER",
    },
    endpoint: "http://localhost:4569",
  });
}

async function fazUploadNoBucket() {
  const client = createClientS3();

  const comandoUpload = new PutObjectCommand({
    Bucket: "alunos-csv-local",
    Key: "teste.csv",
    Body: Buffer.from("12345"),
  });

  await client.send(comandoUpload);
}

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

async function obtemDadosDoCsvDoBucket(nome, chave) {
  const client = createClientS3();

  const comando = new GetObjectCommand({
    Bucket: nome,
    Key: chave,
  });

  const response = await client.send(comando);
  const dadosCsv = await response.Body.transformToString("utf-8");

  return dadosCsv;
}

module.exports.cadastrarAlunos = async (event) => {
  const eventoS3 = event.Records[0].s3;

  const nomeBucket = eventoS3.bucket.name;
  const chaveBucket = decodeURIComponent(
    eventoS3.object.key.replace(/\+/g, " ")
  );

  const dados = await obtemDadosDoCsvDoBucket(nomeBucket, chaveBucket);

  console.log(dados);
};
