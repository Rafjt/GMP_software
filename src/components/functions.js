import { API_AUTH_URL,API_BASE_URL } from "./constants.js";
export { logout,generatePassword,pullPassword,deletePassword,createPassword,loginUser,getSalt,updatePassword };

async function pullPassword() {
    try {
        const response = await fetch(`${API_BASE_URL}/ciphered/password`, {
            method: "GET",
            credentials: "include",
        });
        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            console.error("JSON parsing error:", jsonError);
            return { error: "Received malformed data from the server." };
        }

        if (response.ok) {
            return data;
        } else {
            return {
                error: data?.message || "Failed to pull passwords.",
                status: response.status
            };
        }
    } catch (error) {
        console.error("Network or unexpected error:", error);
        return { error: "Network error: Could not reach the server. Please try again." };
    }
}

async function deletePassword(id) {
    try {
        const response = await fetch (`${API_BASE_URL}/ciphered/password/${id}`, {
            method: "DELETE",
            credentials: "include"
        });
        const data = await response.json();
        
        if (response.ok) {
            return data;
        } else {
            return {
                error: data?.message || "Failed to delete passwords.",
                status: response.status
            };
        }
    } catch (error) {
        console.error("Network or unexpected error:", error);
        return { error: "Network error: Could not reach the server. Please try again." };
    }
}

async function createPassword(name,value,description,url) {
    try {
        const response = await fetch (`${API_BASE_URL}/ciphered/password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, password: value, description, url })
        });
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            return {
                error: data?.message || "Failed to create password.",
                status: response.status
            };
        }
    } catch (error) {
        console.error("Network or unexpected error:", error);
        return { error: "Network error: Could not reach the server. Please try again." };
    }
}

async function updatePassword(id,name,value,description,url) {
    try {
        const response = await fetch (`${API_BASE_URL}/ciphered/password/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, password: value, description, url })
        });
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            return {
                error: data?.message || "Failed to update password.",
                status: response.status
            };
        }
    } catch (error) {
        console.error("Network or unexpected error:", error);
        return { error: "Network error: Could not reach the server. Please try again." };
    }
}

async function logout() {
    try {
        const response = await fetch(`${API_AUTH_URL}/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
        return data;
        } else {
        return { error: "Logout failed" };
        }
    } catch (error) {
        console.error("Error:", error);
        return { error: "Logout failed" };
    }
}

function generatePassword(length, useNumbers = true, useSymbols = true) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';
  
    // Construction du charset selon les options
    let charset = lowercase + uppercase;
    if (useNumbers) charset += numbers;
    if (useSymbols) charset += symbols;
  
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
  
    return Array.from(array)
      .map(x => charset[x % charset.length])
      .join('');
  }

async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_AUTH_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            return { error: data.message || "Login failed" };
        }
    } catch (error) {
        console.error("Error:", error);
        return { error: "Login failed" };
    }
}

async function getSalt() {
    try {
        const response = await fetch(`${API_BASE_URL}/get_salt`, {
            method: "GET",
            credentials: "include"
        });
        const data = await response.json();
        if (response.ok && data[0]?.salt) {
            return { salt: data[0].salt };
        } else {
            return { error: "Failed to retrieve salt" };
        }
    } catch (error) {
        console.error("Error:", error);
        return { error: "Failed to retrieve salt" };
    }
}
