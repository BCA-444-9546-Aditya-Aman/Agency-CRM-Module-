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

  return (

    <DashboardLayout>

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 className="mb-1">
            Team Management
          </h2>

          <p className="text-muted">
            Manage admins and team members
          </p>

        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >

          <i className="bi bi-plus-lg me-2"></i>

          Add Member

        </button>

      </div>

      <TeamTable
        teamMembers={teamMembers}
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