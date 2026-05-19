import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { Modal, Button, Form } from "react-bootstrap";
import { db } from "@/firebase/firebase";

export default function TeamMemberDetailsModal({
  show,
  handleClose,
  selectedMember
}) {
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    if(selectedMember) {
      setRole(selectedMember.role || "");
      setDepartment(selectedMember.department || "");
    }
  }, [selectedMember]);

  const handleUpdate = async() => {
    try {
      const memberRef = doc(db, "users", selectedMember.id);
      await updateDoc(memberRef, {
        role,
        department
      });
      alert("Team Member Updated");
      handleClose();
    } catch(error) {
      console.log(error);
      alert(error.message);
    }
  };

  if(!selectedMember) return null;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="md"
    >
      <Modal.Header className="border-bottom-0 pb-0">
        <Modal.Title className="fw-bold fs-4 text-dark" style={{ letterSpacing: '-0.5px' }}>
          Team Member Profile
        </Modal.Title>
        <button type="button" className="btn-close shadow-none" onClick={handleClose}></button>
      </Modal.Header>

      <Modal.Body className="pt-3">
        {/* Member Info Card */}
        <div className="bg-light rounded-4 p-3 mb-4 border" style={{ borderColor: '#e2e8f0' }}>
          <div className="d-flex align-items-center mb-3 pb-3 border-bottom" style={{ borderColor: '#e2e8f0' }}>
            <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold fs-5 shadow-sm" style={{ width: "50px", height: "50px" }}>
              {selectedMember.name?.charAt(0) || "U"}
            </div>
            <div className="ms-3 overflow-hidden">
              <h5 className="mb-0 fw-bold text-dark text-truncate">{selectedMember.name}</h5>
              <div className="text-secondary small mt-1 fw-medium text-truncate" style={{ textTransform: 'capitalize' }}>
                <i className="bi bi-person-badge-fill me-1 text-primary"></i> {selectedMember.role || "Member"}
                <span className="mx-2">•</span>
                <i className="bi bi-building me-1"></i> {selectedMember.department || "No Department"}
              </div>
            </div>
          </div>

          <div className="row g-2">
            <div className="col-12">
              <div className="d-flex align-items-center text-secondary small fw-medium">
                <div className="bg-white rounded p-1 me-2 shadow-sm border" style={{ width: '28px', textAlign: 'center' }}>
                  <i className="bi bi-envelope-fill text-muted"></i>
                </div>
                <span className="text-truncate">{selectedMember.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Update Controls */}
        <div className="row g-3">
          <div className="col-sm-6">
            <Form.Group>
              <Form.Label className="fw-bold small text-dark mb-1">Role</Form.Label>
              <Form.Select
                className="form-select shadow-none border-secondary-subtle"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="superadmin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="sales">Sales</option>
                <option value="hr">HR</option>
                <option value="member">Member</option>
              </Form.Select>
            </Form.Group>
          </div>

          <div className="col-sm-6">
            <Form.Group>
              <Form.Label className="fw-bold small text-dark mb-1">Department</Form.Label>
              <Form.Control
                className="form-control shadow-none border-secondary-subtle"
                type="text"
                placeholder="e.g. Engineering"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </Form.Group>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-top-0 pt-2 pb-4 px-4">
        <Button
          variant="light"
          className="text-muted fw-bold px-4 border-0 shadow-none bg-transparent hover-bg-light"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="fw-semibold px-4 rounded-pill shadow-sm"
          onClick={handleUpdate}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}