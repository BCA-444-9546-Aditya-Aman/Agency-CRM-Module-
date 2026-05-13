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
      size="lg"
    >

      <Modal.Header closeButton>

        <Modal.Title>
          Application Details
        </Modal.Title>

      </Modal.Header>

      <Modal.Body>

        <div className="row">

          <div className="col-md-6 mb-3">

            <h6>Name</h6>

            <p>{selectedApplication.name}</p>

          </div>

          <div className="col-md-6 mb-3">

            <h6>Email</h6>

            <p>{selectedApplication.email}</p>

          </div>

          <div className="col-md-6 mb-3">

            <h6>Phone</h6>

            <p>{selectedApplication.phone}</p>

          </div>

          <div className="col-md-6 mb-3">

            <h6>Position</h6>

            <p>{selectedApplication.position}</p>

          </div>

          <div className="col-md-6 mb-3">

            <h6>Experience</h6>

            <p>{selectedApplication.experience}</p>

          </div>

          <div className="col-12 mb-3">

            <h6>Resume Link</h6>

            <a
              href={selectedApplication.resumeLink}
              target="_blank"
            >
              View Resume
            </a>

          </div>

        </div>

        <hr />

        <Form.Group className="mb-3">

          <Form.Label>
            Application Status
          </Form.Label>

          <Form.Select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >

            <option value="Applied">
              Applied
            </option>

            <option value="Shortlisted">
              Shortlisted
            </option>

            <option value="Interview Scheduled">
              Interview Scheduled
            </option>

            <option value="Selected">
              Selected
            </option>

            <option value="Rejected">
              Rejected
            </option>

          </Form.Select>

        </Form.Group>

        <Form.Group>

          <Form.Label>
            Assign To
          </Form.Label>

          <Form.Select
            value={assignedTo}
            onChange={(e) =>
              setAssignedTo(e.target.value)
            }
          >

            <option value="">
              Select Admin
            </option>

            {admins.map((admin) => (

              <option
                key={admin.id}
                value={admin.id}
              >
                {admin.name} ({admin.role})
              </option>

            ))}

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