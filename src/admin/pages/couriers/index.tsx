import { useEffect, useState } from 'react';
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
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [editingCourier, setEditingCourier] = useState<Courier | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit, reset, setValue } = useForm<Courier>();
  const [nextCourierId, setNextCourierId] = useState<number>(1); // State for the next Courier ID

  useEffect(() => {
    fetchCouriers();
  }, []);

  const fetchCouriers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/couriers');
      const fetchedCouriers = response.data.couriers;
      setCouriers(fetchedCouriers);

      // Calculate the next Courier ID
      const maxCourierId = Math.max(...fetchedCouriers.map((c: Courier) => c.CourierId), 0);
      setNextCourierId(maxCourierId + 1); // Set next Courier ID
    } catch (error) {
      console.error('Error fetching couriers:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: Courier) => {
    const courierData = {
      ...data,
      CourierId: nextCourierId, // Use the calculated next Courier ID
      Mode: 0, // Default Mode
      Status: 1 // Default Status
    };

    const action = editingCourier ? 'update' : 'add';
    const confirmMessage = `Are you sure you want to ${action} this courier?`;
    if (!window.confirm(confirmMessage)) {
      return; // Exit if the user cancels
    }

    try {
      if (editingCourier) {
        await axios.put(`/api/couriers/${editingCourier._id}`, courierData);
      } else {
        await axios.post('/api/couriers/add', courierData);
      }
      reset(); // Clear the form fields after submission
      setEditingCourier(null); // Reset editing state
      fetchCouriers();
    } catch (error) {
      console.error('Error saving courier:', error);
    }
  };

  const handleEdit = (courier: Courier) => {
    setEditingCourier(courier);
    reset(courier); // Populate the form with the courier data for editing
  };

  const handleDelete = async (id: string) => {
    const confirmMessage = 'Are you sure you want to delete this courier?';
    if (!window.confirm(confirmMessage)) {
      return; // Exit if the user cancels
    }

    try {
      await axios.delete(`/api/couriers/${id}`);
      fetchCouriers();
    } catch (error) {
      console.error('Error deleting courier:', error);
    }
  };

  const handleClear = () => {
    reset(); // Clear the form fields
    setValue('Courier', '');
    setValue('Description', '');
    setValue('Track', '');
    setEditingCourier(null); // Reset editing state to switch to Add view
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Couriers</h2>
      <form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
        <input className="input input-bordered w-full mb-2" type="text" placeholder="Courier Name" {...register('Courier', { required: true })} />
        <input className="input input-bordered w-full mb-2" type="text" placeholder="Description" {...register('Description')} /> {/* Optional */}
        <input className="input input-bordered w-full mb-2" type="text" placeholder="Tracking URL" {...register('Track')} /> {/* Optional */}
        <button className="btn btn-primary mr-2" type="submit">{editingCourier ? 'Update' : 'Add'} Courier</button>
        {editingCourier && (
          <button type="button" className="btn btn-secondary" onClick={handleClear}>Clear</button>
        )}
      </form>

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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {couriers.map((courier) => (
              <tr key={courier._id}>
                <td>{courier.CourierId}</td>
                <td>{courier.Courier}</td>
                <td>{courier.Description || 'N/A'}</td> {/* Display 'N/A' if Description is not provided */}
                <td>{courier.Track || 'N/A'}</td> {/* Display 'N/A' if Track is not provided */}
                <td>
                  <button className="btn btn-outline btn-sm btn-primary m-2" onClick={() => handleEdit(courier)}>Edit</button>
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