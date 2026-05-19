import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {

  const navigate = useNavigate();

  const { logout, userData } = useAuth();

  const handleLogout = async() => {

    await logout();

    navigate("/");
  }

  return (
    <>
      <style>
        {`
          .btn-glossy-red {
            background: linear-gradient(to bottom, #ef4444, #dc2626);
            border: 1px solid #b91c1c;
            color: white;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 2px 4px rgba(220, 38, 38, 0.3);
            transition: all 0.2s ease;
          }
          .btn-glossy-red:hover {
            background: linear-gradient(to bottom, #f87171, #ef4444);
            transform: translateY(-1px);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 4px 8px rgba(220, 38, 38, 0.4);
            color: white;
          }
          .btn-glossy-red:active {
            background: linear-gradient(to bottom, #dc2626, #b91c1c);
            transform: translateY(1px);
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
          }
        `}
      </style>
      <div
        className="bg-white shadow-sm px-4 py-3 d-flex justify-content-between align-items-center border-bottom"
      >
        <h5 className="m-0 fw-bold text-dark" style={{ letterSpacing: '-0.3px' }}>
          Dashboard
        </h5>

        <div className="d-flex align-items-center">
          <button
            className="btn btn-glossy-red rounded-2 px-3 py-2 fw-semibold d-flex align-items-center"
            style={{ fontSize: '0.9rem' }}
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-2" style={{ fontSize: '1.1rem' }}></i>
            Logout
          </button>
        </div>
      </div>
    </>
  )
}