const API_BASE_URL = "http://localhost:3001/auth";

document.addEventListener("DOMContentLoaded", () => {
    const registerButton = document.querySelector(".btn-primary.w-100");

    if (registerButton) {
        registerButton.addEventListener("click", async () => {
            const email = document.querySelector('input[type="email"]').value.trim();
            const password = document.querySelector('input[type="password"]').value.trim();

            if (!email || !password) {
                alert("Veuillez remplir tous les champs.");
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Inscription réussie ! Vérifiez votre email pour activer votre compte.");
                    window.location.href = "../index.html";
                } else {
                    alert(data.error || "Une erreur est survenue.");
                }
            } catch (error) {
                console.error("Erreur lors de l'inscription:", error);
                alert("Impossible de contacter le serveur.");
            }
        });
    }
});
