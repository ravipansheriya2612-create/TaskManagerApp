import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import toast from "react-hot-toast";

function EditTaskModal({
    task,
    isOpen,
    onClose,
    onUpdate,
    loading,
}) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "medium",
    });

    useEffect(() => {
        if (!task) return;

        setFormData({
            title: task.title || "",
            description: task.description || "",
            priority: task.priority || "medium",
        });
    }, [task]);

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event) => {
            if (event.key === "Escape" && !loading) {
                onClose();
            }
        };

        document.addEventListener(
            "keydown",
            handleEscape
        );

        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );

            document.body.style.overflow = "";
        };
    }, [isOpen, loading, onClose]);

    const handleChange = (event) => {
        setFormData((previous) => ({
            ...previous,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const title = formData.title.trim();

        if (!title) {
            toast.error("Task title is required");
            return;
        }

        if (!task?._id) {
            toast.error("Task information is missing");
            return;
        }

        const success = await onUpdate(task._id, {
            title,
            description: formData.description.trim(),
            priority: formData.priority,
        });

        if (success) {
            onClose();
        }
    };

    const handleOverlayClick = () => {
        if (!loading) {
            onClose();
        }
    };

    if (!isOpen || !task) {
        return null;
    }

    return (
        <div
            className="modal-overlay"
            onMouseDown={handleOverlayClick}
        >
            <section
                className="edit-modal"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-task-title"
            >
                <div className="edit-modal-header">
                    <div>
                        <span>Edit task</span>

                        <h2 id="edit-task-title">
                            Update task details
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="modal-close-button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close edit modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    className="edit-task-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-group">
                        <label htmlFor="edit-title">
                            Task title
                        </label>

                        <input
                            id="edit-title"
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter task title"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="edit-description">
                            Description
                        </label>

                        <textarea
                            id="edit-description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Add a short task description"
                            rows="4"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="edit-priority">
                            Priority
                        </label>

                        <select
                            id="edit-priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <option value="low">
                                Low
                            </option>

                            <option value="medium">
                                Medium
                            </option>

                            <option value="high">
                                High
                            </option>
                        </select>
                    </div>

                    <div className="edit-modal-actions">
                        <button
                            type="button"
                            className="modal-cancel-button"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button modal-save-button"
                            disabled={
                                loading ||
                                !formData.title.trim()
                            }
                        >
                            <Save size={17} />

                            {loading
                                ? "Saving..."
                                : "Save changes"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default EditTaskModal;