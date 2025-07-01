module.exports = async function decryptPassword(cipherText, key) {
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
