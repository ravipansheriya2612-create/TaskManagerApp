import { useState } from "react";
import { Plus } from "lucide-react";

function TaskForm({ onCreate, loading }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "medium",
    });

    const handleChange = (e) => {
        setFormData((previous) => ({
            ...previous,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) return;

        const success = await onCreate({
            title: formData.title.trim(),
            description: formData.description.trim(),
            priority: formData.priority,
        });

        if (success) {
            setFormData({
                title: "",
                description: "",
                priority: "medium",
            });
        }
    };

    return (
        <form className="task-form-card" onSubmit={handleSubmit}>
            <div className="task-form-heading">
                <div>
                    <span>Quick add</span>
                    <h3>Create a new task</h3>
                </div>

                <div className="task-form-icon">
                    <Plus size={20} />
                </div>
            </div>

            <div className="task-form-grid">
                <div className="form-group task-title-field">
                    <label htmlFor="task-title">Task title</label>

                    <input
                        id="task-title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Example: Complete API integration"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="task-priority">Priority</label>

                    <select
                        id="task-priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="task-description">Description</label>

                <textarea
                    id="task-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Add a short note about this task"
                    rows="3"
                />
            </div>

            <button
                type="submit"
                className="primary-button task-submit-button"
                disabled={loading}
            >
                <Plus size={18} />
                {loading ? "Adding task..." : "Add task"}
            </button>
        </form>
    );
}

export default TaskForm;