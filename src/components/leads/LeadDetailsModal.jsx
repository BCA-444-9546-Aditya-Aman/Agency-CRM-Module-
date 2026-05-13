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
      size="lg"
    >

      <Modal.Header closeButton>

        <Modal.Title>
          Lead Details
        </Modal.Title>

      </Modal.Header>

      <Modal.Body>

        <div className="row">

          <div className="col-md-6 mb-3">

            <h6>Name</h6>

            <p>{selectedLead.name}</p>

          </div>

          <div className="col-md-6 mb-3">

            <h6>Email</h6>

            <p>{selectedLead.email}</p>

          </div>

          <div className="col-md-6 mb-3">

            <h6>Phone</h6>

            <p>{selectedLead.phone}</p>

          </div>

          <div className="col-md-6 mb-3">

            <h6>Service</h6>

            <p>{selectedLead.service}</p>

          </div>

          <div className="col-12 mb-3">

            <h6>Message</h6>

            <p>{selectedLead.message}</p>

          </div>

        </div>

        <hr />

        {/* Status */}

        <Form.Group className="mb-3">

          <Form.Label>
            Lead Status
          </Form.Label>

          <Form.Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >

            <option value="New">New</option>

            <option value="Contacted">
              Contacted
            </option>

            <option value="Interested">
              Interested
            </option>

            <option value="Follow-Up">
              Follow-Up
            </option>

            <option value="Converted">
              Converted
            </option>

            <option value="Closed">
              Closed
            </option>

          </Form.Select>

        </Form.Group>

        {/* Assign Admin */}

        <Form.Group>

          <Form.Label>
            Assign To
          </Form.Label>

          <Form.Select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
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