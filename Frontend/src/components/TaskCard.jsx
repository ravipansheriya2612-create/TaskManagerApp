import {
    Check,
    Circle,
    Pencil,
    Trash2,
} from "lucide-react";

function TaskCard({ task, onToggle, onEdit, onDelete }) {
    return (
        <article
            className={`task-card ${task.completed ? "task-card-completed" : ""
                }`}
        >
            <div className="task-card-top">
                <button
                    type="button"
                    className="task-status-button"
                    onClick={() =>
                        onToggle(task._id, !task.completed)
                    }
                    aria-label={
                        task.completed
                            ? "Mark task as pending"
                            : "Mark task as completed"
                    }
                >
                    {task.completed ? (
                        <Check size={17} />
                    ) : (
                        <Circle size={17} />
                    )}
                </button>

                <div className="task-card-content">
                    <div className="task-title-row">
                        <h3>{task.title}</h3>

                        <span
                            className={`priority-badge priority-${task.priority}`}
                        >
                            {task.priority}
                        </span>
                    </div>

                    <p>
                        {task.description ||
                            "No description added for this task."}
                    </p>

                    <span className="task-date">
                        Created{" "}
                        {new Date(task.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            }
                        )}
                    </span>
                </div>
            </div>

            <div className="task-card-actions">
                <button
                    type="button"
                    className="task-action-button"
                    onClick={() => onEdit(task)}
                >
                    <Pencil size={16} />
                    Edit
                </button>

                <button
                    type="button"
                    className="task-action-button delete-action"
                    onClick={() => onDelete(task._id)}
                >
                    <Trash2 size={16} />
                    Delete
                </button>
            </div>
        </article>
    );
}

export default TaskCard;