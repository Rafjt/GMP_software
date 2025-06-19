export async function encrypt(plainText) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: 'ENCRYPT', plainText }, (res) => {
        if (res && res.success) {
          resolve(res.cipher);
        } else {
          reject(new Error((res && res.error) || "Encryption failed"));
        }
      });
    });
  }
  
  export async function decrypt(cipherText) {
    return new Promise((resolve, reject) => {
      console.log("trying to decrypt")
      chrome.runtime.sendMessage({ type: 'DECRYPT', cipherText }, (res) => {
        if (res && res.success) {
          resolve(res.plainText);
        } else {
          reject(new Error((res && res.error) || "Decryption failed"));
        }
      });
    });
  }
  