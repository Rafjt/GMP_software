//Handler DECRYPT
async function handleDecrypt(message, sendResponse) {
  if (!cachedKey) {
    return respond(sendResponse, false, { error: "Key is missing." });
  }

  try {
    const combined = Uint8Array.from(atob(message.cipherText), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, cachedKey, data);
    const text = new TextDecoder().decode(decrypted);

    respond(sendResponse, true, { plainText: text });
  } catch (error) {
    console.error("Decryption error:", error);
    respond(sendResponse, false, { error: "Decryption failed" });
  }
}