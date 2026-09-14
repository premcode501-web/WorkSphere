import React, { useEffect, useState } from 'react';
import DepartmentForm from '../components/departments/DepartmentForm';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../store/slices/departmentSlice';
import type { Department, DepartmentCreateRequest, DepartmentUpdateRequest } from '../types';
import './Departments.css';

const Departments: React.FC = () => {
  const dispatch = useAppDispatch();
  const { departments, loading, error } = useAppSelector((s) => s.departments);

  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    void dispatch(fetchDepartments());
  }, [dispatch]);

  const handleSubmit = async (payload: DepartmentCreateRequest | DepartmentUpdateRequest) => {
    setIsSubmitting(true);

    try {
      if (editingDepartment) {
        await dispatch(updateDepartment({ id: editingDepartment.id, payload: payload as DepartmentUpdateRequest })).unwrap();
      } else {
        await dispatch(createDepartment(payload as DepartmentCreateRequest)).unwrap();
      }

      setShowForm(false);
      setEditingDepartment(null);
    } catch (err) {
      // errors are handled in Redux state (error). Keep local UI unchanged otherwise.
      // Could also show a toast if desired.
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (department: Department) => {
    const confirmed = window.confirm(`Are you sure you want to delete the ${department.name} department?`);
    if (!confirmed) return;

    setDeletingId(department.id);

    try {
      await dispatch(deleteDepartment(department.id)).unwrap();
    } catch (err) {
      // error set in redux
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="departments-page">
      <div className="departments-header">
        <h2 className="departments-title">Departments</h2>

        {!showForm && (
          <button
            type="button"
            className="departments-add-btn"
            onClick={() => {
              setEditingDepartment(null);
              setShowForm(true);
            }}
          >
            Add Department
          </button>
        )}
      </div>

      {showForm && (
        <DepartmentForm
          initialValues={editingDepartment ?? undefined}
          submitLabel={editingDepartment ? 'Update Department' : 'Add Department'}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingDepartment(null);
          }}
        />
      )}

      {error && <div className="departments-state error">{error}</div>}

      {loading ? (
        <div className="departments-state">Loading departments...</div>
      ) : departments.length === 0 ? (
        <div className="departments-empty">No departments found. Add your first department to get started.</div>
      ) : (
        <div className="departments-panel">
          <div className="department-table-wrap">
            <table className="table department-table align-middle">
              <thead>
                <tr>
                  <th>Department Name</th>
                  <th>Department Code</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((department) => (
                  <tr key={department.id}>
                    <td className="department-name">{department.name}</td>
                    <td>
                      <span className="department-code">{department.code}</span>
                    </td>
                    <td className="department-description">{department.description || '—'}</td>
                    <td>
                      <div className="department-actions">
                        <button
                          type="button"
                          className="btn department-action-btn"
                          onClick={() => {
                            setEditingDepartment(department);
                            setShowForm(true);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn department-action-btn delete"
                          onClick={() => handleDelete(department)}
                          disabled={deletingId === department.id}
                        >
                          {deletingId === department.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

export default Departments;
