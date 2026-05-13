import { useState } from "react";

import { Modal, Button, Form } from "react-bootstrap";

import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

export default function AddJobApplicationModal({
  show,
  handleClose
}) {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    resumeLink: ""
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
        collection(db, "jobApplications"),
        {
          ...formData,

          status: "Applied",

          assignedTo: null,

          createdAt: serverTimestamp()
        }
      );

      alert("Application Added Successfully");

      handleClose();

      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        experience: "",
        resumeLink: ""
      });

    } catch(error) {

      console.log(error);

      alert("Error adding application");
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
          Add Job Application
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

            <Form.Label>Position</Form.Label>

            <Form.Select
              name="position"
              value={formData.position}
              onChange={handleChange}
            >

              <option value="">
                Select Position
              </option>

              <option value="SEO Intern">
                SEO Intern
              </option>

              <option value="Social Media Manager">
                Social Media Manager
              </option>

              <option value="Graphic Designer">
                Graphic Designer
              </option>

              <option value="Web Developer">
                Web Developer
              </option>

            </Form.Select>

          </Form.Group>

          <Form.Group className="mb-3">

            <Form.Label>Experience</Form.Label>

            <Form.Control
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
            />

          </Form.Group>

          <Form.Group>

            <Form.Label>Resume Link</Form.Label>

            <Form.Control
              type="text"
              name="resumeLink"
              value={formData.resumeLink}
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
            Add Application
          </Button>

        </Modal.Footer>

      </Form>

    </Modal>
  )
}