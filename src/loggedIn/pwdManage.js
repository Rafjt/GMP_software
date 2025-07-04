import {
  createPassword,
  updatePassword,
  pullPassword,
} from "../components/functions.js";
import { isValidPassword } from "../components/formValidation.js";

const valueInput = document.getElementById("value");
const warningDiv = document.getElementById("passwordWarning");

const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get("mode");
const passwordId = urlParams.get("id");

const title = document.getElementById("formTitle");
if (mode == "edit") title.textContent = "Edit Password";

valueInput.addEventListener("input", () => {
  const password = valueInput.value;

  if (!isValidPassword(password)) {
    warningDiv.textContent =
      "⚠️ Weak password: it is recommended to use 12+ characters, upper/lowercase, a digit, and a symbol.";
    warningDiv.style.display = "block";
  } else {
    warningDiv.style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("createPasswordForm");

  if (mode === "edit" && passwordId) {
    try {
      const allPasswords = await pullPassword();
      const pwd = allPasswords.find((p) => p.id === Number(passwordId));

      if (pwd) {
        const decryptedValue = await window.electronAPI.decryptPassword(
          pwd.value
        );
        document.getElementById("name").value = pwd.name;
        document.getElementById("value").value = decryptedValue.plainText;
        document.getElementById("description").value = pwd.description || "";
        document.getElementById("url").value = pwd.url || "";

        document.getElementById("submitBtn").textContent = "Update Password";

        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          await handleUpdatePassword(passwordId);
        });
      } else {
        console.warn("No password found for ID:", passwordId);
      }
    } catch (err) {
      console.error("Error fetching or decrypting password:", err);
    }
  } else {
    // Default to create mode
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await initCreatePassword();
    });
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
      console.error("Password save failed:", result?.error);
    }
  } catch (err) {
    console.error("Error during password creation:", err);
  }
};

const handleUpdatePassword = async (id) => {
  const name = document.getElementById("name").value.trim();
  const value = document.getElementById("value").value;
  const descriptionRaw = document.getElementById("description").value.trim();
  const urlRaw = document.getElementById("url").value.trim();

  const description = descriptionRaw === "" ? null : descriptionRaw;
  const url = urlRaw === "" ? null : urlRaw;

  try {
    const { cipher, error } = await window.electronAPI.encryptPassword(value);

    if (error) {
      alert("Encryption failed: " + error);
      return;
    }

    const result = await updatePassword(id, name, cipher, description, url);

    if (result && !result.error) {
      window.location.href = "pwdList.html";
    } else {
      console.error("Password update failed:", result?.error);
    }
  } catch (err) {
    console.error("Error during password update:", err);
  }
};
