async function decryptPassword(cipherText, key) {
  if (!key) {
    return { error: "Key is missing." };
  }

  try {
    const combined = Uint8Array.from(atob(cipherText), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    const text = new TextDecoder().decode(decrypted);
    return { plainText: text };
  } catch (err) {
    console.error("Decryption failed:", err);
    return { error: "Decryption failed." };
  }
};

function generateRandomIV() {
  return crypto.getRandomValues(new Uint8Array(12)); // 12-byte IV
}

async function encryptPassword(plainText, key) {
  if (!key) {
    return { error: "Key is missing." };
  }

  try {
    const iv = generateRandomIV();  // Random IV per encryption
    const enc = new TextEncoder().encode(plainText);

    const buffer = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      enc
    );

    const combined = new Uint8Array(iv.length + buffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(buffer), iv.length);

    const cipher = btoa(String.fromCharCode(...combined));
    return { cipher };
  } catch (error) {
    console.error("Encryption failed:", error);
    return { error: "Encryption failed." };
  }
}


module.exports = { decryptPassword, encryptPassword }