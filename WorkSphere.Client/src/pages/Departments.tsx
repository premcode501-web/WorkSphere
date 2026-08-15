import React, { useEffect, useState } from 'react';
import DepartmentForm from '../components/departments/DepartmentForm';
import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
} from '../services/departmentService';
import type { Department, DepartmentCreateRequest, DepartmentUpdateRequest } from '../types';
import './Departments.css';

const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadDepartments = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load departments';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDepartments();
  }, []);

  const handleSubmit = async (payload: DepartmentCreateRequest | DepartmentUpdateRequest) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingDepartment) {
        await updateDepartment(editingDepartment.id, payload as DepartmentUpdateRequest);
      } else {
        await createDepartment(payload as DepartmentCreateRequest);
      }

      setShowForm(false);
      setEditingDepartment(null);
      await loadDepartments();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to save department';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (department: Department) => {
    const confirmed = window.confirm(`Are you sure you want to delete the ${department.name} department?`);
    if (!confirmed) {
      return;
    }

    setDeletingId(department.id);
    setError(null);

    try {
      await deleteDepartment(department.id);
      await loadDepartments();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to delete department';
      setError(message);
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
