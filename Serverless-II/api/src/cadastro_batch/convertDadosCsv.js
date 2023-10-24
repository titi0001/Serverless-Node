const { parse } = require("fast-csv");

function convertDadosCsv(dados) {
  const stream = parse({ headers: ["nome", "email"], renameHeaders: true })
    .on("data", (aluno) => console.log(aluno))
    .on("error", (error) => console.error(error))
    .on("end", () => console.log("o arquivo CSV foi processado com sucesso"));

  stream.write(dados);
  stream.end();
}

module.exports = {
  convertDadosCsv,
};
