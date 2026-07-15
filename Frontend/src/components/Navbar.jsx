import { LogOut, CheckSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <header className="dashboard-navbar">
            <div className="dashboard-brand">
                <div className="dashboard-brand-icon">
                    <CheckSquare size={20} />
                </div>

                <div>
                    <h2>TaskFlow</h2>
                    <p>Daily task workspace</p>
                </div>
            </div>

            <div className="navbar-actions">
                <div className="user-summary">
                    <div className="user-avatar">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div>
                        <strong>{user.name || "User"}</strong>
                        <span>{user.email || ""}</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="logout-button"
                    onClick={handleLogout}
                >
                    <LogOut size={17} />
                    Logout
                </button>
            </div>
        </header>
    );
}

export default Navbar;