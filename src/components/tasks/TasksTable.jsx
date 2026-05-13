export default function TasksTable({
  tasks = [],
  onTaskClick
}) {

  const getStatusBadge = (status) => {

    switch(status) {

      case "Pending":
        return "bg-warning";

      case "In Progress":
        return "bg-info";

      case "Completed":
        return "bg-success";

      case "Overdue":
        return "bg-danger";

      default:
        return "bg-secondary";
    }
  }

  const getPriorityBadge = (priority) => {

    switch(priority) {

      case "Low":
        return "bg-secondary";

      case "Medium":
        return "bg-primary";

      case "High":
        return "bg-danger";

      default:
        return "bg-secondary";
    }
  }

  return (

    <div className="card border-0 shadow-sm">

      <div className="card-body">

        <div className="table-responsive">

          <table className="table align-middle table-hover">

            <thead>

              <tr>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>

            </thead>

            <tbody>

              {tasks.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    className="text-center py-4"
                  >
                    No tasks found
                  </td>

                </tr>

              ) : (

                tasks.map((task) => (

                  <tr
                    key={task.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => onTaskClick(task)}
                  >

                    <td>{task.title}</td>

                    <td>

                      <span
                        className={`badge ${getPriorityBadge(task.priority)}`}
                      >
                        {task.priority}
                      </span>

                    </td>

                    <td>

                      <span
                        className={`badge ${getStatusBadge(task.status)}`}
                      >
                        {task.status}
                      </span>

                    </td>

                    <td>{task.dueDate}</td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}