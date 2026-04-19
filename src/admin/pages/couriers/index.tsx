import { useEffect, useState } from 'react';
import CourierDrawer from '../../components/CourierDrawer';
import axios from 'axios';
import { useForm } from 'react-hook-form';

interface Courier {
  _id?: string;
  CourierId: number;
  Courier: string;
  Description?: string; // Make Description optional
  Track?: string; // Make Track optional
  Mode?: number; // Optional, will be set to default
  Status?: number; // Optional, will be set to default
}

const CouriersPage = () => {
  const [allCouriers, setAllCouriers] = useState<Courier[]>([]); // Store original data
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [editingCourier, setEditingCourier] = useState<Courier | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit, reset, setValue } = useForm<Courier>();
  const [nextCourierId, setNextCourierId] = useState<number>(1); // State for the next Courier ID
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCouriers();
  }, []);

  const fetchCouriers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/couriers');
      const fetchedCouriers = response.data.couriers;
      setAllCouriers(fetchedCouriers); // Store all couriers
      setCouriers(fetchedCouriers); // Set initial filtered state

      // Calculate the next Courier ID
      const maxCourierId = Math.max(...fetchedCouriers.map((c: Courier) => c.CourierId), 0);
      setNextCourierId(maxCourierId + 1); // Set next Courier ID
    } catch (error) {
      console.error('Error fetching couriers:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    const toast = document.getElementById('toast') as HTMLDivElement;
    if (toast) {
      toast.innerHTML = `
        <div class="alert ${type === 'success' ? 'alert-success' : 'alert-error'}">
          <span>${message}</span>
        </div>
      `;
      toast.style.display = 'block';
      setTimeout(() => {
        toast.style.display = 'none';
      }, 3000);
    }
  };

  const getModeDisplay = (mode: number | null | undefined): string => {
    if (mode === 2) return 'link';
    if (mode === 3) return 'api';
    return 'internal'; // Default for 0, null, undefined, not exists, 1
  };

  const onSubmit = async (data: Courier) => {
    setError(null); // Reset error state
    const courierData = {
      ...data,
      CourierId: editingCourier ? editingCourier.CourierId : nextCourierId,
      Mode: Number(data.Mode) || 1, // Ensure Mode is a number and default to 1 if not provided
      Status: 1
    };

    const action = editingCourier ? 'update' : 'add';
    const confirmMessage = `Are you sure you want to ${action} this courier?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      if (editingCourier) {
        await axios.put(`/api/couriers/${editingCourier._id}`, courierData);
        showToast('Courier updated successfully!', 'success');
      } else {
        await axios.post('/api/couriers/add', courierData);
        showToast('Courier added successfully!', 'success');
      }
      
      setIsDrawerOpen(false); // Close drawer on success
      reset(); // Clear the form fields after submission
      setEditingCourier(null); // Reset editing state
      fetchCouriers();
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || `An error occurred while ${action}ing the courier`;
      setError(errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  const handleEdit = (courier: Courier) => {
    setEditingCourier(courier);
    reset(courier); // Populate the form with the courier data for editing
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirmMessage = 'Are you sure you want to delete this courier?';
    if (!window.confirm(confirmMessage)) {
      return; // Exit if the user cancels
    }

    try {
      await axios.delete(`/api/couriers/${id}`);
      showToast('Courier deleted successfully!', 'success');
      fetchCouriers();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred while deleting the courier';
      showToast(errorMessage, 'error');
    }
  };

  const handleClear = () => {
    reset(); // Clear the form fields
    setValue('Courier', '');
    setValue('Description', '');
    setValue('Track', '');
    setEditingCourier(null); // Reset editing state to switch to Add view
    setIsDrawerOpen(false);
  };

  const handleSearch = (searchText: string) => {
    const lowercaseSearch = searchText.toLowerCase();
    if (searchText === '') {
      setCouriers(allCouriers);
    } else {
      const filtered = allCouriers.filter(courier =>
        courier.Courier.toLowerCase().includes(lowercaseSearch) ||
        (courier.Description?.toLowerCase().includes(lowercaseSearch)) ||
        (courier.Track?.toLowerCase().includes(lowercaseSearch))
      );
      setCouriers(filtered);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Toast container at the top */}
      <div id="toast" className="fixed top-4 right-4 z-50" style={{ display: 'none' }}></div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
              <input 
                type="text" 
                className="input input-bordered" 
                placeholder="Search couriers..." 
                onChange={(e) => handleSearch(e.target.value)}
              />
              </div>
              <div className="text-sm text-gray-500">
              Showing {couriers.length} couriers
              </div>
            </div>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              setEditingCourier(null);
              reset();
              setIsDrawerOpen(true);
            }}
          >
            Add New Courier
          </button>
        </div>
      </div>

      <CourierDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={onSubmit}
        editingCourier={editingCourier}
      />

      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <table className="table table-zebra table-pin-rows table-pin-cols w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Track</th>
              <th>Mode</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {couriers.map((courier) => (
              <tr key={courier._id}>
                <td>{courier.CourierId}</td>
                <td>{courier.Courier}</td>
                <td>{courier.Description || 'N/A'}</td>
                <td>{courier.Track || 'N/A'}</td>
                <td>{getModeDisplay(courier.Mode)}</td>
                <td className="flex space-x-2">
                  <button className="btn btn-outline btn-sm btn-primary" onClick={() => handleEdit(courier)}>Edit</button>
                  <button className="btn btn-outline btn-sm btn-error" onClick={() => handleDelete(courier._id + '')}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CouriersPage;
