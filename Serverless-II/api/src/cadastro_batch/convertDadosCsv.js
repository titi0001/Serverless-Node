const { parse } = require("fast-csv");

async function convertDadosCsv(dados) {
  const resultado = await new Promise((resolve, reject) => {
    const alunos = [];

    const stream = parse({ headers: ["nome", "email"], renameHeaders: true })
      .on("data", (aluno) => alunos.push(aluno))
      .on("error", (error) =>
        reject(new Error("Houve um erro no processamento do CSV."))
      )
      .on("end", () => resolve(alunos));

    stream.write(dados);
    stream.end();
  });

  if (resultado instanceof Error) throw resultado;

  return resultado;
}

module.exports = {
  convertDadosCsv,
};
