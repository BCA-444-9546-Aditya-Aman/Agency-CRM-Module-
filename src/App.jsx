import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";

import ClientLeads from "@/pages/ClientLeads";
import JobApplications from "@/pages/JobApplications";
import Tasks from "@/pages/Tasks";
import Team from "@/pages/Team";

import ProtectedRoute from "@/routes/ProtectedRoute";

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Public Route */}

        <Route
          path="/"
          element={<Login />}
        />

        {/* Dashboard */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Client Leads */}

        <Route
          path="/client-leads"
          element={
            <ProtectedRoute>
              <ClientLeads />
            </ProtectedRoute>
          }
        />

        {/* Job Applications */}

        <Route
          path="/job-applications"
          element={
            <ProtectedRoute>
              <JobApplications />
            </ProtectedRoute>
          }
        />

        {/* Tasks */}

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        {/* Team */}

        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <Team />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  )
}