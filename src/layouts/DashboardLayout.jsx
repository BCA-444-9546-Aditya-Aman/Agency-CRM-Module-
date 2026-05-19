import Sidebar from "./Sidebar";

import Navbar from "./Navbar";

export default function DashboardLayout({ children }) {

  return (

    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>

      <Sidebar />

      <div className="flex-grow-1 bg-light d-flex flex-column" style={{ minWidth: 0, overflowY: 'auto' }}>

        <Navbar />

        <div className="p-4 flex-grow-1">

          {children}

        </div>

      </div>

    </div>
  )
}