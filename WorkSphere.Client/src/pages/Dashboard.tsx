import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDashboardSummary } from '../store/slices/dashboardSlice';

const cardStyle: React.CSSProperties = {
  border: '1px solid #e6e6e6',
  borderRadius: 8,
  padding: 16,
  minWidth: 180,
  textAlign: 'center',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
};

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { summary, loading, error } = useAppSelector((s) => s.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  return (
    <section>
      <h2>Dashboard</h2>

      {loading && <div>Loading dashboard summary...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {!loading && !error && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
          <div style={cardStyle}>
            <div style={{ fontSize: 12, color: '#666' }}>Total Employees</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{summary?.totalEmployees ?? '-'}</div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, color: '#666' }}>Active Employees</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{summary?.activeEmployees ?? '-'}</div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, color: '#666' }}>Inactive Employees</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{summary?.inactiveEmployees ?? '-'}</div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, color: '#666' }}>Total Departments</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{summary?.totalDepartments ?? '-'}</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
