import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  query
} from "firebase/firestore";

import DashboardLayout from "@/layouts/DashboardLayout";

import AddTeamMemberModal from "@/components/team/AddTeamMemberModal";

import TeamTable from "@/components/team/TeamTable";

import TeamMemberDetailsModal from "@/components/team/TeamMemberDetailsModal";

import { db } from "@/firebase/firebase";

export default function Team() {

  const [showModal, setShowModal] = useState(false);

  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [selectedMember, setSelectedMember] = useState(null);

  const [teamMembers, setTeamMembers] = useState([]);

  const [filterRole, setFilterRole] = useState("All");

  useEffect(() => {

    const q = query(
      collection(db, "users")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const teamData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setTeamMembers(teamData);
    });

    return () => unsubscribe();

  }, []);

  const handleMemberClick = (member) => {

    setSelectedMember(member);

    setShowDetailsModal(true);
  }

  const filteredMembers = teamMembers.filter(member => {
    if (filterRole === "All") return true;
    return member.role === filterRole;
  });

  return (

    <DashboardLayout>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">

        <div className="mb-3 mb-md-0">

          <h2 className="mb-1 fw-bolder text-dark" style={{ letterSpacing: '-0.5px' }}>
            Team Management
          </h2>

          <p className="text-secondary mb-0 fw-medium">
            Manage admins and team members
          </p>

        </div>

        <div className="d-flex gap-3">
          <select 
            className="form-select shadow-sm border-secondary-subtle fw-medium" 
            style={{ width: '160px', cursor: 'pointer', backgroundColor: '#f8fafc' }}
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="superadmin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="sales">Sales</option>
            <option value="hr">HR</option>
          </select>
          <button
            className="btn btn-primary shadow-sm d-flex align-items-center px-4 rounded-3 fw-semibold"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-plus-lg me-2"></i> Add Member
          </button>
        </div>

      </div>

      <TeamTable
        teamMembers={filteredMembers}
        onMemberClick={handleMemberClick}
      />

      <AddTeamMemberModal
        show={showModal}
        handleClose={() => setShowModal(false)}
      />

      <TeamMemberDetailsModal
        show={showDetailsModal}
        handleClose={() => setShowDetailsModal(false)}
        selectedMember={selectedMember}
      />

    </DashboardLayout>
  )
}