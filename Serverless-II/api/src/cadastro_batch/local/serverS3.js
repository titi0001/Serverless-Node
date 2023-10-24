const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { readFile } = require("fs/promises");

const {join} = require("path");

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

  const nomeArquivo = "cadastrar_alunos.csv";
  const caminhoArquivo = join(__dirname, nomeArquivo);
  const dadosCsv = await readFile(caminhoArquivo);

  const comandoUpload = new PutObjectCommand({
    Bucket: "alunos-csv-local",
    Key: nomeArquivo,
    Body: dadosCsv
  });

  await client.send(comandoUpload);
}

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

module.exports = {
  fazUploadNoBucket,
  obtemDadosDoCsvDoBucket,
};
