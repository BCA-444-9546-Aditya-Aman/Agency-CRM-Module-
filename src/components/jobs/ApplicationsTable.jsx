export default function ApplicationsTable({
  applications = [],
  onApplicationClick
}) {

  const getStatusBadge = (status) => {

    switch(status) {

      case "Applied":
        return "bg-primary";

      case "Shortlisted":
        return "bg-info";

      case "Interview Scheduled":
        return "bg-warning";

      case "Selected":
        return "bg-success";

      case "Rejected":
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
                <th>Name</th>
                <th>Position</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {applications.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    className="text-center py-4"
                  >
                    No applications found
                  </td>

                </tr>

              ) : (

                applications.map((application) => (

                  <tr
                    key={application.id}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      onApplicationClick(application)
                    }
                  >

                    <td>{application.name}</td>

                    <td>{application.position}</td>

                    <td>{application.phone}</td>

                    <td>

                      <span
                        className={`badge ${getStatusBadge(application.status)}`}
                      >
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
  )
}