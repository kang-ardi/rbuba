import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import PageHeader from "../../components/common/PageHeader";
import PageLoader from "../../components/common/PageLoader";
import UserFormModal from "../../components/users/UserFormModal";
import useAuth from "../../hooks/useAuth";
import { userService } from "../../services";
import {
  canManageRole,
  getRoleLabel,
} from "../../constants/roles";

const PAGE_SIZE = 10;

export default function UserList() {
  const { user: activeUser, profile } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState({
    show: false,
    mode: "create",
    user: null,
  });

  const loadUsers = async () => {
    setLoading(true);

    try {
      const result = await userService.list();
      setUsers(result);
    } catch (error) {
      toast.error(error.message || "Gagal memuat user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return users
      .filter((item) => item.uid !== activeUser?.uid)
      .filter((item) => {
        if (!keyword) return true;

        return [
          item.name,
          item.username,
          item.email,
          item.role,
        ].some((value) =>
          String(value || "").toLowerCase().includes(keyword)
        );
      });
  }, [activeUser?.uid, search, users]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / PAGE_SIZE)
  );

  const pagedUsers = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const closeModal = () => {
    if (saving) return;

    setModal({
      show: false,
      mode: "create",
      user: null,
    });
  };

  const openCreateModal = () => {
    setModal({
      show: true,
      mode: "create",
      user: null,
    });
  };

  const openEditModal = (selectedUser) => {
    setModal({
      show: true,
      mode: "edit",
      user: selectedUser,
    });
  };

  const isSuperadmin = profile?.role === "superadmin";

  const handleSubmit = async (form) => {
    setSaving(true);

    try {
      if (modal.mode === "create") {
        await userService.create(form);
        toast.success("User berhasil dibuat.");
      } else {
        await userService.update(
          modal.user.uid,
          {
            name: form.name,
            role: isSuperadmin ? form.role : undefined,
          }
        );

        if (modal.user.active !== form.active) {
          await userService.updateStatus(modal.user, form.active);
        }

        if (isSuperadmin && form.password?.trim()) {
          await userService.updatePassword(
            modal.user.uid,
            form.password.trim()
          );
        }

        toast.success("User berhasil diperbarui.");
      }

      setModal({
        show: false,
        mode: "create",
        user: null,
      });
      await loadUsers();
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan user.");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (selectedUser, active) => {
    const previousUsers = users;

    setUsers((currentUsers) =>
      currentUsers.map((item) =>
        item.uid === selectedUser.uid
          ? { ...item, active }
          : item
      )
    );

    try {
      await userService.updateStatus(selectedUser, active);
      toast.success("Status user berhasil diperbarui.");
      await loadUsers();
    } catch (error) {
      setUsers(previousUsers);
      toast.error(error.message || "Gagal mengubah status user.");
    }
  };

  return (
    <>
      <div className="d-flex flex-column flex-md-row gap-3 justify-content-between align-items-md-center mb-4">
        <PageHeader
          title="User"
          subtitle="Kelola akun pengguna dan akses sistem."
        />

        <button
          type="button"
          className="btn btn-primary"
          onClick={openCreateModal}
        >
          Create User
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body user-list-card">
          <div className="row g-3 align-items-center mb-3">
            <div className="col-12 col-md-6 col-lg-4">
              <input
                className="form-control"
                placeholder="Search nama, username, email, role..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="col text-md-end text-muted small">
              {filteredUsers.length} user ditemukan
            </div>
          </div>

          {loading ? (
            <div className="py-5 text-center">
              <PageLoader message="Memuat user..." />
            </div>
          ) : (
            <>
              <div className="table-responsive d-none d-md-block">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th className="text-end">Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pagedUsers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-5">
                          Tidak ada user yang cocok.
                        </td>
                      </tr>
                    ) : (
                      pagedUsers.map((item) => {
                        const editable = canManageRole(
                          profile?.role,
                          item.role
                        );

                        return (
                          <tr key={item.uid}>
                            <td className="fw-semibold">
                              {item.name || "-"}
                            </td>
                            <td>{item.username || "-"}</td>
                            <td>{item.email || "-"}</td>
                            <td>
                              <span className="badge text-bg-light border">
                                {getRoleLabel(item.role)}
                              </span>
                            </td>
                            <td>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={item.active === true}
                                  disabled={!editable}
                                  aria-label={`Status ${item.name}`}
                                  onChange={(event) =>
                                    handleStatusChange(
                                      item,
                                      event.target.checked
                                    )
                                  }
                                />
                              </div>
                            </td>
                            <td className="text-end">
                              {editable && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => openEditModal(item)}
                                >
                                  Edit
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="d-md-none d-grid gap-3">
                {pagedUsers.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    Tidak ada user yang cocok.
                  </div>
                ) : (
                  pagedUsers.map((item) => {
                    const editable = canManageRole(
                      profile?.role,
                      item.role
                    );

                    return (
                      <div
                        key={item.uid}
                        className="border rounded p-3 bg-white"
                      >
                        <div className="d-flex justify-content-between gap-3 mb-2">
                          <div className="min-w-0">
                            <div className="fw-semibold text-truncate">
                              {item.name || "-"}
                            </div>
                            <div className="small text-muted text-break">
                              {item.email || "-"}
                            </div>
                          </div>

                          <span className="badge text-bg-light border align-self-start">
                            {getRoleLabel(item.role)}
                          </span>
                        </div>

                        <div className="small text-muted mb-3 text-break">
                          Username: {item.username || "-"}
                        </div>

                        <div className="d-flex align-items-center justify-content-between gap-3">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={item.active === true}
                              disabled={!editable}
                              aria-label={`Status ${item.name}`}
                              onChange={(event) =>
                                handleStatusChange(
                                  item,
                                  event.target.checked
                                )
                              }
                            />
                            <label className="form-check-label small">
                              {item.active ? "Aktif" : "Nonaktif"}
                            </label>
                          </div>

                          {editable && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => openEditModal(item)}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="user-list-pagination d-flex flex-column flex-md-row gap-2 justify-content-between align-items-md-center mt-3">
                <div className="text-muted small">
                  Halaman {page} dari {totalPages}
                </div>

                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    disabled={page === 1}
                    onClick={() => setPage((value) => value - 1)}
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((value) => value + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <UserFormModal
        show={modal.show}
        mode={modal.mode}
        user={modal.user}
        currentRole={profile?.role}
        canEditRole={isSuperadmin}
        canEditPassword={isSuperadmin}
        loading={saving}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}
