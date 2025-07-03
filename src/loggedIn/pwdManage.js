import { createPassword, updatePassword, pullPassword } from "../components/functions.js";

function isValidPassword(password) {
    if (password.length < 12) return false;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+\[\]{}|;:,.?/~])(?=.*\d).{12,}$/;
    return regex.test(password);
}

const valueInput = document.getElementById("value");
const warningDiv = document.getElementById("passwordWarning");

valueInput.addEventListener("input", () => {
  const password = valueInput.value;

  if (!isValidPassword(password)) {
    warningDiv.textContent = "⚠️ Weak password: it is recommended to use 12+ characters, upper/lowercase, a digit, and a symbol.";
    warningDiv.style.display = "block";
  } else {
    warningDiv.style.display = "none";
  }
});

const initCreatePassword = async () => {
    const nameInput = document.getElementById("name");
    const valueInput = document.getElementById("value");
    const descriptionInput = document.getElementById("description");
    const urlInput = document.getElementById("url");
  
    const name = nameInput.value.trim();
    const value = valueInput.value;
    const description = descriptionInput.value.trim();
    const url = urlInput.value.trim();
  
    try {
      const { cipher, error } = await window.electronAPI.encryptPassword(value);
  
      if (error) {
        alert("Encryption failed: " + error);
        return;
      }
  
      const result = await createPassword(name, cipher, description, url);
  
      if (result && !result.error) {
        window.location.href = "pwdList.html";
      } else {
        console.error('Password save failed:', result?.error);
      }
    } catch (err) {
      console.error("Error during password creation:", err);
    }
  };

  document.getElementById('createPasswordForm').addEventListener('submit', (e) => {
    e.preventDefault();
    initCreatePassword();
  });