import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where
} from "firebase/firestore";

import { useAuth } from "@/context/AuthContext";

import DashboardLayout from "@/layouts/DashboardLayout";

import AddTaskModal from "@/components/tasks/AddTaskModal";

import TasksTable from "@/components/tasks/TasksTable";

import TaskDetailsModal from "@/components/tasks/TaskDetailsModal";

import { db } from "@/firebase/firebase";

export default function Tasks() {
  const { currentUser, userData } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    let q;

    if(userData?.role === "superadmin") {
      q = query(
        collection(db, "tasks"),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(
        collection(db, "tasks"),
        where("assignedTo", "==", currentUser.uid)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [currentUser, userData]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowDetailsModal(true);
  }

  const filteredTasks = tasks.filter(task => {
    if (filterStatus === "All") return true;
    return task.status === filterStatus;
  });

  return (
    <DashboardLayout>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
        <div className="mb-3 mb-md-0">
          <h2 className="mb-1 fw-bolder text-dark" style={{ letterSpacing: '-0.5px' }}>
            Tasks
          </h2>
          <p className="text-secondary mb-0 fw-medium">
            Manage and assign tasks
          </p>
        </div>

        <div className="d-flex gap-3">
          <select 
            className="form-select shadow-sm border-secondary-subtle fw-medium" 
            style={{ width: '160px', cursor: 'pointer', backgroundColor: '#f8fafc' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>
          <button
            className="btn btn-primary shadow-sm d-flex align-items-center px-4 rounded-3 fw-semibold"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-plus-lg me-2"></i> Add Task
          </button>
        </div>
      </div>

      <TasksTable
        tasks={filteredTasks}
        onTaskClick={handleTaskClick}
      />

      <AddTaskModal
        show={showModal}
        handleClose={() => setShowModal(false)}
      />

      <TaskDetailsModal
        show={showDetailsModal}
        handleClose={() => setShowDetailsModal(false)}
        selectedTask={selectedTask}
      />

    </DashboardLayout>
  )
}