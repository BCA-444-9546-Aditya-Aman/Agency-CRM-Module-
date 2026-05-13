export default function LeadsTable({
  leads,
  onLeadClick
}) {

  const getStatusBadge = (status) => {

    switch(status) {

      case "New":
        return "bg-primary";

      case "Contacted":
        return "bg-warning";

      case "Interested":
        return "bg-info";

      case "Converted":
        return "bg-success";

      case "Closed":
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
                <th>Phone</th>
                <th>Service</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {leads.map((lead) => (

                <tr
                  key={lead.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => onLeadClick(lead)}
                >

                  <td>{lead.name}</td>

                  <td>{lead.phone}</td>

                  <td>{lead.service}</td>

                  <td>

                    <span
                      className={`badge ${getStatusBadge(lead.status)}`}
                    >
                      {lead.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}