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

import AddJobApplicationModal from "@/components/jobs/AddJobApplicationModal";

import ApplicationsTable from "@/components/jobs/ApplicationsTable";

import ApplicationDetailsModal from "@/components/jobs/ApplicationDetailsModal";

import { db } from "@/firebase/firebase";

export default function JobApplications() {
  const { currentUser, userData } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    let q;

    if(userData?.role === "superadmin") {
      q = query(
        collection(db, "jobApplications"),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(
        collection(db, "jobApplications"),
        where("assignedTo", "==", currentUser.uid)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const applicationsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setApplications(applicationsData);
    });

    return () => unsubscribe();
  }, [currentUser, userData]);

  const handleApplicationClick = (application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  }

  const filteredApplications = applications.filter(app => {
    if (filterStatus === "All") return true;
    return app.status === filterStatus;
  });

  return (
    <DashboardLayout>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
        <div className="mb-3 mb-md-0">
          <h2 className="mb-1 fw-bolder text-dark" style={{ letterSpacing: '-0.5px' }}>
            Job Applications
          </h2>
          <p className="text-secondary mb-0 fw-medium">
            Manage internship and job applications
          </p>
        </div>

        <div className="d-flex gap-3">
          <select 
            className="form-select shadow-sm border-secondary-subtle fw-medium" 
            style={{ width: '200px', cursor: 'pointer', backgroundColor: '#f8fafc' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button
            className="btn btn-primary shadow-sm d-flex align-items-center px-4 rounded-3 fw-semibold"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-plus-lg me-2"></i> Add Application
          </button>
        </div>
      </div>

      <ApplicationsTable
        applications={filteredApplications}
        onApplicationClick={handleApplicationClick}
      />

      <AddJobApplicationModal
        show={showModal}
        handleClose={() => setShowModal(false)}
      />

      <ApplicationDetailsModal
        show={showDetailsModal}
        handleClose={() => setShowDetailsModal(false)}
        selectedApplication={selectedApplication}
      />
    </DashboardLayout>
  )
}