import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Form, Button, Spinner, Row, Col } from "react-bootstrap";
import { db } from "@/firebase/firebase";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

export default function TeamMemberDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [memberTasks, setMemberTasks] = useState([]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    aadhar: "",
    pan: "",
    role: "",
    department: "",
    workExperience: "",
    position: ""
  });

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const memberRef = doc(db, "users", id);
        const memberSnap = await getDoc(memberRef);
        if (memberSnap.exists()) {
          const data = memberSnap.data();
          setMember({ id, ...data });
          setFormData({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            aadhar: data.aadhar || "",
            pan: data.pan || "",
            role: data.role || "member",
            department: data.department || "",
            workExperience: data.workExperience || "",
            position: data.position || ""
          });
        } else {
          alert("Team member not found");
          navigate("/team");
        }

        // Fetch assigned tasks
        const tasksQuery = query(collection(db, "tasks"), where("assignedTo", "==", id));
        const tasksSnap = await getDocs(tasksQuery);
        const tasksData = tasksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMemberTasks(tasksData);
      } catch (error) {
        console.error(error);
        alert("Error fetching team member details");
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const memberRef = doc(db, "users", id);
      await updateDoc(memberRef, formData);
      setMember({ ...member, ...formData });
      alert("Team member updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error updating team member");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to completely remove this team member? This action cannot be undone.")) {
      setDeleting(true);
      try {
        await deleteDoc(doc(db, "users", id));
        alert("Team member removed successfully.");
        navigate("/team");
      } catch (error) {
        console.error(error);
        alert("Error removing team member");
        setDeleting(false);
      }
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
      <div className="mb-3">
        <button className="btn btn-link text-decoration-none p-0 mb-2 d-flex align-items-center text-secondary fw-semibold small" onClick={() => navigate("/team")}>
          <i className="bi bi-arrow-left me-2"></i> Back to Team
        </button>
        <h3 className="fw-bolder text-dark mb-1" style={{ letterSpacing: '-0.5px' }}>Team Member Profile</h3>
        <p className="text-secondary fw-medium small mb-0">View and manage team member details</p>
      </div>

      <div className="row">
        <div className="col-12 col-xl-4 mb-3">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
            <div className="card-body p-3 text-center">
              <div className="mb-3 d-flex justify-content-center">
                <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold fs-2 shadow-sm" style={{ width: "80px", height: "80px", border: "3px solid #f8fafc" }}>
                  {member.name?.charAt(0) || "U"}
                </div>
              </div>
              <h5 className="fw-bold text-dark mb-1">{member.name}</h5>
              <p className="text-primary fw-semibold mb-1 small">{member.position || "No Position"}</p>
              <p className="text-secondary small fw-medium mb-2 text-capitalize">{member.role || "Member"}</p>
              
              <div className="d-flex justify-content-center gap-2 mb-3">
                <span className="badge bg-secondary-subtle text-secondary-emphasis rounded-pill px-2 py-1 fw-medium small">
                  <i className="bi bi-building me-1"></i> {member.department || "No Department"}
                </span>
              </div>

              <div className="text-start bg-light rounded-3 p-2 border mb-4" style={{ borderColor: '#e2e8f0' }}>
                <div className="d-flex align-items-center mb-1">
                  <i className="bi bi-envelope-fill text-muted me-2 small"></i>
                  <span className="text-dark fw-medium text-truncate small">{member.email}</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="bi bi-telephone-fill text-muted me-2 small"></i>
                  <span className="text-dark fw-medium small">{member.phone || "Not provided"}</span>
                </div>
              </div>

              {/* Assigned Tasks Section */}
              <div className="text-start">
                <h6 className="fw-bold text-dark mb-2 px-1">Assigned Tasks</h6>
              {memberTasks.length === 0 ? (
                <p className="text-secondary small mb-0 text-center py-2">No tasks assigned currently.</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {memberTasks.map(task => (
                    <div key={task.id} className="bg-light rounded-3 p-2 border" style={{ borderColor: '#e2e8f0' }}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-semibold text-dark small text-truncate" style={{ maxWidth: '70%' }}>{task.title}</span>
                        <span className={`badge rounded-pill fw-medium`} style={{ fontSize: '0.65rem', backgroundColor: task.status === 'Completed' ? '#d1e7dd' : task.status === 'In Progress' ? '#cff4fc' : '#f8d7da', color: task.status === 'Completed' ? '#0f5132' : task.status === 'In Progress' ? '#055160' : '#842029' }}>
                          {task.status}
                        </span>
                      </div>
                      <p className="text-secondary small mb-0 text-truncate" style={{ fontSize: '0.75rem' }}>{task.description}</p>
                    </div>
                  ))}
                </div>
              )}
              
                <div className="mt-4 pt-3 border-top text-center">
                  <button 
                    className="btn btn-outline-primary btn-sm w-100 fw-semibold rounded-pill shadow-sm d-flex align-items-center justify-content-center"
                    onClick={() => navigate(`/team/${id}/records`)}
                  >
                    <i className="bi bi-journal-text me-2"></i> View Performance Records
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-8 mb-3">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-bottom-0 pt-3 pb-0 px-3">
              <h6 className="fw-bold text-dark mb-0">Personal Information</h6>
            </div>
            <div className="card-body p-3">
              <Form onSubmit={handleSave}>
                <Row className="g-3 mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold small text-dark mb-1">Full Name</Form.Label>
                      <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required className="shadow-none border-secondary-subtle" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold small text-dark mb-1">Email Address</Form.Label>
                      <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required className="shadow-none border-secondary-subtle" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold small text-dark mb-1">Phone Number</Form.Label>
                      <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} className="shadow-none border-secondary-subtle" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold small text-dark mb-1">Aadhar Number</Form.Label>
                      <Form.Control type="text" name="aadhar" value={formData.aadhar} onChange={handleChange} className="shadow-none border-secondary-subtle" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold small text-dark mb-1">PAN Number</Form.Label>
                      <Form.Control type="text" name="pan" value={formData.pan} onChange={handleChange} className="shadow-none border-secondary-subtle" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold small text-dark mb-1">Work Experience</Form.Label>
                      <Form.Control type="text" name="workExperience" value={formData.workExperience} onChange={handleChange} className="shadow-none border-secondary-subtle" placeholder="e.g. 5 Years" />
                    </Form.Group>
                  </Col>
                </Row>

                <hr className="border-secondary-subtle my-3" />
                <h6 className="fw-bold text-dark mb-3">Work Information</h6>
                
                <Row className="g-3 mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold small text-dark mb-1">Role</Form.Label>
                      <Form.Select name="role" value={formData.role} onChange={handleChange} className="form-select shadow-none border-secondary-subtle">
                        <option value="superadmin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="sales">Sales</option>
                        <option value="hr">HR</option>
                        <option value="member">Member</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold small text-dark mb-1">Department</Form.Label>
                      <Form.Control type="text" name="department" value={formData.department} onChange={handleChange} className="shadow-none border-secondary-subtle" placeholder="e.g. Engineering" />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-bold small text-dark mb-1">Position</Form.Label>
                      <Form.Control type="text" name="position" value={formData.position} onChange={handleChange} className="shadow-none border-secondary-subtle" placeholder="e.g. Senior Developer" />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-between mt-3">
                  {userData?.role === "superadmin" ? (
                    <Button variant="outline-danger" type="button" onClick={handleDelete} className="fw-semibold px-4 rounded-pill shadow-sm btn-sm" disabled={deleting || saving}>
                      {deleting ? <Spinner animation="border" size="sm" className="me-2" /> : <i className="bi bi-trash3 me-2"></i>}
                      Remove Member
                    </Button>
                  ) : (
                    <div></div>
                  )}
                  <Button variant="primary" type="submit" className="fw-semibold px-4 rounded-pill shadow-sm btn-sm" disabled={saving || deleting}>
                    {saving ? <Spinner animation="border" size="sm" className="me-2" /> : <i className="bi bi-check2-circle me-2"></i>}
                    Save Changes
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
