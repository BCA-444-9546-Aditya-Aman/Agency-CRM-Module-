import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { Table, Card, Row, Col, Spinner, Button } from "react-bootstrap";
import { db } from "@/firebase/firebase";
import DashboardLayout from "@/layouts/DashboardLayout";
import RecordTransactionModal from "@/components/payments/RecordTransactionModal";

export default function Payments() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("credit");

  // Filters
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const [filterMonth, setFilterMonth] = useState(currentMonth);

  useEffect(() => {
    const q = query(collection(db, "transactions"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(data);
      setLoading(false);
    }, (error) => {
      console.error(error);
      alert("Error fetching transactions");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteDoc(doc(db, "transactions", id));
      } catch (error) {
        console.error(error);
        alert("Failed to delete transaction");
      }
    }
  };

  const handleOpenModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const filteredTransactions = transactions.filter(t => {
    if (!filterMonth) return true;
    return t.date && t.date.startsWith(filterMonth);
  });

  const totalRevenue = filteredTransactions.filter(t => t.type === "credit").reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = filteredTransactions.filter(t => t.type === "expense").reduce((acc, curr) => acc + curr.amount, 0);
  const profitLoss = totalRevenue - totalExpense;

  const exportCSV = () => {
    if (filteredTransactions.length === 0) {
      alert("No records to export.");
      return;
    }

    const headers = ["Date", "Description", "Type", "Amount"];
    const rows = filteredTransactions.map(t => [
      `"${t.date ? new Date(t.date).toLocaleDateString() : ''}"`,
      `"${(t.description || '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`, // escape quotes and remove newlines
      `"${t.type || ''}"`,
      t.amount || 0
    ]);

    const csvContent = "\uFEFF" + [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `transactions_${filterMonth || "all"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
          <Spinner animation="border" variant="primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-3">
        <div className="mb-3 mb-md-0">
          <h2 className="fw-bolder text-dark mb-1" style={{ letterSpacing: '-0.5px' }}>Financial Records</h2>
          <p className="text-secondary fw-medium mb-0">Track revenue and expenses</p>
        </div>
        
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <input 
            type="month" 
            className="form-control shadow-sm border-secondary-subtle fw-medium me-md-2"
            style={{ width: '180px', backgroundColor: '#f8fafc' }}
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          />
          <Button variant="success" className="fw-semibold px-3 shadow-sm" onClick={() => handleOpenModal("credit")}>
            <i className="bi bi-plus-circle me-2"></i> Record Credit
          </Button>
          <Button variant="danger" className="fw-semibold px-3 shadow-sm" onClick={() => handleOpenModal("expense")}>
            <i className="bi bi-dash-circle me-2"></i> Record Expense
          </Button>
          <Button variant="outline-primary" className="fw-semibold px-3 shadow-sm" onClick={exportCSV}>
            <i className="bi bi-file-earmark-excel me-2"></i> Export CSV
          </Button>
        </div>
      </div>

      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 text-center h-100 p-3" style={{ backgroundColor: '#f0fdf4' }}>
            <Card.Body>
              <h6 className="text-success fw-bold text-uppercase mb-2" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>Total Revenue</h6>
              <h2 className="fw-bolder text-success mb-0">₹{totalRevenue.toLocaleString()}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 text-center h-100 p-3" style={{ backgroundColor: '#fef2f2' }}>
            <Card.Body>
              <h6 className="text-danger fw-bold text-uppercase mb-2" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>Total Expenses</h6>
              <h2 className="fw-bolder text-danger mb-0">₹{totalExpense.toLocaleString()}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 text-center h-100 p-3" style={{ backgroundColor: profitLoss >= 0 ? '#f8fafc' : '#fff5f5' }}>
            <Card.Body>
              <h6 className={`fw-bold text-uppercase mb-2 ${profitLoss >= 0 ? 'text-primary' : 'text-danger'}`} style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>
                Profit / Loss
              </h6>
              <h2 className={`fw-bolder mb-0 ${profitLoss >= 0 ? 'text-primary' : 'text-danger'}`}>
                {profitLoss >= 0 ? '+' : ''}₹{profitLoss.toLocaleString()}
              </h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Header className="bg-white border-bottom pt-4 pb-3 px-4 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold text-dark mb-0">Transaction History</h5>
          <span className="badge bg-secondary-subtle text-secondary-emphasis rounded-pill px-3 py-2 fw-medium">
            {filteredTransactions.length} Records
          </span>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="py-3 px-4 border-bottom-0 text-secondary fw-semibold small text-uppercase" style={{ letterSpacing: '0.5px' }}>Date</th>
                  <th className="py-3 px-4 border-bottom-0 text-secondary fw-semibold small text-uppercase" style={{ letterSpacing: '0.5px' }}>Description</th>
                  <th className="py-3 px-4 border-bottom-0 text-secondary fw-semibold small text-uppercase" style={{ letterSpacing: '0.5px' }}>Type</th>
                  <th className="py-3 px-4 border-bottom-0 text-secondary fw-semibold small text-uppercase text-end" style={{ letterSpacing: '0.5px' }}>Amount</th>
                  <th className="py-3 px-4 border-bottom-0 text-secondary fw-semibold small text-uppercase text-center" style={{ letterSpacing: '0.5px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map(t => (
                    <tr key={t.id}>
                      <td className="py-3 px-4 fw-medium text-dark">
                        {t.date ? new Date(t.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-secondary small text-truncate" style={{ maxWidth: '350px' }}>{t.description}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge bg-${t.type === 'credit' ? 'success' : 'danger'} bg-opacity-10 text-${t.type === 'credit' ? 'success' : 'danger'} rounded-pill px-3 py-1 fw-medium text-capitalize`}>
                          {t.type}
                        </span>
                      </td>
                      <td className={`py-3 px-4 fw-bold text-end ${t.type === 'credit' ? 'text-success' : 'text-danger'}`}>
                        {t.type === 'credit' ? '+' : '-'}₹{t.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button className="btn btn-link text-danger p-0" onClick={() => handleDelete(t.id)} title="Delete Record">
                          <i className="bi bi-trash3"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-secondary">
                      <i className="bi bi-wallet2 fs-1 d-block mb-3 text-muted opacity-50"></i>
                      <h6 className="fw-semibold mb-1">No transactions found</h6>
                      <p className="small mb-0">Record a credit or expense to get started</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <RecordTransactionModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        initialType={modalType} 
      />
    </DashboardLayout>
  );
}
