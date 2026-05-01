import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

function AddCourierForStockEntry(props: any) {

  const { register, handleSubmit, watch, formState, reset, resetField } = useForm({
    mode: 'onChange',
  });
  const errors = formState.errors;
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [saveError, setError] = useState('');

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    setLoader(true);

    try {
      const addResponse = await axios.post('/api/stocks/coloader/add',
        { coloader: data.coloader },
      );

      await addResponse.data;
      router.reload();
    } catch (e: any) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoader(false);
    }
  }

  return <>
    <div className="m-4 p-4 w-2/3 lg:w-1/2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control">
          <label className="label p-1">
            <span className="label-text text-2xs">Co-Loader Name</span>
          </label>
          <input type="text" placeholder="Co-Loader Name" className={`input input-bordered ${errors.coloader && 'input-error'}`} {...register('coloader', { required: true, minLength: 3 })} />
        </div>

        <div className="modal-action">
          <div className="btn btn-wide"><Link href="/stocks">Back to Stocks</Link></div>
          <input type="submit" className="btn btn-primary btn-wide" disabled={!formState.isValid} value={'Save Courier'}></input>
        </div>
      </form>

      <div className="mt-8 rounded shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Co-Loader Name</th>
            </tr>
          </thead>
          <tbody>
            {
              props.data && props.data.coloaders?.map((data: any, value: number) => {
                return <tr className="" key={value}>
                <td>{value + 1}</td>
                <td>{data.name}</td>
              </tr>
              })

            }
          </tbody>
        </table>
      </div>

    </div>
  </>
}

export default withPageAuthRequired(AddCourierForStockEntry);

export async function getServerSideProps(context: any) {
  const res = await fetch(`${process.env.API_HOST}/api/stocks/coloader`, {
    headers: {
      cookie: context.req.headers.cookie || '',
    },
  })
  const data = await res.json()

  if (!data) {
    return {
      success: false,
    }
  }

  return {
    props: { data, success: true },
  }
}
