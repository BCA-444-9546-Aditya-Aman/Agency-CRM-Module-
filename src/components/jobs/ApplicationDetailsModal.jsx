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
  Form
} from "react-bootstrap";

import { db } from "@/firebase/firebase";

export default function ApplicationDetailsModal({
  show,
  handleClose,
  selectedApplication
}) {

  const [status, setStatus] = useState("");

  const [assignedTo, setAssignedTo] = useState("");

  const [admins, setAdmins] = useState([]);

  useEffect(() => {

    if(selectedApplication) {

      setStatus(selectedApplication.status || "");

      setAssignedTo(
        selectedApplication.assignedTo || ""
      );
    }

  }, [selectedApplication]);

  useEffect(() => {

    const fetchAdmins = async() => {

      const snapshot = await getDocs(
        collection(db, "users")
      );

      const adminsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setAdmins(adminsData);
    }

    fetchAdmins();

  }, []);

  const handleUpdate = async() => {

    try {

      const applicationRef = doc(
        db,
        "jobApplications",
        selectedApplication.id
      );

      await updateDoc(applicationRef, {
        status,
        assignedTo
      });

      alert("Application Updated");

      handleClose();

    } catch(error) {

      console.log(error);

      alert("Error updating application");
    }
  }

  if(!selectedApplication) return null;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="md"
    >
      <Modal.Header className="border-bottom-0 pb-0">
        <Modal.Title className="fw-bold fs-4 text-dark" style={{ letterSpacing: '-0.5px' }}>
          Applicant Profile
        </Modal.Title>
        <button type="button" className="btn-close shadow-none" onClick={handleClose}></button>
      </Modal.Header>

      <Modal.Body className="pt-3">
        {/* Applicant Info Card */}
        <div className="bg-light rounded-4 p-3 mb-4 border" style={{ borderColor: '#e2e8f0' }}>
          <div className="d-flex align-items-center mb-3 pb-3 border-bottom" style={{ borderColor: '#e2e8f0' }}>
            <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold fs-5 shadow-sm" style={{ width: "50px", height: "50px" }}>
              {selectedApplication.name.charAt(0)}
            </div>
            <div className="ms-3 overflow-hidden">
              <h5 className="mb-0 fw-bold text-dark text-truncate">{selectedApplication.name}</h5>
              <div className="text-secondary small mt-1 fw-medium text-truncate">
                <i className="bi bi-briefcase-fill me-1 text-primary"></i> {selectedApplication.position}
                <span className="mx-2">•</span>
                <i className="bi bi-clock-history me-1"></i> {selectedApplication.experience} exp
              </div>
            </div>
          </div>

          <div className="row g-2">
            <div className="col-12 col-sm-6">
              <div className="d-flex align-items-center text-secondary small fw-medium">
                <div className="bg-white rounded p-1 me-2 shadow-sm border" style={{ width: '28px', textAlign: 'center' }}>
                  <i className="bi bi-envelope-fill text-muted"></i>
                </div>
                <span className="text-truncate">{selectedApplication.email}</span>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="d-flex align-items-center text-secondary small fw-medium">
                <div className="bg-white rounded p-1 me-2 shadow-sm border" style={{ width: '28px', textAlign: 'center' }}>
                  <i className="bi bi-telephone-fill text-muted"></i>
                </div>
                <span>{selectedApplication.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Section */}
        {selectedApplication.resumeLink && (
          <div className="mb-4">
            <label className="form-label fw-semibold text-dark small mb-2 text-uppercase tracking-wide">Resume Document</label>
            <div className="d-flex align-items-center p-3 bg-white border rounded-3" style={{ borderColor: '#e2e8f0' }}>
              <div className="bg-danger-subtle text-danger rounded p-2 me-3">
                <i className="bi bi-file-earmark-pdf-fill fs-5"></i>
              </div>
              <div className="flex-grow-1 overflow-hidden">
                <div className="fw-medium text-dark text-truncate">Applicant_Resume.pdf</div>
                <a href={selectedApplication.resumeLink} target="_blank" rel="noreferrer" className="small text-primary text-decoration-none fw-semibold">
                  View Document <i className="bi bi-box-arrow-up-right ms-1"></i>
                </a>
              </div>
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
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
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