import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData((previous) => ({
            ...previous,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        const email = formData.email.trim().toLowerCase();

        if (!email || !formData.password) {
            toast.error("Please enter email and password");
            return;
        }

        try {
            setLoading(true);

            const response = await API.post("/auth/login", {
                email,
                password: formData.password,
            });

            if (!response.data?.token || !response.data?.user) {
                toast.error("Login failed");
                return;
            }

            localStorage.setItem("token", response.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            toast.success("Welcome back");
            navigate("/dashboard");
         } catch (error) {
            console.log(
                "Login response:",
                error.response?.data
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to login. Please try again."
            );
        } finally {
        setLoading(false);
    }
};

return (
    <main className="auth-page">
        <section className="auth-panel auth-intro">
            <div className="brand">
                <div className="brand-mark">T</div>
                <span>TaskFlow</span>
            </div>

            <div className="intro-content">
                <span className="eyebrow">Plan with clarity</span>

                <h1>
                    Keep your day
                    <br />
                    under control.
                </h1>

                <p>
                    Sign in to review your tasks, update progress, and focus
                    on the work that deserves your attention.
                </p>

                <div className="feature-list">
                    <div>
                        <span>01</span>
                        <p>Your tasks remain private and protected</p>
                    </div>

                    <div>
                        <span>02</span>
                        <p>Track pending and completed work easily</p>
                    </div>

                    <div>
                        <span>03</span>
                        <p>Access your workspace from any device</p>
                    </div>
                </div>
            </div>

            <p className="intro-footer">
                Built with React, Node.js, Express and MongoDB.
            </p>
        </section>

        <section className="auth-panel auth-form-panel">
            <div className="auth-form-container">
                <div className="mobile-brand">
                    <div className="brand-mark">T</div>
                    <span>TaskFlow</span>
                </div>

                <div className="form-heading">
                    <span className="form-kicker">Welcome back</span>
                    <h2>Sign in to TaskFlow</h2>
                    <p>Enter your account details to continue.</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="ravi@example.com"
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>

                        <div className="password-field">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword((previous) => !previous)
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >
                        <LogIn size={18} />

                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="auth-switch">
                    Don&apos;t have an account?{" "}
                    <Link to="/register">Create account</Link>
                </p>
            </div>
        </section>
    </main>
);
}

export default Login;