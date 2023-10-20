document.querySelector("#submit").addEventListener("click", async (e) => {
  e.preventDefault();

  const username = document.querySelector('input[name="username"]').value;
  const password = document.querySelector('input[name="password"]').value;

  if (!username || !password) {
    alert("Please enter a username and password");
  }

  const response = await fetch(
    "https://uq4nxvom5h.execute-api.eu-west-1.amazonaws.com/api/login",
    {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    }
  );

  if (response.ok) {
    const { token } = await response.json();
    window.localStorage.setItem("token", token);
    window.location.href = "/";
  } else {
    alert("Invalid username or password");
  }
});
