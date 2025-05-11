import './OverviewDashboard.css';

const summaryData = [
  { label: 'Total Orders', value: 123 },
  { label: 'Revenue', value: '₹1,20,000' },
  { label: 'Active Deliveries', value: 8 },
  { label: 'Pending Orders', value: 5 },
  { label: 'Completed Deliveries', value: 110 },
  { label: 'Customer Rating', value: '4.7⭐' },
];

function OverviewDashboard() {
  return (
    <div className="overview-container">
      <h2>Admin Overview & Summary</h2>
      <div className="summary-grid">
        {summaryData.map((item, index) => (
          <div className="summary-card" key={index}>
            <h3>{item.label}</h3>
            <p>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OverviewDashboard;
