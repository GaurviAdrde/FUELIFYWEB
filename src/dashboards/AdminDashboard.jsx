import { Link, Outlet } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <nav className="admin-nav">
        <Link to="/admin/overview">Overview & Summary</Link> |{' '}
        <Link to="/admin/orders">Order Management</Link> |{' '}
        <Link to="/admin/fleet">Fleet Management</Link> |{' '}
        <Link to="/admin/customers">Customer Management</Link> |{' '}
        <Link to="/admin/payments">Payment & Invoicing</Link>
      </nav>

      {/* Render nested module components here */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashboard;
