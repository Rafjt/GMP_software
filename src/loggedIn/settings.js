import { changeMasterPassword, deleteAccount } from '../components/functions.js';
import { isValidPassword } from '../components/formValidation.js';

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
    showFeedback(feedbackMessage, 'Please fill in both fields.', true);
    return;
  }

  if (!isValidPassword(newPass)) {
    showFeedback(feedbackMessage, 'New password does not meet the required criteria.', true);
    return;
  }

  const result = await changeMasterPassword(oldPass, newPass);
  if (result.success) {
    showFeedback(feedbackMessage, result.message || 'Password changed successfully.', false);
    passwordFields.style.display = 'none';
    toggleBtn.textContent = 'Change master password';
    oldPasswordInput.value = '';
    newPasswordInput.value = '';
  } else {
    showFeedback(feedbackMessage, result.error || 'An error occurred.', true);
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
      showFeedback(deleteFeedback, result.message || 'Account deleted.', false);
      setTimeout(() => window.location.href = '../index.html', 1000);
    } else {
      showFeedback(deleteFeedback, result.error || 'Deletion failed.', true);
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
