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

  return (

    <DashboardLayout>

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 className="mb-1">
            Job Applications
          </h2>

          <p className="text-muted">
            Manage internship and job applications
          </p>

        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >

          <i className="bi bi-plus-lg me-2"></i>

          Add Application

        </button>

      </div>

      <ApplicationsTable
        applications={applications}
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