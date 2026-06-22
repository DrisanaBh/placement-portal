import { useState } from "react";

function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [department, setDepartment] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);

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
    const handleRegister = async () => {
        try {
            setError("");
            setSuccess("");

            const response = await fetch(
                "http://localhost:5220/api/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        fullName,
                        email,
                        password,
                        department
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Registration failed");
                return;
            }

            setSuccess("Registration successful! Please login.");

            setFullName("");
            setEmail("");
            setPassword("");
            setDepartment("");

            setIsRegistering(false);
        }
        catch {
            setError("Unable to connect to server");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>🎓 Placement Portal</h1>

                {isRegistering && (
                    <>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) =>
                                setFullName(e.target.value)
                            }
                        />

                        <select
                            value={department}
                            onChange={(e) =>
                                setDepartment(e.target.value)
                            }
                        >
                            <option value="">
                                Select Department
                            </option>

                            <option value="Computer Science">
                                Computer Science
                            </option>

                            <option value="Information Technology">
                                Information Technology
                            </option>

                            <option value="Electronics">
                                Electronics
                            </option>

                            <option value="Mechanical">
                                Mechanical
                            </option>
                        </select>
                    </>
                )}

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

                {isRegistering ? (
                    <>
                        <button onClick={handleRegister}>
                            Create Account
                        </button>

                        <p
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                                setIsRegistering(false)
                            }
                        >
                            Already have an account? Login
                        </p>
                    </>
                ) : (
                    <>
                        <button onClick={handleLogin}>
                            Login
                        </button>

                        <p
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                                setIsRegistering(true)
                            }
                        >
                            Create New Account
                        </p>
                    </>
                )}

                {error && (
                    <p style={{ color: "red" }}>
                        {error}
                    </p>
                )}

                {success && (
                    <p style={{ color: "green" }}>
                        {success}
                    </p>
                )}
            </div>
        </div>
    );
}

export default Login;