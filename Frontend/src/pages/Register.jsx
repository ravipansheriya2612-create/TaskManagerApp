import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        const name = formData.name.trim();
        const email = formData.email.trim().toLowerCase();

        if (!name || !email || !formData.password || !formData.confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const response = await API.post("/auth/register", {
                name,
                email,
                password: formData.password,
            });

            if (!response.data?.token || !response.data?.user) {
                toast.error("Registration failed");
                return;
            }

            localStorage.setItem("token", response.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            toast.success("Account created successfully");
            navigate("/dashboard");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to create account"
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
                    <span className="eyebrow">Simple daily planning</span>

                    <h1>
                        Organise your work.
                        <br />
                        Finish what matters.
                    </h1>

                    <p>
                        Create focused task lists, set priorities, and keep
                        your day moving without unnecessary complexity.
                    </p>

                    <div className="feature-list">
                        <div>
                            <span>01</span>
                            <p>Personal and secure task workspace</p>
                        </div>

                        <div>
                            <span>02</span>
                            <p>Quick priority and progress tracking</p>
                        </div>

                        <div>
                            <span>03</span>
                            <p>Clean dashboard built for everyday use</p>
                        </div>
                    </div>
                </div>

                <p className="intro-footer">
                    A practical MERN task manager.
                </p>
            </section>

            <section className="auth-panel auth-form-panel">
                <div className="auth-form-container">
                    <div className="mobile-brand">
                        <div className="brand-mark">T</div>
                        <span>TaskFlow</span>
                    </div>

                    <div className="form-heading">
                        <span className="form-kicker">Get started</span>
                        <h2>Create your account</h2>
                        <p>Start planning your tasks in a few seconds.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="name">Full name</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ravi Pansheriya"
                                autoComplete="name"
                            />
                        </div>

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
                                    placeholder="Minimum 6 characters"
                                    autoComplete="new-password"
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

                        <div className="form-group">
                            <label htmlFor="confirmPassword">
                                Confirm password
                            </label>

                            <input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Enter password again"
                                autoComplete="new-password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            <UserPlus size={18} />
                            {loading ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Already have an account?{" "}
                        <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}

export default Register;