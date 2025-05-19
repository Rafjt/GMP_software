const API_BASE_URL = "http://localhost:3001/auth";

function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

function isValidPassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+\[\]{}|;:,.?/~])(?=.*\d).{12,}$/;
    return regex.test(password);
}

document.addEventListener("DOMContentLoaded", () => {
    const registerButton = document.querySelector("#createAccount");

    if (registerButton) {
        registerButton.addEventListener("click", async () => {
            const email = document.querySelector('input[type="email"]').value.trim();
            const password = document.querySelector('input[type="password"]').value.trim();

            if (!email || !password) {
                alert("Veuillez remplir tous les champs.");
                return;
            }

            if (!isValidEmail(email)) {
                alert("Champs mail incorrect");
                return;
            }

            if (!isValidPassword(password)) {
                alert("Champs mot de passe incorrect");
                return;
            }

            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                const response = await fetch(`${API_BASE_URL}/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password: hashedPassword }),
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
