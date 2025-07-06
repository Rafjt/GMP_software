import { showPopup } from "../popup/popup.js";
import { createAccount }  from "../components/functions.js"
import { isValidEmail, isValidPassword } from "../components/formValidation.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerButton = document.querySelector("#createAccount");

  if (registerButton) {
    registerButton.addEventListener("click", async () => {
      const email = document.querySelector('input[type="email"]').value.trim();
      const password = document.querySelector('input[type="password"]').value.trim();
      const confirmPassword = document.querySelector('#confirmPassword').value.trim();

      if (!email || !password || !confirmPassword) {
        showPopup("Please fill out every field");
        return;
      }

      if (!isValidEmail(email)) {
        showPopup("Incorrect email field");
        return;
      }

      if (!isValidPassword(password)) {
        showPopup("Incorrect password field");
        return;
      }

      if (password !== confirmPassword) {
        showPopup("Passwords do not match");
        return;
      }

      registerButton.disabled = true;
      registerButton.textContent = "Registering...";

      try {
        const response = await createAccount(email, password);
        console.log(response)

        if (response.error) {
          showPopup(`❌ Connexion error: ${response.error}`);
        } else {
          showPopup(
            "Registration successful! Check your email to activate your account.",
            null,
            "../index.html"
          );
        }
      } finally {
        registerButton.disabled = false;
        registerButton.textContent = "Register";
      }
    });
  }
});