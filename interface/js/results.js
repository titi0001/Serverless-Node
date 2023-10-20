if (!window.localStorage.getItem("token")) {
  window.location.href = "/login.html";
}

const queryString = new URLSearchParams(window.location.search);
const resultId = queryString.get("id");

const bail = () => {
  alert("Nenhum resultado encontrado");
  // window.location = '/'
};

if (!resultId) bail();

fetch(`https://uq4nxvom5h.execute-api.eu-west-1.amazonaws.com/api/results${resultId}`)
  .then((r) => {
    if (!r.ok) bail();
    return r.json();
  })
  .then(({ result }) => {
    document.getElementById("student-name").innerText = result.name;
    document.getElementById("correct").innerText = result.totalCorrectAnswers;
  })
  .catch((e) => {
    console.error(e);
    bail();
  });
