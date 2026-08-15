import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDashboardSummary } from '../store/slices/dashboardSlice';
import { fetchEmployees } from '../store/slices/employeeThunks';
import '../styles/dashboard.css';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { summary, loading: summaryLoading, error: summaryError } = useAppSelector((s) => s.dashboard);
  const employees = useAppSelector((s) => s.employees.employees);
  const employeesLoading = useAppSelector((s) => s.employees.loading);
  const employeeError = useAppSelector((s) => s.employees.error);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
    dispatch(fetchEmployees({ pageNumber: 1, pageSize: 5 }));
  }, [dispatch]);

  const recentEmployees = useMemo(
    () =>
      [...employees]
        .sort((employeeA, employeeB) => {
          const dateA = employeeA.dateOfJoining ? new Date(employeeA.dateOfJoining).getTime() : 0;
          const dateB = employeeB.dateOfJoining ? new Date(employeeB.dateOfJoining).getTime() : 0;

          if (dateA !== dateB) {
            return dateB - dateA;
          }

          return (employeeB.id ?? '').localeCompare(employeeA.id ?? '');
        })
        .slice(0, 5),
    [employees]
  );

  const summaryCards = [
    {
      title: 'Total Employees',
      value: summary?.totalEmployees ?? '-',
      subtitle: 'Workforce',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-8 1a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm0 2c-2.67 0-8 1.34-8 4v1h10v-1c0-1.13 1.06-2.46 3.05-3.35A7.79 7.79 0 0 0 8 14Zm8 0c3.5 0 7 1.32 7 4v1h-7v-1c0-1.72-1.28-3.35-3.38-4.17A5.63 5.63 0 0 1 16 14Z" />
        </svg>
      ),
    },
    {
      title: 'Active Employees',
      value: summary?.activeEmployees ?? '-',
      subtitle: 'Currently Active',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9.55 15.15 5.7 11.3l-1.4 1.4 5.25 5.25 10.35-10.35-1.4-1.4-8.95 8.95Z" />
        </svg>
      ),
    },
    {
      title: 'Inactive Employees',
      value: summary?.inactiveEmployees ?? '-',
      subtitle: 'Currently Inactive',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 12h12v2H6v-2Zm0-7h12v2H6V5Zm0 14h12v2H6v-2Z" />
        </svg>
      ),
    },
    {
      title: 'Total Departments',
      value: summary?.totalDepartments ?? '-',
      subtitle: 'Organization',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 21V7.5L12 3l9 4.5V21h-5v-7H8v7H3Zm2 0h2v-7h8v7h2V8.7L12 5.3 5 8.7V21Z" />
        </svg>
      ),
    },
  ];

  const quickActions = [
    {
      title: 'Add Employee',
      route: '/employees?new=1',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />
        </svg>
      ),
    },
    {
      title: 'View Employees',
      route: '/employees',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-8 1a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm0 2c-2.67 0-8 1.34-8 4v1h10v-1c0-1.13 1.06-2.46 3.05-3.35A7.79 7.79 0 0 0 8 14Zm8 0c2.76 0 5.47.88 7.35 2.33A7.26 7.26 0 0 1 24 19v1h-8v-1c0-1.34-1.12-2.69-3.1-3.38A6.1 6.1 0 0 1 16 14Z" />
        </svg>
      ),
    },
    {
      title: 'View Departments',
      route: '/departments',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 21V7.5L12 3l9 4.5V21h-5v-7H8v7H3Zm2 0h2v-7h8v7h2V8.7L12 5.3 5 8.7V21Z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="dashboard-page">
      <header className="dashboard-header">
        <p className="dashboard-kicker">Overview</p>
        <h2 className="dashboard-title">Dashboard</h2>
      </header>

      {summaryLoading && <div className="dashboard-state">Loading dashboard summary...</div>}
      {summaryError && <div className="dashboard-state dashboard-state-error">{summaryError}</div>}

      <div className="dashboard-cards-grid">
        {summaryCards.map((card) => (
          <article key={card.title} className="dashboard-card">
            <div className="card-icon">{card.icon}</div>
            <div className="card-title">{card.title}</div>
            <div className="card-value">{card.value}</div>
            <div className="card-subtitle">{card.subtitle}</div>
          </article>
        ))}
      </div>

      <div className="quick-actions-section">
        <div className="section-header">Quick Actions</div>
        <div className="quick-actions-grid">
          {quickActions.map((action) => (
            <button
              key={action.title}
              type="button"
              className="quick-action-card"
              onClick={() => navigate(action.route)}
            >
              <span className="quick-action-icon">{action.icon}</span>
              <span className="quick-action-title">{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="recent-employees">
        <div className="section-header">Recent Employees</div>

        {employeesLoading && <div className="dashboard-state">Loading recent employees...</div>}
        {employeeError && (
          <div className="dashboard-state dashboard-state-error">Unable to load recent employees: {employeeError}</div>
        )}

        {!employeesLoading && !employeeError && recentEmployees.length === 0 && (
          <div className="dashboard-state">No employees available.</div>
        )}

        {!employeesLoading && !employeeError && recentEmployees.length > 0 && (
          <div className="recent-employees-table-wrap">
            <table className="recent-employees-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div className="employee-name-cell">
                        <span className="employee-avatar">{employee.firstName.charAt(0)}{employee.lastName.charAt(0)}</span>
                        <span>
                          {employee.firstName} {employee.lastName}
                        </span>
                      </div>
                    </td>
                    <td>{employee.employeeCode}</td>
                    <td>{employee.departmentName || 'Unassigned'}</td>
                    <td>
                      <span className={`status-badge ${employee.isActive ? 'status-active' : 'status-inactive'}`}>
                        {employee.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;