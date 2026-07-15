import { useEffect, useMemo, useState } from "react";
import {
    CheckCircle2,
    Clock3,
    ListTodo,
    Search,
    ShieldAlert,
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import EditTaskModal from "../components/EditTaskModal";

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");

    const [editingTask, setEditingTask] = useState(null);
    const [updating, setUpdating] = useState(false);

    const fetchTasks = async () => {
        try {
            setLoading(true);

            const response = await API.get("/tasks");

            setTasks(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to load tasks"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const createTask = async (taskData) => {
        try {
            setCreating(true);

            const response = await API.post("/tasks", taskData);

            setTasks((previous) => [
                response.data,
                ...previous,
            ]);

            toast.success("Task added successfully");

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to add task"
            );

            return false;
        } finally {
            setCreating(false);
        }
    };

    const toggleTask = async (taskId, completed) => {
        try {
            const response = await API.put(`/tasks/${taskId}`, {
                completed,
            });

            setTasks((previous) =>
                previous.map((task) =>
                    task._id === taskId
                        ? response.data
                        : task
                )
            );

            toast.success(
                completed
                    ? "Task completed"
                    : "Task marked as pending"
            );
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to update task"
            );
        }
    };

    const openEditModal = (task) => {
        setEditingTask(task);
    };

    const closeEditModal = () => {
        if (updating) return;

        setEditingTask(null);
    };

    const updateTask = async (taskId, taskData) => {
        try {
            setUpdating(true);

            const response = await API.put(
                `/tasks/${taskId}`,
                taskData
            );

            setTasks((previous) =>
                previous.map((task) =>
                    task._id === taskId
                        ? response.data
                        : task
                )
            );

            toast.success("Task updated successfully");

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to update task"
            );

            return false;
        } finally {
            setUpdating(false);
        }
    };

    const deleteTask = async (taskId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) return;

        try {
            await API.delete(`/tasks/${taskId}`);

            setTasks((previous) =>
                previous.filter((task) => task._id !== taskId)
            );

            if (editingTask?._id === taskId) {
                setEditingTask(null);
            }

            toast.success("Task deleted successfully");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to delete task"
            );
        }
    };

    const filteredTasks = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return tasks.filter((task) => {
            const title = task.title?.toLowerCase() || "";
            const description =
                task.description?.toLowerCase() || "";

            const matchesSearch =
                title.includes(normalizedSearch) ||
                description.includes(normalizedSearch);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "completed" &&
                    task.completed) ||
                (statusFilter === "pending" &&
                    !task.completed);

            const matchesPriority =
                priorityFilter === "all" ||
                task.priority === priorityFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );
        });
    }, [
        tasks,
        search,
        statusFilter,
        priorityFilter,
    ]);

    const completedCount = tasks.filter(
        (task) => task.completed
    ).length;

    const pendingCount = tasks.length - completedCount;

    const highPriorityCount = tasks.filter(
        (task) =>
            task.priority === "high" && !task.completed
    ).length;

    return (
        <div className="dashboard-page">
            <Navbar />

            <main className="dashboard-main">
                <section className="dashboard-welcome">
                    <div>
                        <span className="dashboard-eyebrow">
                            Personal workspace
                        </span>

                        <h1>
                            Welcome back,{" "}
                            {user.name?.split(" ")[0] || "User"}
                        </h1>

                        <p>
                            Review your work, finish pending tasks,
                            and keep the day organised.
                        </p>
                    </div>

                    <div className="dashboard-date">
                        <span>Today</span>

                        <strong>
                            {new Date().toLocaleDateString(
                                "en-IN",
                                {
                                    weekday: "long",
                                    day: "2-digit",
                                    month: "long",
                                }
                            )}
                        </strong>
                    </div>
                </section>

                <section className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <ListTodo size={21} />
                        </div>

                        <div>
                            <span>Total tasks</span>
                            <strong>{tasks.length}</strong>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <Clock3 size={21} />
                        </div>

                        <div>
                            <span>Pending</span>
                            <strong>{pendingCount}</strong>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <CheckCircle2 size={21} />
                        </div>

                        <div>
                            <span>Completed</span>
                            <strong>{completedCount}</strong>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <ShieldAlert size={21} />
                        </div>

                        <div>
                            <span>High priority</span>
                            <strong>{highPriorityCount}</strong>
                        </div>
                    </div>
                </section>

                <section className="dashboard-grid">
                    <TaskForm
                        onCreate={createTask}
                        loading={creating}
                    />

                    <div className="tasks-section">
                        <div className="tasks-section-header">
                            <div>
                                <span>Your work</span>
                                <h2>Task list</h2>
                            </div>

                            <strong>
                                {filteredTasks.length}{" "}
                                {filteredTasks.length === 1
                                    ? "task"
                                    : "tasks"}
                            </strong>
                        </div>

                        <div className="task-toolbar">
                            <div className="search-field">
                                <Search size={18} />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search tasks"
                                />
                            </div>

                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="all">
                                    All status
                                </option>

                                <option value="pending">
                                    Pending
                                </option>

                                <option value="completed">
                                    Completed
                                </option>
                            </select>

                            <select
                                value={priorityFilter}
                                onChange={(event) =>
                                    setPriorityFilter(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="all">
                                    All priorities
                                </option>

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

                        {loading ? (
                            <div className="task-state">
                                <div className="loading-spinner" />
                                <p>Loading your tasks...</p>
                            </div>
                        ) : filteredTasks.length === 0 ? (
                            <div className="task-state">
                                <ListTodo size={38} />

                                <h3>No tasks found</h3>

                                <p>
                                    Add a task or change your
                                    current filters.
                                </p>
                            </div>
                        ) : (
                            <div className="task-list">
                                {filteredTasks.map((task) => (
                                    <TaskCard
                                        key={task._id}
                                        task={task}
                                        onToggle={toggleTask}
                                        onEdit={openEditModal}
                                        onDelete={deleteTask}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <EditTaskModal
                task={editingTask}
                isOpen={Boolean(editingTask)}
                onClose={closeEditModal}
                onUpdate={updateTask}
                loading={updating}
            />
        </div>
    );
}

export default Dashboard;