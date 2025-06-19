import { logout } from '../components/functions.js';

document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.querySelector("#logout");

  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      try {
        await logout(); // Call the imported logout function
        alert("Successfuly logged out");
        window.location.href = "../index.html"; // Redirect to login or landing page
      } catch (error) {
        console.error("An error occured whilst logging out", error);
        alert("Logout failed");
      }
    });
  }
});
