import React, { useEffect, useState } from 'react';
import { withPageAuthRequired, useUser } from '@auth0/nextjs-auth0/client';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Courier } from '../../interfaces/volumetricForm';
import { CourierVolumetricMapping } from '../../interfaces/courierVolumetricMapping';

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Hardcoded volumetric formulas
const VOLUMETRIC_FORMULAS = [
  { id: 1, formula: 'L×B×H/4750', divisor: 4750 },
  { id: 2, formula: 'L×B×H/5000', divisor: 5000 },
  { id: 3, formula: 'L×B×H/3857', divisor: 3857 },
  { id: 4, formula: 'L×B×H/27000×8', divisor: 27000 },
  { id: 5, formula: 'L×B×H/3350', divisor: 3350 },
];

const CourierVolumetricMappingsPage = () => {
  const { user, error: userError, isLoading: isUserLoading } = useUser();
  const [courierList, setCourierList] = useState<Courier[]>([]);
  const [mappings, setMappings] = useState<CourierVolumetricMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, limit: 10, totalPages: 0 });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CourierVolumetricMapping>({
    defaultValues: {
      transportMode: 0 // Default value
    }
  });
  
  // Watch the transportMode field to auto-select formula
  const transportMode = watch('transportMode');

  const fetchMappings = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/courier-volumetric-mappings?page=${page}&limit=${limit}`);
      setMappings(response.data.mappings);
      setPagination(response.data.pagination);
      setLoading(false);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching mappings:', err);
      setError('Failed to load mappings. Please try again.');
      setLoading(false);
    }
  };

  // Fetch couriers and mappings from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch couriers
        const couriersResponse = await axios.get('/api/couriers');
        setCourierList(couriersResponse.data.couriers || []);
        
        // Fetch mappings with pagination
        await fetchMappings();
      } catch (error) {
        setError('Failed to load data');
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // No automatic formula selection

  const onSubmit: SubmitHandler<CourierVolumetricMapping> = async (data) => {
    try {
      setError(null);
      setSuccessMessage(null);
      
      // Ensure transportMode is a number
      const formData = {
        ...data,
        transportMode: Number(data.transportMode)
      };
      
      if (editingId) {
        // Update existing mapping via API
        await axios.put(`/api/courier-volumetric-mappings/${editingId}`, formData);
        setSuccessMessage('Mapping updated successfully');
        setEditingId(null);
      } else {
        // Create new mapping via API
        await axios.post('/api/courier-volumetric-mappings', formData);
        setSuccessMessage('Mapping added successfully');
      }

      // Refresh the mappings list
      await fetchMappings(pagination.page, pagination.limit);
      
      // Reset the form
      reset();
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setError(err.response?.data?.error || err.message || 'Failed to save mapping');
    }
  };

  const handleEdit = (mapping: CourierVolumetricMapping) => {
    // Use _id if available, otherwise fall back to id
    const mappingId = mapping._id || mapping.id || null;
    setEditingId(typeof mappingId === 'string' ? mappingId : mappingId?.toString() || null);
    setValue('courierId', mapping.courierId);
    setValue('transportMode', mapping.transportMode);
    setValue('formulaId', mapping.formulaId);
  };

  const handleDelete = async (id: string | number) => {
    try {
      setError(null);
      setSuccessMessage(null);

      // Delete mapping via API
      await axios.delete(`/api/courier-volumetric-mappings/${id}`);
      setSuccessMessage('Mapping deleted successfully');
      
      // Refresh the mappings list
      await fetchMappings(pagination.page, pagination.limit);
      
      if (editingId === id) {
        setEditingId(null);
        reset();
      }
    } catch (err: any) {
      console.error('Error deleting mapping:', err);
      setError(err.response?.data?.error || err.message || 'Failed to delete mapping');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    reset();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      fetchMappings(newPage, pagination.limit);
    }
  };

  if (isUserLoading || loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (userError || !user) {
    return <div className="alert alert-error m-4">Please log in to access this page.</div>;
  }

  return (
    <>
      <Head>
        <title>Courier Volumetric Mappings | Frontline Courier</title>
      </Head>
      <div className="flex flex-col">
        <div className="w-full">
          <div className="text-sm breadcrumbs px-6 py-3 bg-base-200">
            <ul>
              <li><Link href="/">Home</Link></li>
              <li>Courier Volumetric Mappings</li>
            </ul>
          </div>
          
          <div className="flex justify-between items-center px-6 py-3">
            <h1 className="text-2xl font-semibold">Courier Volumetric Mappings</h1>
          </div>

          <div className="divider m-0"></div>

          {error && (
            <div className="alert alert-error m-4">
              <div className="flex-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                </svg>
                <label>{error}</label>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success m-4">
              <div className="flex-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <label>{successMessage}</label>
              </div>
            </div>
          )}

          <div className="p-4">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{editingId ? 'Edit Mapping' : 'Add New Mapping'}</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="form-control w-full">
                      <label className="label justify-start">
                        <span className="label-text font-medium min-w-[120px]">Courier</span>
                      </label>
                      <select 
                        className={`select select-bordered w-full ${errors.courierId ? 'select-error' : ''}`}
                        {...register('courierId', { required: true, valueAsNumber: true })}
                      >
                        <option value="">Select Courier</option>
                        {courierList.map((courier) => (
                          <option key={courier.CourierId} value={courier.CourierId}>
                            {courier.Courier}
                          </option>
                        ))}
                      </select>
                      {errors.courierId && <span className="text-error text-sm mt-1">Courier is required</span>}
                    </div>

                    <div className="form-control w-full">
                      <label className="label justify-start">
                        <span className="label-text font-medium min-w-[120px]">Transport Mode</span>
                      </label>
                      <select 
                        className={`select select-bordered w-full ${errors.transportMode ? 'select-error' : ''}`}
                        {...register('transportMode', { required: true, valueAsNumber: true })}
                      >
                        <option disabled={true} value={0}>-- transport mode --</option>
                        <option value={4}>Sea Cargo</option>
                        <option value={6}>Surface Courier</option>
                        <option value={8}>Road Cargo</option>
                      </select>
                      {errors.transportMode && <span className="text-error text-sm mt-1">Transport Mode is required</span>}
                    </div>

                    <div className="form-control w-full">
                      <label className="label justify-start">
                        <span className="label-text font-medium min-w-[120px]">Volumetric Formula</span>
                      </label>
                      <select 
                        className={`select select-bordered w-full ${errors.formulaId ? 'select-error' : ''}`}
                        {...register('formulaId', { required: true, valueAsNumber: true })}
                        // No formula is automatically selected
                      >
                        <option value="">Select Formula</option>
                        {VOLUMETRIC_FORMULAS.map((formula: { id: number, formula: string, divisor: number }) => (
                          <option key={formula.id} value={formula.id}>
                            {formula.formula} (Divisor: {formula.divisor})
                          </option>
                        ))}
                      </select>
                      {errors.formulaId && <span className="text-error text-sm mt-1">Formula is required</span>}
                    </div>
                  </div>

                  <div className="card-actions justify-end">
                    {editingId && (
                      <button 
                        type="button" 
                        className="btn btn-ghost"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    )}
                    <button type="submit" className="btn btn-primary">
                      {editingId ? 'Update' : 'Save'} Mapping
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="divider"></div>

            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Courier</th>
                    <th>Transport Mode</th>
                    <th>Volumetric Formula</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mappings.map((mapping) => {
                    const courier = courierList.find(c => c.CourierId === mapping.courierId);
                    const formula = VOLUMETRIC_FORMULAS.find((f: { id: number }) => f.id === mapping.formulaId);
                    return (
                      <tr key={mapping.id} className={editingId === mapping.id ? 'bg-base-200' : ''}>
                        <td>{courier?.Courier || mapping.courierName || 'Unknown'}</td>
                        <td>
                          {mapping.transportMode === 4 ? 'Sea Cargo' :
                           mapping.transportMode === 6 ? 'Surface Courier' :
                           mapping.transportMode === 8 ? 'Road Cargo' :
                           'Unknown'}
                        </td>
                        <td className="font-mono">{formula?.formula || mapping.formulaName || 'Unknown'}</td>
                        <td>{mapping.updatedAt ? new Date(mapping.updatedAt).toLocaleString() : 'N/A'}</td>
                        <td>
                          <div className="flex space-x-2">
                            <button
                              className="btn btn-info btn-sm"
                              onClick={() => handleEdit(mapping)}
                              disabled={editingId !== null}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-error btn-sm"
                              onClick={() => {
                                // Use _id if available, otherwise fall back to id
                                const mappingId = mapping._id || mapping.id;
                                if (mappingId) handleDelete(mappingId);
                              }}
                              disabled={editingId !== null}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {mappings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        No mappings found. Add one above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <div className="btn-group">
                    <button 
                      className="btn btn-sm" 
                      onClick={() => handlePageChange(1)}
                      disabled={pagination.page === 1}
                    >
                      «
                    </button>
                    <button 
                      className="btn btn-sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      ‹
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(p => {
                        // Show current page, first, last, and pages around current
                        return p === 1 || 
                               p === pagination.totalPages || 
                               (p >= pagination.page - 1 && p <= pagination.page + 1);
                      })
                      .map((page, index, array) => {
                        // Add ellipsis
                        const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                        const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1;
                        
                        return (
                          <React.Fragment key={page}>
                            {showEllipsisBefore && <button className="btn btn-sm btn-disabled">...</button>}
                            <button 
                              className={`btn btn-sm ${pagination.page === page ? 'btn-active' : ''}`}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                            {showEllipsisAfter && <button className="btn btn-sm btn-disabled">...</button>}
                          </React.Fragment>
                        );
                      })}
                    
                    <button 
                      className="btn btn-sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      ›
                    </button>
                    <button 
                      className="btn btn-sm"
                      onClick={() => handlePageChange(pagination.totalPages)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      »
                    </button>
                  </div>
                </div>
              )}
              
              <div className="text-sm text-gray-500 mt-2 text-center">
                Showing {mappings.length} of {pagination.total} entries
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withPageAuthRequired(CourierVolumetricMappingsPage);
