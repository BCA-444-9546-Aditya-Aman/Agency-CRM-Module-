import { useEffect, useState } from "react";

import {
  doc,
  updateDoc,
  collection,
  getDocs
} from "firebase/firestore";

import {
  Modal,
  Button,
  Form,
  Badge
} from "react-bootstrap";

import { db } from "@/firebase/firebase";

export default function LeadDetailsModal({
  show,
  handleClose,
  selectedLead
}) {

  const [status, setStatus] = useState("");

  const [assignedTo, setAssignedTo] = useState("");

  const [admins, setAdmins] = useState([]);

  useEffect(() => {

    if(selectedLead) {

      setStatus(selectedLead.status || "");

      setAssignedTo(selectedLead.assignedTo || "");
    }

  }, [selectedLead]);

  useEffect(() => {

    const fetchAdmins = async() => {

      const usersSnapshot = await getDocs(
        collection(db, "users")
      );

      const adminsData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setAdmins(adminsData);
    }

    fetchAdmins();

  }, []);

  const handleUpdate = async() => {

    try {

      const leadRef = doc(
        db,
        "clientLeads",
        selectedLead.id
      );

      await updateDoc(leadRef, {
        status,
        assignedTo
      });

      alert("Lead Updated");

      handleClose();

    } catch(error) {

      console.log(error);

      alert("Error updating lead");
    }
  }

  if(!selectedLead) return null;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="md"
    >
      <Modal.Header className="border-bottom-0 pb-0">
        <Modal.Title className="fw-bold fs-4 text-dark" style={{ letterSpacing: '-0.5px' }}>
          Lead Profile
        </Modal.Title>
        <button type="button" className="btn-close shadow-none" onClick={handleClose}></button>
      </Modal.Header>

      <Modal.Body className="pt-3">
        {/* Client Info Card */}
        <div className="bg-light rounded-4 p-3 mb-4 border" style={{ borderColor: '#e2e8f0' }}>
          <div className="d-flex align-items-center mb-3 pb-3 border-bottom" style={{ borderColor: '#e2e8f0' }}>
            <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold fs-5 shadow-sm" style={{ width: "50px", height: "50px" }}>
              {selectedLead.name.charAt(0)}
            </div>
            <div className="ms-3 overflow-hidden">
              <h5 className="mb-0 fw-bold text-dark text-truncate">{selectedLead.name}</h5>
              <div className="text-secondary small mt-1 fw-medium text-truncate">
                <i className="bi bi-briefcase-fill me-1 text-primary"></i> {selectedLead.service}
              </div>
            </div>
          </div>

          <div className="row g-2">
            <div className="col-12 col-sm-6">
              <div className="d-flex align-items-center text-secondary small fw-medium">
                <div className="bg-white rounded p-1 me-2 shadow-sm border" style={{ width: '28px', textAlign: 'center' }}>
                  <i className="bi bi-envelope-fill text-muted"></i>
                </div>
                <span className="text-truncate">{selectedLead.email}</span>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="d-flex align-items-center text-secondary small fw-medium">
                <div className="bg-white rounded p-1 me-2 shadow-sm border" style={{ width: '28px', textAlign: 'center' }}>
                  <i className="bi bi-telephone-fill text-muted"></i>
                </div>
                <span>{selectedLead.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Message Section */}
        {selectedLead.message && (
          <div className="mb-4">
            <label className="form-label fw-semibold text-dark small mb-2 text-uppercase tracking-wide">Client Message</label>
            <div className="p-3 bg-white border rounded-3 text-secondary small lh-lg" style={{ borderColor: '#e2e8f0', minHeight: '60px' }}>
              {selectedLead.message}
            </div>
          </div>
        )}

        {/* Update Controls */}
        <div className="row g-3">
          <div className="col-sm-6">
            <Form.Group>
              <Form.Label className="fw-bold small text-dark mb-1">Status</Form.Label>
              <Form.Select
                className="form-select shadow-none border-secondary-subtle"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Interested">Interested</option>
                <option value="Follow-Up">Follow-Up</option>
                <option value="Converted">Converted</option>
                <option value="Closed">Closed</option>
              </Form.Select>
            </Form.Group>
          </div>

          <div className="col-sm-6">
            <Form.Group>
              <Form.Label className="fw-bold small text-dark mb-1">Assign To</Form.Label>
              <Form.Select
                className="form-select shadow-none border-secondary-subtle"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="">Unassigned</option>
                {admins.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.name} ({admin.role})
                  </option>
                ))}
              </Form.Select>
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
  )
}