// import { API_AUTH_URL } from "./components/constants.js";
import { loginUser, getSalt } from './components/functions.js';

document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.querySelector("#login");

  if (loginButton) {
    loginButton.addEventListener("click", async () => {
      const email = document.querySelector('input[type="email"]').value.trim();
      const password = document.querySelector('input[type="password"]').value.trim();

      if (!email || !password) {
        alert("Please fill out all the fields");
        return;
      }

      try {
        const loginResponse = await loginUser(email, password);

        if (loginResponse.error) {
          alert(`Connexion error: ${loginResponse.error}`);
          return;
        }

        const saltResponse = await getSalt();

        if (saltResponse.error) {
          alert(`Error while fetching salt: ${saltResponse.error}`);
          return;
        }

        alert("✅ Connexion successful!");
        window.location.href = "loggedIn/home.html";
      } catch (error) {
        console.error("An error occured whilst authenticating:", error);
        alert("❌ Server unreachable!");
      }
    });
  }
});
