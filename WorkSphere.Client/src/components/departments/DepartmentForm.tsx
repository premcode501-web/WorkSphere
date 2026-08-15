import React, { useEffect, useState } from 'react';
import type {
  Department,
  DepartmentCreateRequest,
  DepartmentUpdateRequest,
} from '../../types';
import './DepartmentForm.css';

interface DepartmentFormValues {
  name: string;
  code: string;
  description: string;
}

interface DepartmentFormProps {
  initialValues?: Partial<Department>;
  submitLabel?: string;
  isSubmitting?: boolean;
  onSubmit: (
    payload: DepartmentCreateRequest | DepartmentUpdateRequest
  ) => void | Promise<void>;
  onCancel?: () => void;
}

const EMPTY_VALUES: DepartmentFormValues = {
  name: '',
  code: '',
  description: '',
};

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  initialValues,
  submitLabel = 'Save Department',
  isSubmitting = false,
  onSubmit,
  onCancel,
}) => {
  const [values, setValues] = useState<DepartmentFormValues>({
    ...EMPTY_VALUES,
    ...(initialValues ?? {}),
    description: initialValues?.description ?? '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof DepartmentFormValues, string>>
  >({});

  useEffect(() => {
    setValues({
      ...EMPTY_VALUES,
      ...(initialValues ?? {}),
      description: initialValues?.description ?? '',
    });

    setErrors({});
  }, [initialValues]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setValues((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  };

  const validate = () => {
    const nextErrors: Partial<
      Record<keyof DepartmentFormValues, string>
    > = {};

    if (!values.name.trim()) {
      nextErrors.name = 'Department name is required.';
    } else if (values.name.trim().length > 100) {
      nextErrors.name =
        'Department name must be 100 characters or less.';
    }

    if (!values.code.trim()) {
      nextErrors.code = 'Department code is required.';
    } else if (values.code.trim().length > 50) {
      nextErrors.code =
        'Department code must be 50 characters or less.';
    }

    if (values.description.trim().length > 500) {
      nextErrors.description =
        'Description must be 500 characters or less.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const payload:
      | DepartmentCreateRequest
      | DepartmentUpdateRequest = {
      name: values.name.trim(),
      code: values.code.trim(),
      description: values.description.trim() || undefined,
    };

    await onSubmit(payload);
  };

  return (
    <div className="department-form-card">
      <div className="department-form-header">
        <div>
          <h3>
            {initialValues?.id
              ? 'Edit Department'
              : 'Create Department'}
          </h3>

          <p>
            {initialValues?.id
              ? 'Update department information'
              : 'Add a new department to WorkSphere'}
          </p>
        </div>
      </div>

      <form
        className="department-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="department-form-grid">

          {/* Department Name */}
          <div className="department-form-group">
            <label htmlFor="department-name">
              Department Name *
            </label>

            <input
              id="department-name"
              name="name"
              type="text"
              value={values.name}
              onChange={handleChange}
              maxLength={100}
              placeholder="e.g. Engineering"
            />

            {errors.name && (
              <span className="department-form-error">
                {errors.name}
              </span>
            )}
          </div>

          {/* Department Code */}
          <div className="department-form-group">
            <label htmlFor="department-code">
              Department Code *
            </label>

            <input
              id="department-code"
              name="code"
              type="text"
              value={values.code}
              onChange={handleChange}
              maxLength={50}
              placeholder="e.g. ENG"
            />

            {errors.code && (
              <span className="department-form-error">
                {errors.code}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="department-form-group full-width">
            <label htmlFor="department-description">
              Description
            </label>

            <textarea
              id="department-description"
              name="description"
              value={values.description}
              onChange={handleChange}
              maxLength={500}
              rows={4}
              placeholder="Optional department overview"
            />

            <div className="department-description-footer">
              {errors.description ? (
                <span className="department-form-error">
                  {errors.description}
                </span>
              ) : (
                <span />
              )}

              <span className="department-character-count">
                {values.description.length}/500
              </span>
            </div>
          </div>

        </div>

        {/* Actions */}
        <div className="department-form-actions">
          {onCancel && (
            <button
              type="button"
              className="department-form-cancel"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="department-form-submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Saving...'
              : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentForm;