import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export default function RecordTransactionModal({ show, handleClose, initialType = "credit" }) {
  const [formData, setFormData] = useState({
    type: initialType,
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    description: ""
  });
  const [loading, setLoading] = useState(false);

  // Sync initial type when modal opens
  useEffect(() => {
    if (show) {
      setFormData(prev => ({ ...prev, type: initialType }));
    }
  }, [show, initialType]);

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
      await addDoc(collection(db, "transactions"), {
        type: formData.type,
        amount: Number(formData.amount),
        date: formData.date,
        description: formData.description,
        createdAt: serverTimestamp()
      });

      alert("Transaction recorded successfully");
      
      setFormData({
        type: initialType,
        amount: "",
        date: new Date().toISOString().slice(0, 10),
        description: ""
      });
      
      handleClose();
    } catch (error) {
      console.error("Error adding transaction: ", error);
      alert("Failed to record transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Record Transaction</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row className="g-3">
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="fw-semibold small mb-1">Transaction Type</Form.Label>
                <Form.Select name="type" value={formData.type} onChange={handleChange} required className="shadow-none border-secondary-subtle">
                  <option value="credit">Credit (Revenue)</option>
                  <option value="expense">Debit (Expense)</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="fw-semibold small mb-1">Date</Form.Label>
                <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} required className="shadow-none border-secondary-subtle" />
              </Form.Group>
            </Col>

            <Col sm={12}>
              <Form.Group>
                <Form.Label className="fw-semibold small mb-1">Amount</Form.Label>
                <div className="input-group">
                  <span className="input-group-text border-secondary-subtle bg-light">₹</span>
                  <Form.Control type="number" name="amount" value={formData.amount} onChange={handleChange} required min="0" step="0.01" className="shadow-none border-secondary-subtle" placeholder="0.00" />
                </div>
              </Form.Group>
            </Col>

            <Col sm={12}>
              <Form.Group>
                <Form.Label className="fw-semibold small mb-1">Description</Form.Label>
                <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} required className="shadow-none border-secondary-subtle" placeholder="What was this for?" />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer className="border-top-0">
          <Button variant="light" onClick={handleClose} className="fw-medium px-4">
            Cancel
          </Button>
          <Button variant={formData.type === "credit" ? "success" : "danger"} type="submit" className="fw-semibold px-4" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <i className="bi bi-save me-2"></i>}
            Save Record
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
