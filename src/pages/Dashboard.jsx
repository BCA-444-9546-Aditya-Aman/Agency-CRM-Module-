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

      <div className="mb-4">

        <h2 className="mb-1">
          Welcome, {userData?.name}
        </h2>

        <p className="text-muted">
          CRM Dashboard Overview
        </p>

      </div>

      <div className="row">

        {/* Leads */}

        <div className="col-md-4 mb-4">

          <div className="card border-0 shadow-sm">

            <div className="card-body">

              <h6 className="text-muted">
                Total Leads
              </h6>

              <h2>{stats.totalLeads}</h2>

            </div>

          </div>

        </div>

        {/* Applications */}

        <div className="col-md-4 mb-4">

          <div className="card border-0 shadow-sm">

            <div className="card-body">

              <h6 className="text-muted">
                Applications
              </h6>

              <h2>
                {stats.totalApplications}
              </h2>

            </div>

          </div>

        </div>

        {/* Tasks */}

        <div className="col-md-4 mb-4">

          <div className="card border-0 shadow-sm">

            <div className="card-body">

              <h6 className="text-muted">
                Total Tasks
              </h6>

              <h2>{stats.totalTasks}</h2>

            </div>

          </div>

        </div>

        {/* Completed */}

        <div className="col-md-4 mb-4">

          <div className="card border-0 shadow-sm">

            <div className="card-body">

              <h6 className="text-muted">
                Completed Tasks
              </h6>

              <h2>
                {stats.completedTasks}
              </h2>

            </div>

          </div>

        </div>

        {/* Pending */}

        <div className="col-md-4 mb-4">

          <div className="card border-0 shadow-sm">

            <div className="card-body">

              <h6 className="text-muted">
                Pending Tasks
              </h6>

              <h2>
                {stats.pendingTasks}
              </h2>

            </div>

          </div>

        </div>

        {/* Team */}

        {userData?.role === "superadmin" && (

          <div className="col-md-4 mb-4">

            <div className="card border-0 shadow-sm">

              <div className="card-body">

                <h6 className="text-muted">
                  Team Members
                </h6>

                <h2>
                  {stats.totalTeamMembers}
                </h2>

              </div>

            </div>

          </div>

        )}

      </div>

    </DashboardLayout>
  )
};