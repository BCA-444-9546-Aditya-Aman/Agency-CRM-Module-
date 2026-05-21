import { Link, useLocation } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {

  const location = useLocation();

  const { userData } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  }

  return (
    <>
      <style>
        {`
          .custom-sidebar {
            background-color: #18181b;
            width: 260px;
            min-width: 260px;
            flex-shrink: 0;
            min-height: 100vh;
            border-right: 1px solid #27272a;
          }
          .sidebar-link {
            color: #a1a1aa !important;
            font-size: 1.05rem;
            font-weight: 500;
            padding: 10px 16px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            text-decoration: none;
            transition: background-color 0.15s ease, color 0.15s ease;
          }
          .sidebar-link:hover {
            background-color: #27272a;
            color: #e4e4e7 !important;
          }
          .sidebar-link.active {
            background-color: #27272a;
            color: #ffffff !important;
          }
          .sidebar-icon {
            font-size: 1.25rem;
            width: 28px;
            margin-right: 14px;
            display: flex;
            justify-content: center;
          }
        `}
      </style>

      <div className="custom-sidebar p-3 d-flex flex-column">
        
        {/* Logo */}
        <div className="mb-4 pb-4 mt-2 px-3 d-flex align-items-center border-bottom" style={{ borderColor: '#27272a' }}>
          <div className="bg-primary rounded p-1 me-2 d-flex align-items-center justify-content-center" style={{ width: '34px', height: '34px' }}>
            <i className="bi bi-layers-fill text-white fs-5"></i>
          </div>
          <h5 className="mb-0 fw-bold text-white" style={{ letterSpacing: '-0.3px', fontSize: '1.25rem' }}>
            AgencyCRM
          </h5>
        </div>

        {/* Navigation */}
        <ul className="nav flex-column gap-2">
          {/* Dashboard */}
          <li className="nav-item">
            <Link
              to="/dashboard"
              className={`sidebar-link ${isActive("/dashboard") ? "active" : ""}`}
            >
              <i className="bi bi-grid sidebar-icon"></i>
              <span>Dashboard</span>
            </Link>
          </li>

          {/* Client Leads */}
          {(userData?.role === "superadmin" || userData?.role === "admin" || userData?.role === "sales") && (
            <li className="nav-item">
              <Link
                to="/client-leads"
                className={`sidebar-link ${isActive("/client-leads") ? "active" : ""}`}
              >
                <i className="bi bi-people sidebar-icon"></i>
                <span>Client Leads</span>
              </Link>
            </li>
          )}

          {/* Job Applications */}
          {(userData?.role === "superadmin" || userData?.role === "admin" || userData?.role === "hr") && (
            <li className="nav-item">
              <Link
                to="/job-applications"
                className={`sidebar-link ${isActive("/job-applications") ? "active" : ""}`}
              >
                <i className="bi bi-briefcase sidebar-icon"></i>
                <span>Job Applications</span>
              </Link>
            </li>
          )}

          {/* Tasks */}
          <li className="nav-item">
            <Link
              to="/tasks"
              className={`sidebar-link ${isActive("/tasks") ? "active" : ""}`}
            >
              <i className="bi bi-check2-square sidebar-icon"></i>
              <span>Tasks</span>
            </Link>
          </li>

          {/* Team */}
          {userData?.role === "superadmin" && (
            <li className="nav-item">
              <Link
                to="/team"
                className={`sidebar-link ${isActive("/team") ? "active" : ""}`}
              >
                <i className="bi bi-person sidebar-icon"></i>
                <span>Team</span>
              </Link>
            </li>
          )}

          {/* Payments */}
          {(userData?.role === "superadmin" || userData?.role === "admin") && (
            <li className="nav-item">
              <Link
                to="/payments"
                className={`sidebar-link ${isActive("/payments") ? "active" : ""}`}
              >
                <i className="bi bi-wallet2 sidebar-icon"></i>
                <span>Payments</span>
              </Link>
            </li>
          )}
        </ul>

        {/* Bottom User Section */}
        <div className="mt-auto pt-3 border-top" style={{ borderColor: '#27272a' }}>
          <div className="d-flex align-items-center gap-3 px-3 py-2">
            <div
              className="bg-secondary rounded-circle d-flex justify-content-center align-items-center text-white"
              style={{ width: "36px", height: "36px", fontSize: "0.95rem", fontWeight: "600" }}
            >
              {userData?.name?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div className="text-white fw-medium text-truncate" style={{ fontSize: "0.9rem" }}>{userData?.name}</div>
              <div className="text-muted mt-1" style={{ fontSize: "12px" }}>
                {userData?.role}
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}