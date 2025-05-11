import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";

//HomePage
import HomePage from "./pages/HomePage"; // Import at top

// Import Profile Pages
import UserProfilePage from "./pages/UserProfilePage";
import ServiceProviderProfilePage from "./pages/ServiceProviderProfilePage";

// Dashboards
import UserDashboard from "./dashboards/UserDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";
import ServiceDashboard from "./dashboards/ServiceDashboard";

// User Modules
// ✅ Import the unified service request module
import UnifiedServiceRequest from "./modules/user/UnifiedServiceRequest";
import UserRequestHistory from "./modules/user/UserRequestHistory";
import RequestStatus from "./modules/user/RequestStatus";

// Admin Modules
import OverviewDashboard from "./modules/admin/OverviewDashboard";
import OrderManagement from "./modules/admin/OrderManagement";
import FleetManagement from "./modules/admin/FleetManagement";
import CustomerManagement from "./modules/admin/CustomerManagement";
import PaymentInvoicing from "./modules/admin/PaymentInvoicing";

// Service Modules
import ServiceFleetManagement from "./modules/service/FleetManagement";
import NewOrders from "./modules/service/NewOrders";
import OrderHistory from "./modules/service/OrderHistory";
import ServiceFeedback from "./modules/service/ServiceFeedback";

// Login Page
import LoginPage from "./components/LoginPage"; // Import the LoginPage component

// Signup Page
import SignupPage from "./components/SignupPage"; //Import the SignupPage component

import "./App.css";

function AppRoutes() {
  const location = useLocation();

  return (
    <>
      <h1>Fuelify</h1>

      <nav style={{ marginBottom: "20px" }}>
        <Link to="/user">User Dashboard</Link> |{" "}
        <Link to="/admin">Admin Dashboard</Link> |{" "}
        <Link to="/service">Service Dashboard</Link> |{" "}
        <Link to="/login">Login</Link> {/* Add the Login link */}
      </nav>

      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        {/* Profile Pages Routes */}
        <Route path="/user-profile" element={<UserProfilePage />} />
        <Route
          path="/service-provider-profile"
          element={<ServiceProviderProfilePage />}
        />
        {/* Login Page Route */}
        <Route path="/login" element={<LoginPage />} />{" "}
        {/* Add route for login */}
        {/* Signup Page Route */}
        <Route path="/signup" element={<SignupPage />} />{" "}
        {/* Add route for signup */}
        {/* User Dashboard + Nested Routes */}
        <Route path="/user/*" element={<UserDashboard />}>
          <Route path="request" element={<UnifiedServiceRequest />} />{" "}
          {/* NEW */}
          <Route path="history" element={<UserRequestHistory />} />
          <Route path="status" element={<RequestStatus />} />
        </Route>
        {/* Admin Dashboard + Nested Routes */}
        <Route path="/admin/*" element={<AdminDashboard />}>
          <Route path="overview" element={<OverviewDashboard />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="fleet" element={<FleetManagement />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="payments" element={<PaymentInvoicing />} />
        </Route>
        {/* Service Dashboard + Nested Routes */}
        <Route path="/service/*" element={<ServiceDashboard />}>
          <Route path="fleet-management" element={<ServiceFleetManagement />} />
          <Route path="new-orders" element={<NewOrders />} />
          <Route path="order-history" element={<OrderHistory />} />
          <Route path="service-feedback" element={<ServiceFeedback />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
