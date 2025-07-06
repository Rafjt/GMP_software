import { sendResetEmail } from '../components/functions.js';
import { showPopup } from '../popup/popup.js';

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('login');
  const emailInput = document.querySelector('input[type="email"]');

  button.addEventListener('click', async () => {
    const email = emailInput.value.trim();

    if (!email) {
      showPopup("Please enter your email.");
      return;
    }

    try {
      const response = await sendResetEmail(email);
      const data = await response.json();  // 🔥 This is where the actual message lives

      if (data.message == "Delete link sent if the email is registered.") {
        showPopup("✅ If this email exists, a reset link has been sent.");
      } else {
        showPopup("❌ Error: " + (data.error || "Unexpected server response"));
      }

    } catch (err) {
      console.error("Unexpected error:", err);
      showPopup("⚠️ An unexpected error occurred.");
    }
  });
});
