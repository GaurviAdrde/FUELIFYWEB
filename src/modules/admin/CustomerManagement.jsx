import "./CustomerManagement.css";
import { useState } from "react";

function CustomerManagement() {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "+1 234 567 890",
      accountStatus: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "janesmith@example.com",
      phone: "+1 987 654 321",
      accountStatus: "Under Review",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);

  const handleAddCustomer = () => {
    setIsModalOpen(true);
    setEditCustomer(null);
  };

  const handleEdit = (customer) => {
    setIsModalOpen(true);
    setEditCustomer(customer);
  };

  const handleDelete = (id) => {
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSaveCustomer = (newCustomer) => {
    if (editCustomer) {
      setCustomers(
        customers.map((customer) =>
          customer.id === editCustomer.id ? newCustomer : customer
        )
      );
    } else {
      setCustomers([...customers, newCustomer]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="customer-management-container">
      <h2>Customer Management</h2>

      <button className="add-customer-button" onClick={handleAddCustomer}>
        Add New Customer
      </button>

      <div className="payment-card">
        <div className="customer-cards-container">
          <h3>Customer Profiles</h3>
          {customers.map((customer) => (
            <div className="customer-card" key={customer.id}>
              <div className="customer-header">
                <h4>{customer.name}</h4>
                <button
                  onClick={() => handleEdit(customer)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(customer.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
              <div className="profile-details">
                <p>
                  <strong>Email:</strong> {customer.email}
                </p>
                <p>
                  <strong>Phone:</strong> {customer.phone}
                </p>
                <p>
                  <strong>Account Status:</strong> {customer.accountStatus}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Support Section */}
      <div className="payment-card">
        <div className="support-section">
          <h3>Customer Support</h3>
          <div className="support-card">
            <p>
              <strong>Support Tickets:</strong> 12 Open
            </p>
            <p>
              <strong>Average Response Time:</strong> 2 Hours
            </p>
            <p>
              <strong>Resolution Rate:</strong> 87%
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Section */}
      <div className="payment-card">
        <div className="analysis-section">
          <h3>Customer Analysis</h3>
          <div className="analysis-card">
            <p>
              <strong>Active Customers:</strong> 150
            </p>
            <p>
              <strong>Under Review:</strong> 25
            </p>
            <p>
              <strong>Suspended:</strong> 5
            </p>
            <p>
              <strong>New Signups This Month:</strong> 40
            </p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CustomerModal
          customer={editCustomer}
          onClose={handleModalClose}
          onSave={handleSaveCustomer}
        />
      )}
    </div>
  );
}

function CustomerModal({ customer, onClose, onSave }) {
  const [name, setName] = useState(customer ? customer.name : "");
  const [email, setEmail] = useState(customer ? customer.email : "");
  const [phone, setPhone] = useState(customer ? customer.phone : "");
  const [accountStatus, setAccountStatus] = useState(
    customer ? customer.accountStatus : "Active"
  );

  const handleSubmit = () => {
    const newCustomer = {
      id: customer ? customer.id : Date.now(),
      name,
      email,
      phone,
      accountStatus,
    };
    onSave(newCustomer);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{customer ? "Edit Customer" : "Add New Customer"}</h3>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <select
          value={accountStatus}
          onChange={(e) => setAccountStatus(e.target.value)}
        >
          <option value="Active">Active</option>
          <option value="Under Review">Under Review</option>
          <option value="Suspended">Suspended</option>
        </select>
        <div className="modal-actions">
          <button onClick={handleSubmit}>
            {customer ? "Save Changes" : "Add Customer"}
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default CustomerManagement;
