import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs
} from "firebase/firestore";

import {
  Modal,
  Button,
  Form
} from "react-bootstrap";

import { db } from "@/firebase/firebase";

import { useAuth } from "@/context/AuthContext";

export default function AddTaskModal({
  show,
  handleClose
}) {

  const { currentUser } = useAuth();

  const [admins, setAdmins] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: ""
  });

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
        collection(db, "tasks"),
        {
          ...formData,

          assignedBy: currentUser.uid,

          status: "Pending",

          createdAt: serverTimestamp()
        }
      );

      alert("Task Added Successfully");

      handleClose();

      setFormData({
        title: "",
        description: "",
        assignedTo: "",
        priority: "Medium",
        dueDate: ""
      });

    } catch(error) {

      console.log(error);

      alert("Error adding task");
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
          Add Task
        </Modal.Title>

      </Modal.Header>

      <Form onSubmit={handleSubmit}>

        <Modal.Body>

          <Form.Group className="mb-3">

            <Form.Label>
              Task Title
            </Form.Label>

            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

          </Form.Group>

          <Form.Group className="mb-3">

            <Form.Label>
              Description
            </Form.Label>

            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />

          </Form.Group>

          <Form.Group className="mb-3">

            <Form.Label>
              Assign To
            </Form.Label>

            <Form.Select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
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

          <Form.Group className="mb-3">

            <Form.Label>
              Priority
            </Form.Label>

            <Form.Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >

              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>

            </Form.Select>

          </Form.Group>

          <Form.Group>

            <Form.Label>
              Due Date
            </Form.Label>

            <Form.Control
              type="date"
              name="dueDate"
              value={formData.dueDate}
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
            Add Task
          </Button>

        </Modal.Footer>

      </Form>

    </Modal>
  )
}