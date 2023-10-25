async function cadastrarAlunosNoBd(alunos) {
  const alunosPromessas = alunos.map((aluno) => {
    return fetch("", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aluno),
    });
  });

  const result = await Promise.all(alunosPromessas);

  if (result.some((res) => !res.ok))
    throw new Error("Houve um erro no cadastro dos alunos.");
}

module.exports = {
  cadastrarAlunosNoBd,
};
