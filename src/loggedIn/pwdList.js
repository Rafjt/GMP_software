import { pullPassword, deletePassword, logout } from '../components/functions.js';
import { decrypt } from '../components/crypto.js'; // adjust if needed

const searchInput = document.getElementById('searchInput');
const passwordContainer = document.getElementById('passwordContainer');

let passwords = [];
let visiblePasswords = {};
let copiedStatus = {};

async function renderPasswords() {
  const query = searchInput.value.toLowerCase();
  passwordContainer.innerHTML = '';

  const filtered = passwords.filter(p => p.name.toLowerCase().includes(query));

  filtered.forEach(item => {
    const container = document.createElement('div');
    container.className = 'test';

    const name = document.createElement('span');
    name.className = 'pwd-name';
    name.textContent = item.name;

    const value = document.createElement('span');
    value.className = 'pwd-value';
    value.style.cursor = 'pointer';
    value.title = 'Click to copy';

    if (visiblePasswords[item.id]) {
      if (copiedStatus[item.id]) {
        value.textContent = '✅ Copied!';
      } else {
        value.textContent = item.value.length > 12 ? item.value.slice(0, 12) + '…' : item.value;
      }
      value.onclick = () => copyToClipboard(item.id, item.value);
    } else {
      value.textContent = '•'.repeat(Math.min(item.value.length, 12)) + (item.value.length > 12 ? '…' : '');
    }

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'button';
    toggleBtn.textContent = visiblePasswords[item.id] ? 'Hide' : 'Show';
    toggleBtn.onclick = () => {
      visiblePasswords[item.id] = !visiblePasswords[item.id];
      renderPasswords();
    };

    const editBtn = document.createElement('button');
    editBtn.className = 'button';
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => {
      window.location.href = `password-management.html?mode=edit&id=${item.id}`;
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'button';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = async () => {
      await deletePassword(item.id);
      passwords = passwords.filter(p => p.id !== item.id);
      renderPasswords();
    };

    const btnGroup = document.createElement('div');
    btnGroup.className = 'pwd-buttons';
    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);

    container.appendChild(name);
    container.appendChild(value);
    container.appendChild(toggleBtn);
    container.appendChild(btnGroup);

    passwordContainer.appendChild(container);
  });
}

async function copyToClipboard(id, text) {
  try {
    await navigator.clipboard.writeText(text);
    copiedStatus[id] = true;
    renderPasswords();
    setTimeout(() => {
      copiedStatus[id] = false;
      renderPasswords();
    }, 1500);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
}

searchInput.addEventListener('input', renderPasswords);

window.addEventListener('DOMContentLoaded', async () => {
  try {
    const raw = await pullPassword();

    passwords = await Promise.all(
      raw.map(async (item) => {
        try {
          console.log(item.value);
          console.log(item);
          const plain = await decrypt(item.value);
          return { ...item, value: plain };
        } catch (e) {
          console.error(`Failed to decrypt password with id ${item.id}:`, e);
          if (e.message === "Key is missing.") {
            console.warn("Key is missing. Logging out.");
            logout();
            window.location.href = '/login.html'; // adjust if needed
          }
          return { ...item, value: '[DECRYPTION FAILED]' };
        }
      })
    );

    renderPasswords();
  } catch (err) {
    console.error("Error loading passwords:", err);
  }
});
