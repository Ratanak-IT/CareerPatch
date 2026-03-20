import { useState, useCallback, useRef } from "react";

export function useZodForm(schema, initialValues) {
  const [values, setValues]   = useState(initialValues);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  const valuesRef = useRef(values);

  /** Update a single field value */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => {
      const next = { ...prev, [name]: value };
      valuesRef.current = next; // keep ref in sync
      return next;
    });
    // Clear error immediately when user changes the field
    setErrors(prev => ({ ...prev, [name]: undefined }));
  }, []);

  /** Mark field as touched on blur and validate using latest values */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    // ── Use valuesRef.current so we get the value AFTER onChange ──
    const result = schema.safeParse(valuesRef.current);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name]?.[0] }));
    } else {
      // Field is now valid — clear its error
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [schema]);

  /** Validate all fields on submit */
  const validate = useCallback(() => {
    const result = schema.safeParse(valuesRef.current);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const flat = Object.fromEntries(
        Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0]])
      );
      setErrors(flat);
      const allTouched = Object.fromEntries(
        Object.keys(valuesRef.current).map(k => [k, true])
      );
      setTouched(allTouched);
      return { success: false };
    }
    setErrors({});
    return { success: true, data: result.data };
  }, [schema]);

  /** Reset to initial state */
  const reset = useCallback(() => {
    setValues(initialValues);
    valuesRef.current = initialValues;
    setErrors({});
    setTouched({});
  }, [initialValues]);

  /** Get props for a single field */
  const field = useCallback((name) => ({
    name,
    value: values[name] ?? "",
    onChange: handleChange,
    onBlur: handleBlur,
    error: touched[name] ? errors[name] : undefined,
  }), [values, errors, touched, handleChange, handleBlur]);

  return { values, errors, touched, handleChange, handleBlur, validate, reset, field, setValues };
}