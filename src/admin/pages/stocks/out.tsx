import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { useForm, SubmitHandler } from 'react-hook-form';
import { getAWBRange } from '../../helpers/awb/getRange';

function StockOutPage(props: any) {

  const router = useRouter();
  const { register, handleSubmit, watch, formState, reset, resetField } = useForm({
    mode: 'onChange',
  });
  const errors = formState.errors;
  const [saveError, setError] = useState('');

  const handleAddBooker = (e: any) => {
    router.push('/stocks/booker');
  }

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        let awbNos: string[] = [];
        let error = '';

        try {
          const seriesType = props.data.courier.find((d: any) => d.name === data.courier)['type']
          awbNos = getAWBRange(data.awb, seriesType);
        } catch (err: any) {
          error = err.message;
        }

        // save to db
        const saveStocksToDB = async (e: any) => {
          try {
            const stocksToSave = {
              awb: awbNos,
              courier: data.courier,
              coloader: data.coLoader || '',
            };

            const updateStatus = await axios.put('/api/stocks', stocksToSave);

            console.log(updateStatus.data);

            if (!updateStatus.data.success) { setError(updateStatus.data.error) }
          }
          catch (err: any) {
            setError(err.message);
          }
          finally {
            onClose();
            // setTimeout(() => { router.reload() }, 1000)
          }
        }

        return (
          <div className="modal modal-open">
            <div className="modal-box">
              {
                error &&
                <div>
                  <p>{error}</p>
                </div>

              }
              {
                !error &&
                <div>
                  <p>
                    <span>Courier Name:</span>
                    <span className="font-bold text-lg"> {data.courier}</span>
                  </p>
                  <span>Booker:</span>
                  <span className="font-bold text-lg"> {data.booker}</span>
                  <p>
                    <span>Total Bills:</span>
                    <span className="font-bold text-lg"> {awbNos.length || 0}</span>
                  </p>
                  <span>Per Bill Cost:</span>
                  <span className="font-bold text-lg"> {data.cost || 0}</span>
                  <p>
                    <span>Total Bill Cost:</span>
                    <span className="font-bold text-lg"> {(awbNos.length || 0) * (data.cost || 0)}</span>
                  </p>
                  <span>AWB Nos:</span>
                  <div className="h-60 overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <tbody>
                        {awbNos?.map((data, index) => {
                          return <tr key={index} className="hover">
                            <td>{index + 1}</td><td>{data}</td>
                          </tr>
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              }
              <div className="modal-action">
                <label htmlFor="stock-modal" className="btn" onClick={onClose}>Close</label>
                {!error && <label htmlFor="stock-modal" onClick={saveStocksToDB} className="btn btn-primary">Save</label>}
              </div>
            </div>
          </div>
        );
      }
    });
  };

  return <>
    <div className="flex justify-between m-4">
      <div>
        <button className="btn btn-secondary" onClick={handleAddBooker}>Booker</button>
      </div>
    </div>

    <div className="m-4 p-4 w-2/3 lg:w-1/2">

      {
        saveError &&
        <div className="alert alert-error">
          <div className="flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
            </svg>
            <label> {saveError} </label>
          </div>
        </div>
      }

      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="form-control">
          <label className="label p-1">
            <span className="label-text text-2xs">Courier</span>
          </label>
          <select className={`select select-bordered ${errors.courier && 'select-error'}`}  {...register('courier', { required: true, })}>
            <option disabled={true} selected={true} value="">-- courier --</option>
            {
              props.data.courier.map((d: any, value: number) => {
                return <option key={value} value={d.name}>{d.name}</option>
              })
            }
          </select>
        </div>

        <div className="form-control">
          <label className="label p-1">
            <span className="label-text text-2xs">Booker</span>
          </label>
          <select className={`select select-bordered ${errors.booker && 'select-error'}`}  {...register('booker', { required: false })}>
            <option disabled={true} selected={true} value="">-- booker --</option>
            {
              props.data.bookers.map((d: any, value: number) => {
                return <option key={value} value={`${d.name} - ${d.type}`}>{d.name} - {d.type}</option>
              })
            }
          </select>
        </div>

        <div className="form-control">
          <label className="label p-1">
            <span className="label-text text-2xs">AWB Numbers</span>
          </label>
          <input type="text" placeholder="Stock Data - ex: 121212121-25" className={`input input-bordered ${errors.awb && 'input-error'}`} {...register('awb', { required: true, minLength: 3 })} />
        </div>

        <div className="modal-action">
          <input type="submit" className="btn btn-primary btn-wide" disabled={!formState.isValid} value={'Preview Stock'}></input>
        </div>
      </form>

      <div className="mt-8 rounded shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Courier Name</th>
              <th>Co Loader</th>
              <th>Stock Count</th>
              <th>Cost/Bill</th>
            </tr>
          </thead>
          <tbody>
            {
              props.data && props.data.stock?.map((data: any, value: number) => {
                return <tr className="" key={value}>
                  <td>{value + 1}</td>
                  <td>{data.coloader}</td>
                  <td>{data.courier}</td>
                  <td>{data.awbs.length}</td>
                  <td>{data.billCost}</td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  </>
}

export default withPageAuthRequired(StockOutPage);

export async function getServerSideProps(context: any) {
  const res = await fetch(`${process.env.API_HOST}/api/stocks/stock-out`, {
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
    props: { data: { stock: data.stocks, courier: data.couriers, bookers: data.bookers }, success: true },
  }
}
