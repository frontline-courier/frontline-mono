import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useForm, SubmitHandler } from 'react-hook-form';

function AddStockEntry() {

  const { register, handleSubmit, watch, formState, reset, resetField } = useForm({
    mode: 'onChange',
  });
  const errors = formState.errors;

  const onSubmit: SubmitHandler<any> = async (data: any) => { }

  return <>
    <div className="flex justify-between m-4">
      <div>
        <h2 className="text-2xl font-semibold">Add Courier</h2>
      </div>
      <div>
        <button className="btn btn-secondary mr-2">Add Courier</button>
        <button className="btn btn-secondary">Add Stock</button>
      </div>
    </div>

    <div className="m-4">
      <form onSubmit={handleSubmit(onSubmit)} className="m-4 p-4 w-full lg:w-2/3">
      </form>
    </div>
  </>
}


export default withPageAuthRequired(AddStockEntry);
