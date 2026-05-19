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
  const [filterStatus, setFilterStatus] = useState("All");

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

  const filteredLeads = leads.filter(lead => {
    if (filterStatus === "All") return true;
    return lead.status === filterStatus;
  });

  return (
    <DashboardLayout>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
        <div className="mb-3 mb-md-0">
          <h2 className="mb-1 fw-bolder text-dark" style={{ letterSpacing: '-0.5px' }}>
            Client Leads
          </h2>
          <p className="text-secondary mb-0 fw-medium">
            Manage all incoming client leads
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
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Interested">Interested</option>
            <option value="Converted">Converted</option>
            <option value="Closed">Closed</option>
          </select>
          <button
            className="btn btn-primary shadow-sm d-flex align-items-center px-4 rounded-3 fw-semibold"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-plus-lg me-2"></i> Add Lead
          </button>
        </div>
      </div>

      <LeadsTable
        leads={filteredLeads}
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