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
      size="lg"
    >

      <Modal.Header closeButton>

        <Modal.Title>
          Task Details
        </Modal.Title>

      </Modal.Header>

      <Modal.Body>

        <div className="mb-3">

          <h5>{selectedTask.title}</h5>

        </div>

        <div className="mb-3">

          <h6>Description</h6>

          <p>{selectedTask.description}</p>

        </div>

        <div className="mb-3">

          <h6>Priority</h6>

          <p>{selectedTask.priority}</p>

        </div>

        <div className="mb-3">

          <h6>Due Date</h6>

          <p>{selectedTask.dueDate}</p>

        </div>

        <hr />

        <Form.Group>

          <Form.Label>
            Task Status
          </Form.Label>

          <Form.Select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >

            <option value="Pending">
              Pending
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Overdue">
              Overdue
            </option>

          </Form.Select>

        </Form.Group>

      </Modal.Body>

      <Modal.Footer>

        <Button
          variant="secondary"
          onClick={handleClose}
        >
          Close
        </Button>

        <Button
          variant="primary"
          onClick={handleUpdate}
        >
          Save Changes
        </Button>

      </Modal.Footer>

    </Modal>
  )
}