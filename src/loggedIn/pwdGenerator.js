function generatePassword(length, useNumbers, useSymbols) {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  
    let chars = lower + upper;
    if (useNumbers) chars += numbers;
    if (useSymbols) chars += symbols;
  
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  }
  
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
    console.log("copying password");
    const password = passwordOutput.textContent;
    console.log(password);
    if (!password) return;
  
    navigator.clipboard.writeText(password).then(() => {
        console.log("navigator function starts")
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
  