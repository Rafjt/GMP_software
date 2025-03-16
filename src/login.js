const API_BASE_URL = "http://localhost:3001/auth";

// authentification

document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.querySelector("#login");
  
    if (loginButton) {
        loginButton.addEventListener("click", async () => {
            const email = document.querySelector('input[type="email"]').value.trim();
            const password = document.querySelector('input[type="password"]').value.trim();
  
            if (!email || !password) {
                alert("Veuillez remplir tous les champs.");
                return;
            }
  
            try {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });
  
                const data = await response.json();
  
                if (response.ok) {
                    alert("Yes chef t'es connecté c'est bien t'es content ?");
                    window.location.href = "../index.html";
                } else {
                    alert(data.error || "Une erreur est survenue.");
                }
            } catch (error) {
                console.error("Erreur lors de l'authentification:", error);
                alert("Impossible de contacter le serveur.");
            }
        });
    }
  });
  