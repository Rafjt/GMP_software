import { pullPassword, deletePassword, logout } from '../components/functions.js';

const searchInput = document.getElementById('searchInput');
const passwordContainer = document.getElementById('passwordList');

let passwords = [];
let visiblePasswords = {};
let copiedStatus = {};

async function renderPasswords() {
  const query = searchInput.value.toLowerCase();
  passwordContainer.innerHTML = '';

  const filtered = passwords.filter(p => p.name.toLowerCase().includes(query));

  filtered.forEach(item => {
    const container = document.createElement('div');
    container.className = 'rounded p-2 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center passg-container';
  
    // Name + Value Section
    const textSection = document.createElement('div');
    textSection.className = 'd-flex flex-column ml-2';
  
    const name = document.createElement('div');
    name.className = 'fw-semibold text-white ml-2';
    name.textContent = item.name;
  
    const value = document.createElement('div');
    value.className = 'text-white';
    value.style.cursor = 'pointer';
    value.title = 'Click to copy';
  
    if (visiblePasswords[item.id]) {
      if (copiedStatus[item.id]) {
        value.textContent = '✅ Copied!';
      } else {
        value.textContent = item.value.length > 24 ? item.value.slice(0, 24) + '…' : item.value;
      }
      value.onclick = () => copyToClipboard(item.id, item.value);
    } else {
      value.textContent = '•'.repeat(Math.min(item.value.length, 12)) + (item.value.length > 12 ? '…' : '');
    }
  
    textSection.appendChild(name);
    textSection.appendChild(value);
  
    // Buttons Section
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'btn-group ml-2';
  
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'btn btn-sm btn-light text-dark m-3';
    toggleBtn.textContent = visiblePasswords[item.id] ? 'Hide' : 'Show';
    toggleBtn.onclick = () => {
      visiblePasswords[item.id] = !visiblePasswords[item.id];
      renderPasswords();
    };
  
    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-sm btn-light text-dark m-3';
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => {
      window.location.href = `password-management.html?mode=edit&id=${item.id}`;
    };
  
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-sm btn-light text-dark m-3';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = async () => {
      await deletePassword(item.id);
      passwords = passwords.filter(p => p.id !== item.id);
      renderPasswords();
    };
  
    buttonGroup.appendChild(toggleBtn);
    buttonGroup.appendChild(editBtn);
    buttonGroup.appendChild(deleteBtn);
  
    // Assemble
    container.appendChild(textSection);
    container.appendChild(buttonGroup);
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

    if (raw.error) {
      throw new Error(raw.error);
    }

    passwords = await Promise.all(
      raw.map(async (item) => {
        try {
          const response = await window.electronAPI.decryptPassword(item.value);
          if (response.error) throw new Error(response.error);
          return { ...item, value: response.plainText };
        } catch (e) {
          console.error(`Failed to decrypt password with id ${item.id}:`, e);
          if (e.message === "Key is missing.") {
            logout();
            window.location.href = "../index.html";
          }
          return { ...item, value: '[DECRYPTION FAILED]' };
        }
      })
    );

    renderPasswords();

  } catch (err) {
    console.error("Error loading passwords:", err.message);
    logout();
    window.location.href = "../index.html";
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.querySelector("#logout");

  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      try {
        await logout(); 
        alert("Successfuly logged out");
        window.location.href = "../index.html";
      } catch (error) {
        console.error("An error occured whilst logging out", error);
        alert("Logout failed");
      }
    });
  }
});
