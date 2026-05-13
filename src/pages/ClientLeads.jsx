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

import AddLeadModal from "@/components/leads/AddLeadModal";

import LeadsTable from "@/components/leads/LeadsTable";

import LeadDetailsModal from "@/components/leads/LeadDetailsModal";

import { db } from "@/firebase/firebase";

export default function ClientLeads() {
  const { currentUser, userData } = useAuth();

  const [showModal, setShowModal] = useState(false);

  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [selectedLead, setSelectedLead] = useState(null);

  const [leads, setLeads] = useState([]);

  useEffect(() => {

    let q;

if(userData?.role === "superadmin") {

  q = query(
    collection(db, "clientLeads"),
    orderBy("createdAt", "desc")
  );

} else {

  q = query(
    collection(db, "clientLeads"),
    where("assignedTo", "==", currentUser.uid)
  );
}

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const leadsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setLeads(leadsData);
    });

    return () => unsubscribe();
    
}, [currentUser, userData]);

  const handleLeadClick = (lead) => {

    setSelectedLead(lead);

    setShowDetailsModal(true);
  }

  return (

    <DashboardLayout>

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 className="mb-1">
            Client Leads
          </h2>

          <p className="text-muted">
            Manage all incoming client leads
          </p>

        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-lg me-2"></i>

          Add Lead
        </button>

      </div>

      <LeadsTable
        leads={leads}
        onLeadClick={handleLeadClick}
      />

      <AddLeadModal
        show={showModal}
        handleClose={() => setShowModal(false)}
      />

      <LeadDetailsModal
        show={showDetailsModal}
        handleClose={() => setShowDetailsModal(false)}
        selectedLead={selectedLead}
      />

    </DashboardLayout>
  )
}