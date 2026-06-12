import { useState } from "react";

function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const response = await fetch(
                "http://localhost:5220/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            if (!response.ok) {
                setError("Invalid email or password");
                return;
            }

            const user = await response.json();

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            if (user.role === "Faculty") {
                localStorage.setItem("currentPage", "faculty");
            }
            else {
                localStorage.setItem("currentPage", "dashboard");
            }

            onLogin(user);

            onLogin(user);
        }
        catch {
            setError("Unable to connect to server");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>🎓 Placement Portal</h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <button onClick={handleLogin}>
                    Login
                </button>

                {error && <p>{error}</p>}
            </div>
        </div>
    );
}

export default Login;