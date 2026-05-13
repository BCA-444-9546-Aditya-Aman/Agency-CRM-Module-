import { useState } from "react";

import { Modal, Button, Form } from "react-bootstrap";

import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

export default function AddLeadModal({ show, handleClose }) {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
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

      await addDoc(collection(db, "clientLeads"), {

        ...formData,

        status: "New",

        assignedTo: null,

        createdAt: serverTimestamp()
      });

      alert("Lead Added Successfully");

      handleClose();

      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: ""
      });

    } catch(error) {

      console.log(error);

      alert("Error adding lead");
    }
  }

  return (

    <Modal show={show} onHide={handleClose} centered>

      <Modal.Header closeButton>

        <Modal.Title>
          Add Client Lead
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
            />

          </Form.Group>

          <Form.Group className="mb-3">

            <Form.Label>Phone</Form.Label>

            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

          </Form.Group>

          <Form.Group className="mb-3">

            <Form.Label>Service</Form.Label>

            <Form.Select
              name="service"
              value={formData.service}
              onChange={handleChange}
            >

              <option value="">
                Select Service
              </option>

              <option value="SEO">
                SEO
              </option>

              <option value="Social Media Management">
                Social Media Management
              </option>

              <option value="Website Development">
                Website Development
              </option>

            </Form.Select>

          </Form.Group>

          <Form.Group>

            <Form.Label>Message</Form.Label>

            <Form.Control
              as="textarea"
              rows={3}
              name="message"
              value={formData.message}
              onChange={handleChange}
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
            Add Lead
          </Button>

        </Modal.Footer>

      </Form>

    </Modal>
  )
}