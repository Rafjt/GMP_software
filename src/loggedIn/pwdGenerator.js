import { generatePassword } from "../components/functions.js";
  
  const lengthSlider = document.getElementById("lengthRange");
  const lengthValue = document.getElementById("lengthValue");
  const symbolsCheckbox = document.getElementById("symbolsCheckbox");
  const numbersCheckbox = document.getElementById("numbersCheckbox");
  const passwordOutput = document.getElementById("passwordOutput");
  const copyBtn = document.getElementById("copyBtn");
  const copiedMessage = document.getElementById("copiedMessage");
  
  function updatePassword() {
    const length = parseInt(lengthSlider.value);
    const useNumbers = numbersCheckbox.checked;
    const useSymbols = symbolsCheckbox.checked;
    const newPassword = generatePassword(length, useNumbers, useSymbols);
    passwordOutput.textContent = newPassword;
  }
  
  function copyPassword() {
    const password = passwordOutput.textContent;
    if (!password) return;
  
    navigator.clipboard.writeText(password).then(() => {
      copiedMessage.style.display = "inline";
      setTimeout(() => {
        copiedMessage.style.display = "none";
      }, 2000);
    });
  }
  
  // Event listeners
  lengthSlider.addEventListener("input", () => {
    lengthValue.textContent = lengthSlider.value;
    updatePassword();
  });
  
  symbolsCheckbox.addEventListener("change", updatePassword);
  numbersCheckbox.addEventListener("change", updatePassword);
  copyBtn.addEventListener("click", copyPassword);
  
  // Initialize
  updatePassword();
  