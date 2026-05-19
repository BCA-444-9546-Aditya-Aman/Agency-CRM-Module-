export default function LeadsTable({ leads, onLeadClick }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "New":
        return "bg-primary-subtle text-primary border border-primary-subtle";
      case "Contacted":
        return "bg-warning-subtle text-warning-emphasis border border-warning-subtle";
      case "Interested":
        return "bg-info-subtle text-info-emphasis border border-info-subtle";
      case "Converted":
        return "bg-success-subtle text-success-emphasis border border-success-subtle";
      case "Closed":
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
                <th className="py-3 px-4 text-muted fw-semibold border-bottom-0" style={{ width: '25%' }}>Phone</th>
                <th className="py-3 px-4 text-muted fw-semibold border-bottom-0" style={{ width: '25%' }}>Service</th>
                <th className="py-3 px-4 text-muted fw-semibold border-bottom-0" style={{ width: '20%' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-1 d-block mb-2 text-black-50"></i>
                    No leads found matching this filter.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    style={{ cursor: "pointer", transition: "background-color 0.2s" }}
                    onClick={() => onLeadClick(lead)}
                  >
                    <td className="px-4 py-3 fw-medium text-dark">{lead.name}</td>
                    <td className="px-4 py-3 text-secondary">{lead.phone}</td>
                    <td className="px-4 py-3 text-secondary">{lead.service}</td>
                    <td className="px-4 py-3">
                      <span className={`badge rounded-pill fw-semibold ${getStatusBadge(lead.status)}`} style={{ padding: '0.45em 0.85em', letterSpacing: '0.3px' }}>
                        {lead.status}
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