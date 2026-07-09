import { useEffect, useMemo, useState } from "react";

import {
  getManageableRoles,
  getRoleLabel,
  ROLE_OPTIONS,
} from "../../constants/roles";

const defaultForm = {
  username: "",
  name: "",
  email: "",
  password: "",
  role: "",
  active: true,
};

export default function UserFormModal({
  show,
  mode,
  user,
  currentRole,
  canEditRole,
  canEditPassword,
  loading,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(defaultForm);

  const isEdit = mode === "edit";

  const roleOptions = useMemo(() => {
    if (currentRole === "superadmin") {
      return ROLE_OPTIONS;
    }

    return getManageableRoles(currentRole);
  }, [currentRole]);

  useEffect(() => {
    if (!show) return;

    if (isEdit && user) {
      setForm({
        username: user.username || "",
        name: user.name || "",
        email: user.email || "",
        password: "",
        role: user.role || "",
        active: user.active === true,
      });
      return;
    }

    setForm({
      ...defaultForm,
      role:
        currentRole === "superadmin"
          ? roleOptions[0]?.value || ""
          : "siswa",
    });
  }, [currentRole, isEdit, roleOptions, show, user]);

  if (!show) {
    return null;
  }

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <form className="modal-content" onSubmit={handleSubmit}>
            <div className="modal-header">
              <div>
                <h5 className="modal-title">
                  {isEdit ? "Edit User" : "Create User"}
                </h5>
                {isEdit && (
                  <small className="text-muted">
                    {user?.email}
                  </small>
                )}
              </div>

              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                disabled={loading}
                onClick={onClose}
              />
            </div>

            <div className="modal-body">
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">
                    Username
                  </label>
                  <input
                    className="form-control"
                    name="username"
                    value={form.username}
                    disabled={isEdit || loading}
                    required={!isEdit}
                    minLength={3}
                    maxLength={50}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">
                    Email
                  </label>
                  <input
                    className="form-control"
                    name="email"
                    type="email"
                    value={form.email}
                    disabled={isEdit || loading}
                    required={!isEdit}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">
                    Nama
                  </label>
                  <input
                    className="form-control"
                    name="name"
                    value={form.name}
                    disabled={loading}
                    required
                    maxLength={100}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">
                    Role
                  </label>
                  <select
                    className="form-select"
                    name="role"
                    value={form.role}
                    disabled={loading || !canEditRole}
                    required
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Pilih role
                    </option>
                    {roleOptions.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">
                    Password
                  </label>
                  <input
                    className="form-control"
                    name="password"
                    type="password"
                    value={form.password}
                    disabled={loading || (isEdit && !canEditPassword)}
                    required={!isEdit}
                    minLength={6}
                    onChange={handleChange}
                  />
                  {isEdit && canEditPassword && (
                    <div className="form-text">
                      Kosongkan jika password tidak ingin diubah.
                    </div>
                  )}
                  {isEdit && !canEditPassword && (
                    <div className="form-text">
                      Hanya superadmin yang bisa mengubah password user lain.
                    </div>
                  )}
                </div>

                <div className="col-12 col-md-6 d-flex align-items-end">
                  <div className="form-check form-switch mb-2">
                    <input
                      className="form-check-input"
                      id="user-modal-active"
                      name="active"
                      type="checkbox"
                      checked={form.active}
                      disabled={loading}
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="user-modal-active"
                    >
                      User aktif
                    </label>
                  </div>
                </div>
              </div>

              {isEdit && user?.role && (
                <div className="alert alert-light border mt-4 mb-0">
                  Role saat ini: <strong>{getRoleLabel(user.role)}</strong>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light"
                disabled={loading}
                onClick={onClose}
              >
                Batal
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}
