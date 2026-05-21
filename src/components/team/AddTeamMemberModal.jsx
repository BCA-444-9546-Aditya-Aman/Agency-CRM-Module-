import { useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export default function AddTeamMemberModal({ show, handleClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    aadhar: "",
    pan: "",
    role: "member",
    department: "",
    workExperience: "",
    position: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "users"), {
        ...formData,
        createdAt: serverTimestamp()
      });

      alert("Team Member Added");
      handleClose();
      setFormData({
        name: "",
        email: "",
        phone: "",
        aadhar: "",
        pan: "",
        role: "member",
        department: "",
        workExperience: "",
        position: ""
      });
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header className="border-bottom-0 pb-0">
        <Modal.Title className="fw-bold fs-4 text-dark">Add Team Member</Modal.Title>
        <button type="button" className="btn-close shadow-none" onClick={handleClose} disabled={loading}></button>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body className="pt-3">
          <Row className="g-3">
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="fw-bold small text-dark mb-1">Name</Form.Label>
                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="fw-bold small text-dark mb-1">Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="fw-bold small text-dark mb-1">Phone</Form.Label>
                <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="fw-bold small text-dark mb-1">Aadhar Number</Form.Label>
                <Form.Control type="text" name="aadhar" value={formData.aadhar} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="fw-bold small text-dark mb-1">PAN Number</Form.Label>
                <Form.Control type="text" name="pan" value={formData.pan} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="fw-bold small text-dark mb-1">Work Experience</Form.Label>
                <Form.Control type="text" name="workExperience" value={formData.workExperience} onChange={handleChange} placeholder="e.g. 5 Years" />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="fw-bold small text-dark mb-1">Role</Form.Label>
                <Form.Select name="role" value={formData.role} onChange={handleChange}>
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="sales">Sales</option>
                  <option value="hr">HR</option>
                  <option value="member">Member</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="fw-bold small text-dark mb-1">Department</Form.Label>
                <Form.Control type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Example: Marketing" />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="fw-bold small text-dark mb-1">Position</Form.Label>
                <Form.Control type="text" name="position" value={formData.position} onChange={handleChange} placeholder="e.g. Senior Developer" />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer className="border-top-0 pt-2 pb-4 px-4">
          <Button variant="light" className="text-muted fw-bold px-4 border-0 shadow-none bg-transparent hover-bg-light" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="fw-semibold px-4 rounded-pill shadow-sm" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Add Member"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}