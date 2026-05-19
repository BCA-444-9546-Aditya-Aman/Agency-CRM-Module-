import { useEffect, useState } from "react";

import {
  doc,
  updateDoc
} from "firebase/firestore";

import {
  Modal,
  Button,
  Form
} from "react-bootstrap";

import { db } from "@/firebase/firebase";

export default function TaskDetailsModal({
  show,
  handleClose,
  selectedTask
}) {

  const [status, setStatus] = useState("");

  useEffect(() => {

    if(selectedTask) {

      setStatus(selectedTask.status || "");
    }

  }, [selectedTask]);

  const handleUpdate = async() => {

    try {

      const taskRef = doc(
        db,
        "tasks",
        selectedTask.id
      );

      await updateDoc(taskRef, {
        status
      });

      alert("Task Updated");

      handleClose();

    } catch(error) {

      console.log(error);

      alert("Error updating task");
    }
  }

  if(!selectedTask) return null;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="md"
    >
      <Modal.Header className="border-bottom-0 pb-0">
        <Modal.Title className="fw-bold fs-4 text-dark" style={{ letterSpacing: '-0.5px' }}>
          Task Details
        </Modal.Title>
        <button type="button" className="btn-close shadow-none" onClick={handleClose}></button>
      </Modal.Header>

      <Modal.Body className="pt-3">
        {/* Task Info Card */}
        <div className="bg-light rounded-4 p-3 mb-4 border" style={{ borderColor: '#e2e8f0' }}>
          <div className="d-flex align-items-center mb-3 pb-3 border-bottom" style={{ borderColor: '#e2e8f0' }}>
            <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold fs-5 shadow-sm" style={{ width: "50px", height: "50px" }}>
              <i className="bi bi-list-check"></i>
            </div>
            <div className="ms-3 overflow-hidden">
              <h5 className="mb-0 fw-bold text-dark text-truncate">{selectedTask.title}</h5>
              <div className="text-secondary small mt-1 fw-medium">
                Due: {selectedTask.dueDate}
              </div>
            </div>
          </div>

          <div className="row g-2">
            <div className="col-12 col-sm-6">
              <div className="d-flex align-items-center text-secondary small fw-medium">
                <div className="bg-white rounded p-1 me-2 shadow-sm border" style={{ width: '28px', textAlign: 'center' }}>
                  <i className="bi bi-flag-fill text-muted"></i>
                </div>
                <span>Priority: {selectedTask.priority}</span>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="d-flex align-items-center text-secondary small fw-medium">
                <div className="bg-white rounded p-1 me-2 shadow-sm border" style={{ width: '28px', textAlign: 'center' }}>
                  <i className="bi bi-info-circle-fill text-muted"></i>
                </div>
                <span>Status: {selectedTask.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        {selectedTask.description && (
          <div className="mb-4">
            <label className="form-label fw-semibold text-dark small mb-2 text-uppercase tracking-wide">Task Description</label>
            <div className="p-3 bg-white border rounded-3 text-secondary small lh-lg" style={{ borderColor: '#e2e8f0', minHeight: '60px' }}>
              {selectedTask.description}
            </div>
          </div>
        )}

        {/* Update Controls */}
        <Form.Group className="mb-2">
          <Form.Label className="fw-bold small text-dark mb-1">Update Status</Form.Label>
          <Form.Select
            className="form-select shadow-none border-secondary-subtle"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </Form.Select>
        </Form.Group>
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