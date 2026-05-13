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

  return (

    <DashboardLayout>

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 className="mb-1">
            Tasks
          </h2>

          <p className="text-muted">
            Manage and assign tasks
          </p>

        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >

          <i className="bi bi-plus-lg me-2"></i>

          Add Task

        </button>

      </div>

      <TasksTable
        tasks={tasks}
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