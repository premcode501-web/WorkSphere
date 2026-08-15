import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EmployeeForm from '../components/employees/EmployeeForm';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchEmployees,
  deleteEmployeeThunk,
} from '../store/slices/employeeThunks';
import { setPageNumber } from '../store/slices/employeeSlice';
import './Employees.css';

const Employees: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const employees = useAppSelector((s) => s.employees.employees);
  const pageNumber = useAppSelector((s) => s.employees.pageNumber);
  const pageSize = useAppSelector((s) => s.employees.pageSize);
  const totalPages = useAppSelector((s) => s.employees.totalPages);
  const totalCount = useAppSelector((s) => s.employees.totalCount);
  const loading = useAppSelector((s) => s.employees.loading);
  const error = useAppSelector((s) => s.employees.error);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string | undefined>(
    undefined
  );
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [operationMessage, setOperationMessage] = useState<string | null>(
    null
  );
  const [operationError, setOperationError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(
      fetchEmployees({
        pageNumber,
        pageSize,
        search: searchQuery,
      })
    );
  }, [dispatch, pageNumber, pageSize, searchQuery]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get('new') === '1') {
      setShowForm(true);
      setEditingEmployeeId(null);
    }
  }, [location.search]);

  function handlePrev() {
    const newPage = Math.max(1, pageNumber - 1);

    dispatch(setPageNumber(newPage));

    dispatch(
      fetchEmployees({
        pageNumber: newPage,
        pageSize,
        search: searchQuery,
      })
    );
  }

  function handleNext() {
    const newPage = Math.min(totalPages, pageNumber + 1);

    dispatch(setPageNumber(newPage));

    dispatch(
      fetchEmployees({
        pageNumber: newPage,
        pageSize,
        search: searchQuery,
      })
    );
  }

  function handleSearchSubmit(e?: React.FormEvent) {
    if (e) {
      e.preventDefault();
    }

    const q =
      searchTerm.trim() === ''
        ? undefined
        : searchTerm.trim();

    setSearchQuery(q);
    dispatch(setPageNumber(1));

    dispatch(
      fetchEmployees({
        pageNumber: 1,
        pageSize,
        search: q,
      })
    );
  }

  function formatDate(dateStr?: string) {
    if (!dateStr) {
      return '';
    }

    try {
      const d = new Date(dateStr);

      if (Number.isNaN(d.getTime())) {
        return dateStr;
      }

      return d.toLocaleDateString();
    } catch {
      return dateStr;
    }
  }

  function handleCreated() {
    setShowForm(false);
    setEditingEmployeeId(null);

    if (location.search.includes('new')) {
      navigate('/employees', {
        replace: true,
      });
    }
  }

  function handleEdit(id: string) {
    setEditingEmployeeId(id);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    const confirm = window.confirm(
      'Are you sure you want to delete this employee? This action cannot be undone.'
    );

    if (!confirm) {
      return;
    }

    setOperationMessage(null);
    setOperationError(null);
    setDeletingId(id);

    try {
      await dispatch(deleteEmployeeThunk(id));
      setOperationMessage('Employee deleted successfully');
    } catch (err: any) {
      console.error('Failed to delete employee', err);
      setOperationError(
        err?.message ?? 'Failed to delete employee'
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="employees-page">

      {/* Header */}
      <div className="employees-header">
        <h2 className="employees-title">
          Employees
        </h2>

        {!showForm && (
          <button
            type="button"
            className="employee-add-btn"
            onClick={() => {
              setEditingEmployeeId(null);
              setShowForm(true);
            }}
          >
            + New Employee
          </button>
        )}
      </div>

      {/* Search */}
      <div className="employees-toolbar">
        <form
          onSubmit={handleSearchSubmit}
          className="employee-search-form"
        >
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="employee-search-input"
            aria-label="Search employees"
          />

          <button
            type="submit"
            className="employee-search-btn"
          >
            Search
          </button>
        </form>
      </div>

      {/* Employee Form */}
      {showForm && (
        <div className="employee-form-container">
          <EmployeeForm
            key={editingEmployeeId ?? 'new'}
            employeeId={editingEmployeeId ?? undefined}
            onCancel={() => {
              setShowForm(false);
              setEditingEmployeeId(null);

              if (location.search.includes('new')) {
                navigate('/employees', {
                  replace: true,
                });
              }
            }}
            onSuccess={() => handleCreated()}
          />
        </div>
      )}

      {/* Messages */}
      {operationMessage && (
        <div className="employee-message success">
          {operationMessage}
        </div>
      )}

      {operationError && (
        <div className="employee-message error">
          {operationError}
        </div>
      )}

      {loading && (
        <div className="employee-state">
          Loading employees...
        </div>
      )}

      {error && (
        <div className="employee-state error">
          Error: {error}
        </div>
      )}

      {!loading && !error && employees.length === 0 && (
        <div className="employee-state">
          No employees found.
        </div>
      )}

      {/* Employee Table */}
      {!loading && !error && employees.length > 0 && (
        <div className="employees-panel">

          <div className="employee-table-wrap">

            <table className="employee-table">

              <thead>
                <tr>
                  <th>Employee Code</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Department</th>
                  <th>Date of Joining</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>

                    <td>
                      <span className="employee-code">
                        {emp.employeeCode}
                      </span>
                    </td>

                    <td className="employee-name">
                      {emp.firstName}
                    </td>

                    <td>
                      {emp.lastName}
                    </td>

                    <td className="employee-email">
                      {emp.email}
                    </td>

                    <td>
                      {emp.phoneNumber}
                    </td>

                    <td className="employee-department">
                      {emp.departmentName}
                    </td>

                    <td>
                      {formatDate(emp.dateOfJoining)}
                    </td>

                    <td>
                      <span
                        className={
                          emp.isActive
                            ? 'employee-status active'
                            : 'employee-status inactive'
                        }
                      >
                        {emp.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td>
                      <div className="employee-actions">

                        <button
                          type="button"
                          className="employee-action-btn edit"
                          onClick={() =>
                            handleEdit(emp.id)
                          }
                          disabled={deletingId !== null}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="employee-action-btn delete"
                          onClick={() =>
                            handleDelete(emp.id)
                          }
                          disabled={deletingId !== null}
                        >
                          {deletingId === emp.id
                            ? 'Deleting...'
                            : 'Delete'}
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>

          {/* Pagination */}
          <div className="employee-pagination">

            <div className="pagination-buttons">

              <button
                type="button"
                className="pagination-btn"
                onClick={handlePrev}
                disabled={pageNumber <= 1}
              >
                Previous
              </button>

              <button
                type="button"
                className="pagination-btn"
                onClick={handleNext}
                disabled={pageNumber >= totalPages}
              >
                Next
              </button>

            </div>

            <div className="pagination-info">
              Page <strong>{pageNumber}</strong> of{' '}
              <strong>{totalPages}</strong>
              <span className="pagination-divider">|</span>
              Page size: {pageSize}
              <span className="pagination-divider">|</span>
              Total records: {totalCount}
            </div>

          </div>

        </div>
      )}

    </section>
  );
};

export default Employees;