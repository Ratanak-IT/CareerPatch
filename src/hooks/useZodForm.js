
import { useState, useCallback } from "react";

export function useZodForm(schema, initialValues) {
  const [values, setValues]   = useState(initialValues);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  /** Update a single field value */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    setErrors(prev => ({ ...prev, [name]: undefined }));
  }, []);

  /** Mark field as touched on blur and validate that field */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    // Validate single field
    const result = schema.safeParse(values);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name]?.[0] }));
    }
  }, [schema, values]);

  /**
   * Validate all fields.
   * Returns { success: true, data } or { success: false }.
   */
  const validate = useCallback(() => {
    const result = schema.safeParse(values);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const flat = Object.fromEntries(
        Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0]])
      );
      setErrors(flat);
      // Touch all fields so errors show
      const allTouched = Object.fromEntries(Object.keys(values).map(k => [k, true]));
      setTouched(allTouched);
      return { success: false };
    }
    setErrors({});
    return { success: true, data: result.data };
  }, [schema, values]);

  /** Reset to initial state */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  /** Get props for a single field (spread onto <input> / <select>) */
  const field = useCallback((name) => ({
    name,
    value: values[name] ?? "",
    onChange: handleChange,
    onBlur: handleBlur,
    error: touched[name] ? errors[name] : undefined,
  }), [values, errors, touched, handleChange, handleBlur]);

  return { values, errors, touched, handleChange, handleBlur, validate, reset, field, setValues };
}