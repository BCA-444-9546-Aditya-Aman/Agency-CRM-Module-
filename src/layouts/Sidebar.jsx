import { Link, useLocation } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {

  const location = useLocation();

  const { userData } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  }

  return (

    <div
      className="bg-dark text-white p-3 d-flex flex-column"
      style={{
        width: "260px",
        minHeight: "100vh"
      }}
    >

      {/* Logo */}

      <div>

        <h4 className="mb-4">
          Agency CRM
        </h4>

        <ul className="nav flex-column">

          {/* Dashboard */}

          <li className="nav-item mb-2">

            <Link
              to="/dashboard"
              className={`nav-link text-white rounded ${
                isActive("/dashboard")
                  ? "bg-primary"
                  : ""
              }`}
            >

              <i className="bi bi-speedometer2 me-2"></i>

              Dashboard

            </Link>

          </li>

          {/* Client Leads */}

          {(userData?.role === "superadmin" ||
            userData?.role === "admin" ||
            userData?.role === "sales") && (

            <li className="nav-item mb-2">

              <Link
                to="/client-leads"
                className={`nav-link text-white rounded ${
                  isActive("/client-leads")
                    ? "bg-primary"
                    : ""
                }`}
              >

                <i className="bi bi-people me-2"></i>

                Client Leads

              </Link>

            </li>

          )}

          {/* Job Applications */}

          {(userData?.role === "superadmin" ||
            userData?.role === "admin" ||
            userData?.role === "hr") && (

            <li className="nav-item mb-2">

              <Link
                to="/job-applications"
                className={`nav-link text-white rounded ${
                  isActive("/job-applications")
                    ? "bg-primary"
                    : ""
                }`}
              >

                <i className="bi bi-briefcase me-2"></i>

                Job Applications

              </Link>

            </li>

          )}

          {/* Tasks */}

          <li className="nav-item mb-2">

            <Link
              to="/tasks"
              className={`nav-link text-white rounded ${
                isActive("/tasks")
                  ? "bg-primary"
                  : ""
              }`}
            >

              <i className="bi bi-list-check me-2"></i>

              Tasks

            </Link>

          </li>

          {/* Team */}

          {userData?.role === "superadmin" && (

            <li className="nav-item mb-2">

              <Link
                to="/team"
                className={`nav-link text-white rounded ${
                  isActive("/team")
                    ? "bg-primary"
                    : ""
                }`}
              >

                <i className="bi bi-person-badge me-2"></i>

                Team

              </Link>

            </li>

          )}

        </ul>

      </div>

      {/* Bottom User Section */}

      <div
        className="mt-auto pt-4 border-top border-secondary"
      >

        <div className="d-flex align-items-center gap-2">

          <div
            className="bg-primary rounded-circle d-flex justify-content-center align-items-center"
            style={{
              width: "40px",
              height: "40px",
              fontWeight: "bold"
            }}
          >

            {userData?.name?.charAt(0)}

          </div>

          <div>

            <div style={{ fontSize: "14px" }}>
              {userData?.name}
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#ccc"
              }}
            >
              {userData?.role}
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}