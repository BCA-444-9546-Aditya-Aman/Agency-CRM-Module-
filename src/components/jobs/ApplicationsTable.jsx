export default function ApplicationsTable({ applications = [], onApplicationClick }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Applied":
        return "bg-primary-subtle text-primary border border-primary-subtle";
      case "Shortlisted":
        return "bg-info-subtle text-info-emphasis border border-info-subtle";
      case "Interview Scheduled":
        return "bg-warning-subtle text-warning-emphasis border border-warning-subtle";
      case "Selected":
        return "bg-success-subtle text-success-emphasis border border-success-subtle";
      case "Rejected":
        return "bg-danger-subtle text-danger-emphasis border border-danger-subtle";
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
                <th className="py-3 px-4 text-muted fw-semibold border-bottom-0" style={{ width: '25%' }}>Position</th>
                <th className="py-3 px-4 text-muted fw-semibold border-bottom-0" style={{ width: '25%' }}>Phone</th>
                <th className="py-3 px-4 text-muted fw-semibold border-bottom-0" style={{ width: '20%' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-1 d-block mb-2 text-black-50"></i>
                    No applications found matching this filter.
                  </td>
                </tr>
              ) : (
                applications.map((application) => (
                  <tr
                    key={application.id}
                    style={{ cursor: "pointer", transition: "background-color 0.2s" }}
                    onClick={() => onApplicationClick(application)}
                  >
                    <td className="px-4 py-3 fw-medium text-dark">{application.name}</td>
                    <td className="px-4 py-3 text-secondary">{application.position}</td>
                    <td className="px-4 py-3 text-secondary">{application.phone}</td>
                    <td className="px-4 py-3">
                      <span className={`badge rounded-pill fw-semibold ${getStatusBadge(application.status)}`} style={{ padding: '0.45em 0.85em', letterSpacing: '0.3px' }}>
                        {application.status}
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