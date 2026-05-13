import { useState } from "react";

import {
  Modal,
  Button,
  Form
} from "react-bootstrap";

import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

export default function AddTeamMemberModal({
  show,
  handleClose
}) {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "admin",
    department: ""
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async(e) => {

    e.preventDefault();

    try {

      await addDoc(
        collection(db, "users"),
        {
          ...formData,

          createdAt: serverTimestamp()
        }
      );

      alert("Team Member Added");

      handleClose();

      setFormData({
        name: "",
        email: "",
        role: "admin",
        department: ""
      });

    } catch(error) {

      console.log(error);

      alert(error.message);
    }
  }

  return (

    <Modal
      show={show}
      onHide={handleClose}
      centered
    >

      <Modal.Header closeButton>

        <Modal.Title>
          Add Team Member
        </Modal.Title>

      </Modal.Header>

      <Form onSubmit={handleSubmit}>

        <Modal.Body>

          <Form.Group className="mb-3">

            <Form.Label>Name</Form.Label>

            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

          </Form.Group>

          <Form.Group className="mb-3">

            <Form.Label>Email</Form.Label>

            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </Form.Group>

          <Form.Group className="mb-3">

            <Form.Label>Role</Form.Label>

            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
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

            </Form.Select>

          </Form.Group>

          <Form.Group>

            <Form.Label>Department</Form.Label>

            <Form.Control
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Example: Marketing"
            />

          </Form.Group>

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            type="submit"
          >
            Add Member
          </Button>

        </Modal.Footer>

      </Form>

    </Modal>
  )
}