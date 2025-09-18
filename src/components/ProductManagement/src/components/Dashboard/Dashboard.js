import React, { useState, useEffect } from 'react';
import { getDashboardData } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart, 
  faUsers, 
  faBox, 
  faDollarSign,
  faChartLine,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getDashboardData();
      setDashboardData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faDollarSign} />
          </div>
          <div className="stat-content">
            <h3>Total Sales</h3>
            <p>${dashboardData.totalSales.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faShoppingCart} />
          </div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p>{dashboardData.totalOrders}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="stat-content">
            <h3>Total Customers</h3>
            <p>{dashboardData.totalCustomers}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faBox} />
          </div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p>{dashboardData.totalProducts}</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-charts">
        <div className="chart-container">
          <h2>Sales Overview</h2>
          <div className="chart-placeholder">
            <FontAwesomeIcon icon={faChartLine} />
            <p>Sales chart will be displayed here</p>
          </div>
        </div>
        
        <div className="chart-container">
          <h2>Top Selling Products</h2>
          <div className="top-products">
            {dashboardData.topSellingProducts.map((product, index) => (
              <div key={product._id} className="top-product">
                <span className="rank">{index + 1}</span>
                <img src={product.images[0]} alt={product.name} />
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p>${product.price} | Sold: {product.soldCount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="recent-activities">
        <h2>Recent Activities</h2>
        <div className="activity-list">
          {dashboardData.recentOrders.map(order => (
            <div key={order._id} className="activity-item">
              <div className="activity-icon">
                <FontAwesomeIcon icon={faShoppingCart} />
              </div>
              <div className="activity-content">
                <p>New order <strong>#{order._id.substring(0, 8)}</strong> from {order.user.name}</p>
                <span className="activity-time">{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <span className={`status ${order.status}`}>{order.status}</span>
            </div>
          ))}
          
          {dashboardData.lowStockProducts.map(product => (
            <div key={product._id} className="activity-item warning">
              <div className="activity-icon">
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </div>
              <div className="activity-content">
                <p>Low stock for <strong>{product.name}</strong></p>
                <span className="activity-time">Stock: {product.stock}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
