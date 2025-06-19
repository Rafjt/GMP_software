import { API_AUTH_URL } from "../components/constants.js";

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
                alert("Please fill out every field");
                return;
            }

            if (!isValidEmail(email)) {
                alert("Incorrect email field");
                return;
            }

            if (!isValidPassword(password)) {
                alert("Incorrect password field");
                return;
            }

            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                const response = await fetch(`${API_AUTH_URL}/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password: hashedPassword }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Registration successful! Check your email to activate your account.");
                    window.location.href = "../index.html";
                } else {
                    alert(data.error || "An unexpected error has occured");
                }
            } catch (error) {
                console.error("An error has occured during registration", error);
                alert("Server unreachable");
            }
        });
    }
});
