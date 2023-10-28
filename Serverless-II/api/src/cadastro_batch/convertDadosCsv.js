const { parse } = require("fast-csv");

async function convertDadosCsv(dados) {
  const result = await new Promise((resolve, reject) => {
    const alunos = [];

    const regexEmail = /^\w+([\.\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const stream = parse({ headers: ["nome", "email"], renameHeaders: true })
      .validate((aluno) => regexEmail.test(aluno.email))
      .on("data", (aluno) => alunos.push(aluno))
      .on("data-invalid", (aluno) =>
        reject(
          new Error(
            `O email informado para o aluno ${aluno.nome} é inválido (${aluno.email})`
          )
        )
      )
      .on("error", (erro) =>
        reject(new Error("Houve um erro no processamento do arquivo CSV."))
      )
      .on("end", () => resolve(alunos));

    stream.write(dados);
    stream.end();
  });

  if (result instanceof Error) throw result;

  return result;
}

module.exports = {
  convertDadosCsv,
};
