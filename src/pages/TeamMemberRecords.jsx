import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Spinner, Table, Card, Row, Col } from "react-bootstrap";
import { db } from "@/firebase/firebase";
import DashboardLayout from "@/layouts/DashboardLayout";

export default function TeamMemberRecords() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const [filterMonth, setFilterMonth] = useState(currentMonth);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const memberRef = doc(db, "users", id);
        const memberSnap = await getDoc(memberRef);
        if (memberSnap.exists()) {
          setMember({ id, ...memberSnap.data() });
        } else {
          alert("Team member not found");
          navigate("/team");
          return;
        }

        const tasksQuery = query(collection(db, "tasks"), where("assignedTo", "==", id));
        const tasksSnap = await getDocs(tasksQuery);
        const tasksData = tasksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Sort by dueDate descending
        tasksData.sort((a, b) => {
          if (a.dueDate && b.dueDate) return new Date(b.dueDate) - new Date(a.dueDate);
          return 0;
        });
        
        setTasks(tasksData);
      } catch (error) {
        console.error(error);
        alert("Error fetching records");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const filteredTasks = tasks.filter(task => {
    // Month filter strictly on dueDate matching the YYYY-MM prefix.
    let matchesMonth = true;
    if (filterMonth) {
      if (!task.dueDate) {
        matchesMonth = false; // Exclude tasks without a due date if a month is selected
      } else {
        matchesMonth = task.dueDate.startsWith(filterMonth);
      }
    }

    let matchesStatus = true;
    if (filterStatus !== "All") {
      matchesStatus = task.status === filterStatus;
    }

    return matchesMonth && matchesStatus;
  });

  const stats = {
    total: filteredTasks.length,
    completed: filteredTasks.filter(t => t.status === "Completed").length,
    pending: filteredTasks.filter(t => t.status === "Pending").length,
    inProgress: filteredTasks.filter(t => t.status === "In Progress").length
  };

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case "Completed": return { bg: "#d1e7dd", color: "#0f5132" };
      case "In Progress": return { bg: "#cff4fc", color: "#055160" };
      case "Overdue": return { bg: "#f8d7da", color: "#842029" };
      default: return { bg: "#fff3cd", color: "#664d03" }; // Pending
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
          <Spinner animation="border" variant="primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-4 d-flex justify-content-between align-items-center border-bottom pb-3">
        <div>
          <button className="btn btn-link text-decoration-none p-0 mb-2 d-flex align-items-center text-secondary fw-semibold small" onClick={() => navigate(`/team/${id}`)}>
            <i className="bi bi-arrow-left me-2"></i> Back to Profile
          </button>
          <h2 className="fw-bolder text-dark mb-1" style={{ letterSpacing: '-0.5px' }}>{member.name}'s Records</h2>
          <p className="text-secondary fw-medium mb-0">Performance and task metrics</p>
        </div>
        
        <div className="d-flex gap-3">
          <input 
            type="month" 
            className="form-control shadow-sm border-secondary-subtle fw-medium"
            style={{ width: '180px', backgroundColor: '#f8fafc' }}
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          />
          <select 
            className="form-select shadow-sm border-secondary-subtle fw-medium" 
            style={{ width: '160px', cursor: 'pointer', backgroundColor: '#f8fafc' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 text-center h-100 p-3">
            <Card.Body>
              <h6 className="text-secondary fw-bold text-uppercase mb-2" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>Total Tasks</h6>
              <h2 className="fw-bolder text-dark mb-0">{stats.total}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 text-center h-100 p-3" style={{ backgroundColor: '#f0fdf4' }}>
            <Card.Body>
              <h6 className="text-success fw-bold text-uppercase mb-2" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>Completed</h6>
              <h2 className="fw-bolder text-success mb-0">{stats.completed}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 text-center h-100 p-3" style={{ backgroundColor: '#fffbeb' }}>
            <Card.Body>
              <h6 className="text-warning fw-bold text-uppercase mb-2" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>Pending</h6>
              <h2 className="fw-bolder text-warning mb-0">{stats.pending}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Header className="bg-white border-bottom pt-4 pb-3 px-4 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold text-dark mb-0">Task History</h5>
          <span className="badge bg-secondary-subtle text-secondary-emphasis rounded-pill px-3 py-2 fw-medium">
            {filteredTasks.length} Records Found
          </span>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="py-3 px-4 border-bottom-0 text-secondary fw-semibold small text-uppercase" style={{ letterSpacing: '0.5px' }}>Task Title</th>
                  <th className="py-3 px-4 border-bottom-0 text-secondary fw-semibold small text-uppercase" style={{ letterSpacing: '0.5px' }}>Priority</th>
                  <th className="py-3 px-4 border-bottom-0 text-secondary fw-semibold small text-uppercase" style={{ letterSpacing: '0.5px' }}>Due Date</th>
                  <th className="py-3 px-4 border-bottom-0 text-secondary fw-semibold small text-uppercase" style={{ letterSpacing: '0.5px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map(task => {
                    const badgeStyles = getStatusBadgeColor(task.status);
                    return (
                      <tr key={task.id}>
                        <td className="py-3 px-4">
                          <div className="fw-semibold text-dark">{task.title}</div>
                          <div className="text-secondary small text-truncate" style={{ maxWidth: '300px' }}>{task.description}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`badge bg-${task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'info'} bg-opacity-10 text-${task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'info'} rounded-pill px-3 py-1 fw-medium`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4 fw-medium text-dark">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="badge rounded-pill px-3 py-1 fw-medium" style={{ backgroundColor: badgeStyles.bg, color: badgeStyles.color }}>
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-secondary">
                      <i className="bi bi-inbox fs-1 d-block mb-3 text-muted opacity-50"></i>
                      <h6 className="fw-semibold mb-1">No tasks found</h6>
                      <p className="small mb-0">Try adjusting your filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

    </DashboardLayout>
  );
}
