import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

import DashboardLayout from "@/layouts/DashboardLayout";

import { db } from "@/firebase/firebase";

import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {

  const { currentUser, userData } = useAuth();

  const [stats, setStats] = useState({
    totalLeads: 0,
    totalApplications: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalTeamMembers: 0
  });

  useEffect(() => {

    const fetchStats = async() => {

      try {

        /* ---------------- LEADS ---------------- */

        let leadsQuery;

        if(userData?.role === "superadmin") {

          leadsQuery = query(
            collection(db, "clientLeads")
          );

        } else {

          leadsQuery = query(
            collection(db, "clientLeads"),
            where(
              "assignedTo",
              "==",
              currentUser.uid
            )
          );
        }

        const leadsSnapshot = await getDocs(
          leadsQuery
        );

        /* ---------------- APPLICATIONS ---------------- */

        let applicationsQuery;

        if(userData?.role === "superadmin") {

          applicationsQuery = query(
            collection(db, "jobApplications")
          );

        } else {

          applicationsQuery = query(
            collection(db, "jobApplications"),
            where(
              "assignedTo",
              "==",
              currentUser.uid
            )
          );
        }

        const applicationsSnapshot = await getDocs(
          applicationsQuery
        );

        /* ---------------- TASKS ---------------- */

        let tasksQuery;

        if(userData?.role === "superadmin") {

          tasksQuery = query(
            collection(db, "tasks")
          );

        } else {

          tasksQuery = query(
            collection(db, "tasks"),
            where(
              "assignedTo",
              "==",
              currentUser.uid
            )
          );
        }

        const tasksSnapshot = await getDocs(
          tasksQuery
        );

        const tasksData = tasksSnapshot.docs.map(
          (doc) => doc.data()
        );

        const completedTasks = tasksData.filter(
          (task) =>
            task.status === "Completed"
        ).length;

        const pendingTasks = tasksData.filter(
          (task) =>
            task.status !== "Completed"
        ).length;

        /* ---------------- TEAM ---------------- */

        let teamCount = 0;

        if(userData?.role === "superadmin") {

          const teamSnapshot = await getDocs(
            collection(db, "users")
          );

          teamCount = teamSnapshot.size;
        }

        setStats({
          totalLeads: leadsSnapshot.size,

          totalApplications:
            applicationsSnapshot.size,

          totalTasks: tasksSnapshot.size,

          completedTasks,

          pendingTasks,

          totalTeamMembers: teamCount
        });

      } catch(error) {

        console.log(error);
      }
    }

    if(currentUser && userData) {

      fetchStats();
    }

  }, [currentUser, userData]);

  return (
    <DashboardLayout>
      <div className="mb-5 pb-2">
        <h2 className="mb-2 fw-bolder" style={{ color: '#0f172a', letterSpacing: '-1px', fontSize: '2.2rem' }}>
          Welcome back, <span className="text-primary">{userData?.name}</span> 👋
        </h2>
        <p className="text-secondary fw-medium mb-0" style={{ fontSize: '1.1rem' }}>
          Here is your agency's performance at a glance.
        </p>
      </div>

      <div className="row g-3">
        {/* Leads */}
        <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
          <div className="card border-0 shadow-sm h-100 rounded-4" style={{ backgroundColor: 'var(--bs-primary-bg-subtle)', borderBottom: '6px solid var(--bs-primary)' }}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary text-white rounded-3 shadow-sm me-3 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                  <i className="bi bi-funnel-fill fs-5"></i>
                </div>
                <h6 className="mb-0 fw-bold text-uppercase text-primary-emphasis" style={{ letterSpacing: '0.5px', fontSize: '0.85rem' }}>Total Leads</h6>
              </div>
              <h3 className="fw-bolder mb-0 ms-1 text-primary-emphasis" style={{ fontSize: '2rem' }}>{stats.totalLeads}</h3>
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
          <div className="card border-0 shadow-sm h-100 rounded-4" style={{ backgroundColor: 'var(--bs-info-bg-subtle)', borderBottom: '6px solid var(--bs-info)' }}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-info text-white rounded-3 shadow-sm me-3 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                  <i className="bi bi-file-earmark-person-fill fs-5"></i>
                </div>
                <h6 className="mb-0 fw-bold text-uppercase text-info-emphasis" style={{ letterSpacing: '0.5px', fontSize: '0.85rem' }}>Applications</h6>
              </div>
              <h3 className="fw-bolder mb-0 ms-1 text-info-emphasis" style={{ fontSize: '2rem' }}>{stats.totalApplications}</h3>
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
          <div className="card border-0 shadow-sm h-100 rounded-4" style={{ backgroundColor: 'var(--bs-dark-bg-subtle)', borderBottom: '6px solid var(--bs-dark)' }}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-dark text-white rounded-3 shadow-sm me-3 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                  <i className="bi bi-list-check fs-5"></i>
                </div>
                <h6 className="mb-0 fw-bold text-uppercase text-dark-emphasis" style={{ letterSpacing: '0.5px', fontSize: '0.85rem' }}>Total Tasks</h6>
              </div>
              <h3 className="fw-bolder mb-0 ms-1 text-dark-emphasis" style={{ fontSize: '2rem' }}>{stats.totalTasks}</h3>
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
          <div className="card border-0 shadow-sm h-100 rounded-4" style={{ backgroundColor: 'var(--bs-success-bg-subtle)', borderBottom: '6px solid var(--bs-success)' }}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-success text-white rounded-3 shadow-sm me-3 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                  <i className="bi bi-check-circle-fill fs-5"></i>
                </div>
                <h6 className="mb-0 fw-bold text-uppercase text-success-emphasis" style={{ letterSpacing: '0.5px', fontSize: '0.85rem' }}>Completed Tasks</h6>
              </div>
              <h3 className="fw-bolder mb-0 ms-1 text-success-emphasis" style={{ fontSize: '2rem' }}>{stats.completedTasks}</h3>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
          <div className="card border-0 shadow-sm h-100 rounded-4" style={{ backgroundColor: 'var(--bs-warning-bg-subtle)', borderBottom: '6px solid var(--bs-warning)' }}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-warning text-dark rounded-3 shadow-sm me-3 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                  <i className="bi bi-hourglass-split fs-5"></i>
                </div>
                <h6 className="mb-0 fw-bold text-uppercase text-warning-emphasis" style={{ letterSpacing: '0.5px', fontSize: '0.85rem' }}>Pending Tasks</h6>
              </div>
              <h3 className="fw-bolder mb-0 ms-1 text-warning-emphasis" style={{ fontSize: '2rem' }}>{stats.pendingTasks}</h3>
            </div>
          </div>
        </div>

        {/* Team */}
        {userData?.role === "superadmin" && (
          <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
            <div className="card border-0 shadow-sm h-100 rounded-4" style={{ backgroundColor: 'var(--bs-danger-bg-subtle)', borderBottom: '6px solid var(--bs-danger)' }}>
              <div className="card-body p-3">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-danger text-white rounded-3 shadow-sm me-3 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                    <i className="bi bi-people-fill fs-5"></i>
                  </div>
                  <h6 className="mb-0 fw-bold text-uppercase text-danger-emphasis" style={{ letterSpacing: '0.5px', fontSize: '0.85rem' }}>Team Members</h6>
                </div>
                <h3 className="fw-bolder mb-0 ms-1 text-danger-emphasis" style={{ fontSize: '2rem' }}>{stats.totalTeamMembers}</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
