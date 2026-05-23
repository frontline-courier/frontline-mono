import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { Alert } from './ui/alert';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from './ui/sheet';

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
        Track: '',
        Mode: 1 // Set default Mode when adding new courier
      });
    }
  }, [editingCourier, reset]);

  const handleClear = useCallback(() => {
    reset({
      Courier: '',
      Description: '',
      Track: '',
      Mode: 1 // Set default Mode when clearing form
    });
    onClose();
  }, [onClose, reset]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [handleClear]);

  return (
    <Sheet open={isOpen} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{editingCourier ? 'Edit' : 'Add'} Courier</SheetTitle>
        </SheetHeader>

        <div className="px-6 pb-6 pt-4 text-slate-700">
          {error && <Alert variant="error" className="mb-4">{error}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Courier Name</label>
              <Input type="text" placeholder="Courier Name" {...register('Courier', { required: true })} />
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Description</label>
              <Input type="text" placeholder="Description" {...register('Description')} />
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Tracking URL</label>
              <Input type="text" placeholder="Tracking URL" {...register('Track')} />
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Mode</label>
              <Select {...register('Mode')} defaultValue={1}>
                <option value={1}>Internal</option>
                <option value={2}>Link</option>
                <option value={3}>API</option>
              </Select>
            </div>

            <SheetFooter className="px-0 pb-0">
              <Button type="button" variant="outline" onClick={handleClear}>
                Cancel
              </Button>
              <Button type="submit">
                {editingCourier ? 'Update' : 'Add'} Courier
              </Button>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CourierDrawer;
