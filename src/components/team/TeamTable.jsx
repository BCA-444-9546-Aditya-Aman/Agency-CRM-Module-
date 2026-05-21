import { useNavigate } from "react-router-dom";

export default function TeamTable({ teamMembers = [] }) {
  const navigate = useNavigate();
  const getRoleBadge = (role) => {
    switch(role) {
      case "superadmin":
        return "bg-danger-subtle text-danger-emphasis border border-danger-subtle";
      case "admin":
        return "bg-primary-subtle text-primary border border-primary-subtle";
      case "sales":
        return "bg-success-subtle text-success-emphasis border border-success-subtle";
      case "hr":
        return "bg-warning-subtle text-warning-emphasis border border-warning-subtle";
      default:
        return "bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle";
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ tableLayout: 'fixed', width: '100%' }}>
            <thead style={{ '--bs-table-bg': '#f1f5f9' }}>
              <tr>
                <th className="py-3 px-4 text-muted fw-semibold border-bottom-0" style={{ width: '30%' }}>Name</th>
                <th className="py-3 px-4 text-muted fw-semibold border-bottom-0" style={{ width: '30%' }}>Email</th>
                <th className="py-3 px-4 text-muted fw-semibold border-bottom-0" style={{ width: '20%' }}>Department</th>
                <th className="py-3 px-4 text-muted fw-semibold border-bottom-0" style={{ width: '20%' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">
                    <i className="bi bi-people fs-1 d-block mb-2 text-black-50"></i>
                    No team members found matching this filter.
                  </td>
                </tr>
              ) : (
                teamMembers.map((member) => (
                  <tr
                    key={member.id}
                    style={{ cursor: "pointer", transition: "background-color 0.2s" }}
                    onClick={() => navigate(`/team/${member.id}`)}
                  >
                    <td className="px-4 py-3 fw-medium text-dark">{member.name}</td>
                    <td className="px-4 py-3 text-secondary">{member.email}</td>
                    <td className="px-4 py-3 text-secondary">{member.department}</td>
                    <td className="px-4 py-3">
                      <span className={`badge rounded-pill fw-semibold ${getRoleBadge(member.role)}`} style={{ padding: '0.45em 0.85em', letterSpacing: '0.3px', textTransform: 'capitalize' }}>
                        {member.role || "Member"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}