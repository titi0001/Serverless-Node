async function cadastrarAlunosNoBd(alunos) {
  const alunosPromessas = alunos.map((aluno) => {
    return fetch("http://curso-serverless2-api-902077092.us-east-1.elb.amazonaws.com/alunos", {
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
