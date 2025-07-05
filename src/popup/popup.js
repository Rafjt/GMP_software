export function showPopup(message, duration = 6000, redirectUrl = null) {
  const popup = document.getElementById("custom-popup");
  const messageSpan = document.getElementById("custom-popup-message");
  const closeBtn = document.getElementById("popup-close-btn");

  if (!popup || !messageSpan || !closeBtn) {
    console.error("Popup HTML not found. Did you forget to load popup.html?");
    return;
  }

  messageSpan.textContent = message;
  popup.classList.add("show");

  let timer = null;

  if (duration !== null) {
    timer = setTimeout(() => {
      popup.classList.remove("show");
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    }, duration);
  }

  closeBtn.onclick = () => {
    if (timer) clearTimeout(timer);
    popup.classList.remove("show");
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };
}
