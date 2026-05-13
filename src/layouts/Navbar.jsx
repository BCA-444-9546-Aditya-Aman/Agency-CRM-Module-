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

    <div
      className="bg-white shadow-sm p-3 d-flex justify-content-between align-items-center"
    >

      <h5 className="m-0">
        Dashboard
      </h5>

      <div className="d-flex align-items-center gap-3">

        <div>
          <strong>
            {userData?.name}
          </strong>

          <div style={{ fontSize: "12px" }}>
            {userData?.role}
          </div>
        </div>

        <button
          className="btn btn-danger btn-sm"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </div>
  )
}