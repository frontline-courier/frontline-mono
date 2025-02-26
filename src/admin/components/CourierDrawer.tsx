import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

interface Courier {
  _id?: string;
  CourierId: number;
  Courier: string;
  Description?: string;
  Track?: string;
  Mode?: number;
  Status?: number;
}

interface CourierDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Courier) => void;
  editingCourier: Courier | null;
  error?: string | null;
}

const CourierDrawer = ({ isOpen, onClose, onSubmit, editingCourier, error }: CourierDrawerProps) => {
  const { register, handleSubmit, reset } = useForm<Courier>();

  // Update form when editingCourier changes
  useEffect(() => {
    if (editingCourier) {
      reset(editingCourier);
    } else {
      reset({
        Courier: '',
        Description: '',
        Track: ''
      });
    }
  }, [editingCourier, reset]);

  const handleClear = () => {
    reset();
    onClose();
  };

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="drawer drawer-end z-50">
      <input 
        type="checkbox" 
        id="courier-drawer" 
        className="drawer-toggle" 
        checked={isOpen}
        onChange={onClose}
      />
      
      <div className="drawer-side">
        <label htmlFor="courier-drawer" className="drawer-overlay"></label>
        <div className="menu p-4 w-96 min-h-full bg-base-200 text-base-content">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">{editingCourier ? 'Edit' : 'Add'} Courier</h3>
            <button className="btn btn-square btn-sm" onClick={handleClear}>×</button>
          </div>
          
          {error && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Courier Name</label>
              <input 
                className="input input-bordered w-full" 
                type="text" 
                placeholder="Courier Name" 
                {...register('Courier', { required: true })} 
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <input 
                className="input input-bordered w-full" 
                type="text" 
                placeholder="Description" 
                {...register('Description')} 
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tracking URL</label>
              <input 
                className="input input-bordered w-full" 
                type="text" 
                placeholder="Tracking URL" 
                {...register('Track')} 
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button type="button" className="btn btn-outline" onClick={handleClear}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingCourier ? 'Update' : 'Add'} Courier
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourierDrawer;
