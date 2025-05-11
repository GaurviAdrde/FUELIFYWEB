import { useState } from "react";
import "./PaymentInvoicing.css";

function PaymentInvoicing() {
  const [payments, setPayments] = useState([
    { id: "P001", customer: "John Doe", amount: 500, status: "Paid" },
    { id: "P002", customer: "Jane Smith", amount: 750, status: "Pending" },
    { id: "P003", customer: "Robert Brown", amount: 300, status: "Paid" },
    { id: "P004", customer: "Emily White", amount: 650, status: "Pending" },
  ]);

  // State for Invoice Form
  const [invoiceData, setInvoiceData] = useState({
    customerName: "",
    serviceDescription: "",
    amount: "",
  });

  // Financial Data
  const [financialData] = useState({
    totalIncome: 15000,
    totalExpenses: 5000,
    netProfit: 10000,
  });

  const handleInputChange = (e) => {
    setInvoiceData({ ...invoiceData, [e.target.name]: e.target.value });
  };

  const handleGenerateInvoice = (e) => {
    e.preventDefault();
    console.log("Generated Invoice Data:", invoiceData);
    // After generating invoice, you can reset the form
    setInvoiceData({ customerName: "", serviceDescription: "", amount: "" });
    alert("Invoice generated successfully!");
  };

  return (
    <div className="payment-invoicing-container">
      <h2>Payment & Invoicing</h2>

      {/* Track Payments Section */}
      <div className="payment-card">
        <div className="payment-section">
          <h3>Track Payments</h3>
          <table className="payment-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Customer Name</th>
                <th>Amount (₹)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{payment.customer}</td>
                  <td>{payment.amount}</td>
                  <td
                    className={
                      payment.status === "Paid"
                        ? "status-paid"
                        : "status-pending"
                    }
                  >
                    {payment.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Invoice Section */}
      <div className="payment-card">
        <div className="invoice-section">
          <h3>Generate Invoice</h3>
          <form className="invoice-form" onSubmit={handleGenerateInvoice}>
            <input
              type="text"
              name="customerName"
              placeholder="Customer Name"
              value={invoiceData.customerName}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="serviceDescription"
              placeholder="Service Description"
              value={invoiceData.serviceDescription}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount (₹)"
              value={invoiceData.amount}
              onChange={handleInputChange}
              required
            />
            <button type="submit">Generate Invoice</button>
          </form>
        </div>
      </div>

      {/* Financial Report Section */}
      <div className="payment-card">
        <h3>Financial Report</h3>
        <div className="financial-report">
          <div className="report-item">
            <span>Total Income:</span> ₹{financialData.totalIncome}
          </div>
          <div className="report-item">
            <span>Total Expenses:</span> ₹{financialData.totalExpenses}
          </div>
          <div className="report-item">
            <span>Net Profit:</span> ₹{financialData.netProfit}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentInvoicing;
