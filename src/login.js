// import { API_AUTH_URL } from "./components/constants.js";
import { loginUser, getSalt, verify2FACode } from "./components/functions.js";
import { showPopup } from "./popup/popup.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.querySelector("#login");
  const twofaInput = document.querySelector("#twofa-code");
  const verify2faButton = document.querySelector("#verify-2fa-btn");

  let pendingUserId = null;
  let currentPassword = "";

  loginButton.addEventListener("click", async () => {
    const email = document.querySelector('input[type="email"]').value.trim();
    const password = document.querySelector('input[type="password"]').value.trim();

    if (!email || !password) {
      showPopup("Please fill out all the fields");
      return;
    }

    try {
      const loginResponse = await loginUser(email, password);

      if (loginResponse.error) {
        showPopup(`❌ Connexion error: ${loginResponse.error}`);
        return;
      }

      if (loginResponse.twoFactorRequired) {
        pendingUserId = loginResponse.userId;
        currentPassword = password;

        showPopup("2FA required. Please enter your authentication code.");

        // Affiche le champ 2FA et le bouton de vérification
        twofaInput.classList.remove("d-none");
        verify2faButton.classList.remove("d-none");

        // Désactive le bouton login pour éviter double login
        loginButton.disabled = true;
        return;
      }

      await unlockVault(password);
    } catch (error) {
      console.error("An error occurred during login:", error);
      showPopup("❌ Server unreachable!");
    }
  });

  verify2faButton.addEventListener("click", async () => {
    const twofaCode = twofaInput.value.trim();
    if (!/^\d{6}$/.test(twofaCode)) {
      showPopup("2FA code must be 6 digits.");
      return;
    }

    try {
      const verifyResponse = await verify2FACode(pendingUserId, twofaCode);
      if (!verifyResponse.success) {
        showPopup(`❌ 2FA verification failed: ${verifyResponse.error || "Unknown error"}`);
        return;
      }

      await unlockVault(currentPassword);
    } catch (error) {
      console.error(error);
      showPopup("❌ Server unreachable!");
    }
  });

  async function unlockVault(password) {
    const saltResponse = await getSalt();
    if (saltResponse.error || !saltResponse.salt) {
      showPopup(`❌ Error while fetching salt: ${saltResponse.error}`);
      return;
    }

    const salt = saltResponse.salt;
    const keyResult = await window.electronAPI.setCryptoKey(password, salt);
    if (keyResult.error) {
      showPopup(`❌ Failed to initialize encryption: ${keyResult.error}`);
      return;
    }

    showPopup("✅ Login successful!", null, "loggedIn/home.html");
  }
});
