export default function TasksTable({ tasks = [], onTaskClick }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-warning-subtle text-warning-emphasis border border-warning-subtle";
      case "In Progress":
        return "bg-info-subtle text-info-emphasis border border-info-subtle";
      case "Completed":
        return "bg-success-subtle text-success-emphasis border border-success-subtle";
      case "Overdue":
        return "bg-danger-subtle text-danger-emphasis border border-danger-subtle";
      default:
        return "bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle";
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Low":
        return "bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle";
      case "Medium":
        return "bg-primary-subtle text-primary border border-primary-subtle";
      case "High":
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
                <th className="py-3 px-4 text-muted fw-semibold border-bottom-0" style={{ width: '40%' }}>Title</th>
                <th className="py-3 px-4 text-muted fw-semibold border-bottom-0" style={{ width: '20%' }}>Priority</th>
                <th className="py-3 px-4 text-muted fw-semibold border-bottom-0" style={{ width: '20%' }}>Status</th>
                <th className="py-3 px-4 text-muted fw-semibold border-bottom-0" style={{ width: '20%' }}>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-1 d-block mb-2 text-black-50"></i>
                    No tasks found matching this filter.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr
                    key={task.id}
                    style={{ cursor: "pointer", transition: "background-color 0.2s" }}
                    onClick={() => onTaskClick(task)}
                  >
                    <td className="px-4 py-3 fw-medium text-dark text-truncate">{task.title}</td>
                    <td className="px-4 py-3">
                      <span className={`badge rounded-pill fw-semibold ${getPriorityBadge(task.priority)}`} style={{ padding: '0.45em 0.85em', letterSpacing: '0.3px' }}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge rounded-pill fw-semibold ${getStatusBadge(task.status)}`} style={{ padding: '0.45em 0.85em', letterSpacing: '0.3px' }}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-secondary">{task.dueDate}</td>
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