export default function TeamTable({
  teamMembers = [],
  onMemberClick
}) {

  const getRoleBadge = (role) => {

    switch(role) {

      case "superadmin":
        return "bg-danger";

      case "admin":
        return "bg-primary";

      case "sales":
        return "bg-success";

      case "hr":
        return "bg-warning";

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
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
              </tr>

            </thead>

            <tbody>

              {teamMembers.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    className="text-center py-4"
                  >
                    No team members found
                  </td>

                </tr>

              ) : (

                teamMembers.map((member) => (

                  <tr
                    key={member.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => onMemberClick(member)}
                  >

                    <td>{member.name}</td>

                    <td>{member.email}</td>

                    <td>

                      <span
                        className={`badge ${getRoleBadge(member.role)}`}
                      >
                        {member.role}
                      </span>

                    </td>

                    <td>{member.department}</td>

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