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

      setDepartment(
        selectedMember.department || ""
      );
    }

  }, [selectedMember]);

  const handleUpdate = async() => {

    try {

      const memberRef = doc(
        db,
        "users",
        selectedMember.id
      );

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
  }

  if(!selectedMember) return null;

  return (

    <Modal
      show={show}
      onHide={handleClose}
      centered
    >

      <Modal.Header closeButton>

        <Modal.Title>
          Team Member Details
        </Modal.Title>

      </Modal.Header>

      <Modal.Body>

        <div className="mb-3">

          <h5>{selectedMember.name}</h5>

          <p className="text-muted">
            {selectedMember.email}
          </p>

        </div>

        <hr />

        <Form.Group className="mb-3">

          <Form.Label>
            Role
          </Form.Label>

          <Form.Select
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
          >

            <option value="admin">
              Admin
            </option>

            <option value="sales">
              Sales
            </option>

            <option value="hr">
              HR
            </option>

            <option value="superadmin">
              Super Admin
            </option>

          </Form.Select>

        </Form.Group>

        <Form.Group>

          <Form.Label>
            Department
          </Form.Label>

          <Form.Control
            type="text"
            value={department}
            onChange={(e) =>
              setDepartment(e.target.value)
            }
          />

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