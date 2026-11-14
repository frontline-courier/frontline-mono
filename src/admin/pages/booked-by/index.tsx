import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import axios from 'axios';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { HiBan, HiCheckCircle, HiPencil, HiPlus, HiSearch, HiTrash } from 'react-icons/hi';

type BookedByUser = {
  _id: string;
  name: string;
  isActive: boolean;
};

function getApiError(error: any, fallback: string) {
  return error?.response?.data?.error || error?.response?.data?.message || fallback;
}

function BookedByUsersPage() {
  const [users, setUsers] = useState<BookedByUser[]>([]);
  const [name, setName] = useState('');
  const [editingUser, setEditingUser] = useState<BookedByUser | null>(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/booked-by?includeInactive=true');
      setUsers(
        (response.data.bookedByUsers || []).map((user: BookedByUser) => ({
          ...user,
          isActive: user.isActive !== false,
        })),
      );
    } catch (err) {
      setError(getApiError(err, 'Failed to load Booked By users'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => user.name.toLowerCase().includes(query));
  }, [searchText, users]);

  const resetForm = () => {
    setName('');
    setEditingUser(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Name is required.');
      return;
    }

    const action = editingUser ? 'update' : 'add';
    if (!window.confirm(`Are you sure you want to ${action} this Booked By user?`)) return;

    setSaving(true);
    setError(null);

    try {
      if (editingUser) {
        await axios.put(`/api/booked-by/${editingUser._id}`, { name: trimmedName });
      } else {
        await axios.post('/api/booked-by/add', { name: trimmedName });
      }

      resetForm();
      await fetchUsers();
    } catch (err) {
      setError(getApiError(err, 'Failed to save Booked By user'));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (user: BookedByUser) => {
    setEditingUser(user);
    setName(user.name);
    setError(null);
  };

  const handleToggleActive = async (user: BookedByUser) => {
    const nextIsActive = !user.isActive;
    const action = nextIsActive ? 'activate' : 'deactivate';

    if (!window.confirm(`Are you sure you want to ${action} "${user.name}"?`)) return;

    setError(null);

    try {
      await axios.put(`/api/booked-by/${user._id}`, { isActive: nextIsActive });
      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item._id === user._id ? { ...item, isActive: nextIsActive } : item,
        ),
      );
    } catch (err) {
      setError(getApiError(err, `Failed to ${action} Booked By user`));
    }
  };

  const handleDelete = async (user: BookedByUser) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${user.name}"? If this user is referenced by bookings, deactivate them instead.`,
      )
    )
      return;

    setError(null);

    try {
      await axios.delete(`/api/booked-by/${user._id}`);
      setUsers((currentUsers) => currentUsers.filter((item) => item._id !== user._id));

      if (editingUser?._id === user._id) {
        resetForm();
      }
    } catch (err) {
      setError(getApiError(err, 'Failed to delete Booked By user'));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <div className="card h-fit border border-slate-200 bg-white shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-base">
              {editingUser ? 'Edit Booked By user' : 'Add Booked By user'}
            </h2>
            <p className="text-sm text-slate-500">
              These names populate the Booked By dropdown in the booking form. Inactive users stay
              on existing bookings but are hidden from new bookings.
            </p>

            <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-3">
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={saving}
              />
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  <HiPlus className="h-4 w-4" />
                  {editingUser ? 'Save changes' : 'Add user'}
                </button>
                {editingUser ? (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={resetForm}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        </div>

        <div className="card border border-slate-200 bg-white shadow-sm">
          <div className="card-body">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold">Booked By users</h2>
              <label className="input input-bordered input-sm flex items-center gap-2">
                <HiSearch className="h-4 w-4 text-slate-400" />
                <input
                  type="search"
                  className="grow"
                  placeholder="Search names..."
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                />
              </label>
            </div>

            {error ? (
              <div className="alert alert-error mt-3">
                <span>{error}</span>
              </div>
            ) : null}

            {loading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-md"></span>
              </div>
            ) : (
              <div className="mt-3 overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                      <th className="w-64">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className={user.isActive ? undefined : 'opacity-60'}>
                        <td>{user.name}</td>
                        <td>
                          <span
                            className={`badge ${user.isActive ? 'badge-success' : 'badge-ghost'}`}
                          >
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="btn btn-outline btn-primary btn-xs"
                            onClick={() => handleEdit(user)}
                          >
                            <HiPencil className="h-3 w-3" />
                            Edit
                          </button>
                          <button
                            type="button"
                            className={`btn btn-outline btn-xs ${user.isActive ? 'btn-warning' : 'btn-success'}`}
                            onClick={() => handleToggleActive(user)}
                          >
                            {user.isActive ? (
                              <HiBan className="h-3 w-3" />
                            ) : (
                              <HiCheckCircle className="h-3 w-3" />
                            )}
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline btn-error btn-xs"
                            onClick={() => handleDelete(user)}
                          >
                            <HiTrash className="h-3 w-3" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center text-slate-500">
                          No Booked By users found.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withPageAuthRequired(BookedByUsersPage);
