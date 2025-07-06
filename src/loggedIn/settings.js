import { changeMasterPassword, deleteAccount,fetch2faStatusApi, toggle2faApi } from '../components/functions.js';
import { isValidPassword } from '../components/formValidation.js';
import { showPopup } from "../popup/popup.js";


const toggleBtn = document.getElementById('togglePasswordBtn');
const passwordFields = document.getElementById('passwordFields');
const oldPasswordInput = document.getElementById('oldPassword');
const newPasswordInput = document.getElementById('newPassword');
const confirmChangeBtn = document.getElementById('confirmChangeBtn');
const feedbackMessage = document.getElementById('feedbackMessage');

const deleteConfirmation = document.getElementById('deleteConfirmation');
const deleteInitial = document.getElementById('deleteInitial');
const showDeleteBtn = document.getElementById('showDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const deleteFeedback = document.getElementById('deleteFeedback');

const toggle2faBtn = document.getElementById('toggle2faBtn');
const twofaFeedback = document.getElementById('twofaFeedback');
const qrcodeContainer = document.getElementById('qrcodeContainer');
const qrcodeImg = document.getElementById('qrcodeImg');

async function generateQrCode(url) {
  const result = await window.electronAPI.generateQrCode(url);
  if (result.success) {
    return result.qr;
  } else {
    console.error('QR Code generation failed:', result.error);
    return null;
  }
}

async function fetch2faStatus() {
  const result = await fetch2faStatusApi();
  if (result.error) {
    toggle2faBtn.textContent = 'Failed to load 2FA status';
    toggle2faBtn.disabled = true;
  } else {
    toggle2faBtn.textContent = result.enabled ? 'Disable 2FA' : 'Enable 2FA';
    toggle2faBtn.disabled = false;
    toggle2faBtn.dataset.enabled = result.enabled ? '1' : '0';
  }
}

toggle2faBtn.addEventListener('click', async () => {
  const currentStatus = toggle2faBtn.dataset.enabled === '1' ? 1 : 0;
  const data = await toggle2faApi(currentStatus);
  if (data.success) {
    twofaFeedback.textContent = data.message;
    await fetch2faStatus();
    if (data.otpauth_url) {
      const qrCodeDataUrl = await generateQrCode(data.otpauth_url);
      if (qrCodeDataUrl) {
        qrcodeImg.src = qrCodeDataUrl;
        qrcodeContainer.style.display = 'block';
      } else {
        qrcodeContainer.style.display = 'none';
        qrcodeImg.src = '';
      }
    } else {
      qrcodeContainer.style.display = 'none';
      qrcodeImg.src = '';
    }
  } else {
    twofaFeedback.textContent = data.error || 'Operation failed.';
  }
});

// Initial load
fetch2faStatus();


// Toggle Password Change Fields
toggleBtn.addEventListener('click', () => {
  const isVisible = passwordFields.style.display === 'block';
  passwordFields.style.display = isVisible ? 'none' : 'block';
  toggleBtn.textContent = isVisible ? 'Change master password' : 'Cancel';
  feedbackMessage.textContent = '';
  feedbackMessage.className = '';
  oldPasswordInput.value = '';
  newPasswordInput.value = '';
});

// Handle Master Password Change
confirmChangeBtn.addEventListener('click', async () => {
  const oldPass = oldPasswordInput.value.trim();
  const newPass = newPasswordInput.value.trim();

  if (!oldPass || !newPass) {
    showPopup('Please fill in both fields.');
    return;
  }

  if (!isValidPassword(newPass)) {
    showPopup('New password does not meet the required criteria.');
    return;
  }

  const result = await changeMasterPassword(oldPass, newPass);
  if (result.success) {
    showPopup("Password changed successfully ✔")
      passwordFields.style.display = "none";
      toggleBtn.textContent = "Change master password";
      oldPasswordInput.value = "";
      newPasswordInput.value = "";
  } else if (result.error == "New password cannot be the same as the old password"){
    showPopup(`${result.error}`)}
    else {
    showPopup(`${result.error}`)
    }
});

// Show Delete Confirmation
showDeleteBtn.addEventListener('click', () => {
  deleteInitial.style.display = 'none';
  deleteConfirmation.style.display = 'block';
  deleteFeedback.textContent = '';
  deleteFeedback.className = '';
});

// Cancel Deletion
cancelDeleteBtn.addEventListener('click', () => {
  deleteInitial.style.display = 'block';
  deleteConfirmation.style.display = 'none';
  deleteFeedback.textContent = '';
  deleteFeedback.className = '';
});

// Handle Account Deletion
confirmDeleteBtn.addEventListener('click', async () => {
  try {
    const result = await deleteAccount();
    if (result.success) {
      // showFeedback(deleteFeedback, result.message || 'Account deleted.', false);
      // setTimeout(() => window.location.href = '../index.html', 1000);
      showPopup("Account deleted.", null, '../index.html')
    } else {
      showFeedback(deleteFeedback, result.error || 'Deletion failed.', true);
      showPopup("Deletion failed")
    }
  } catch (e) {
    showFeedback(deleteFeedback, 'Unexpected error.', true);
  }
});

// Helper to show messages
function showFeedback(el, msg, isError) {
  el.textContent = msg;
  el.className = isError ? 'customErrors' : 'customEvent';
}
