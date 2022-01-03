import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getAWBRange } from "../../helpers/awb/getRange";

function StockEntry(props: any) {

  const { register, handleSubmit, watch, formState, reset, resetField } = useForm({
    mode: "onChange",
  });
  const errors = formState.errors;
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [saveError, setError] = useState('');

  const handleAddCourier = (e: any) => {
    router.push('/stocks/courier');
  }

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        let awbNos = '';
        let error = '';

        try {
          awbNos = getAWBRange(data.awb).join(',');
        } catch (err: any) {
          error = err.message;
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
                  <p>Courier Name: {data.courier}</p>
                  <p>Co Loader: {data.coLoader}</p>
                  <p>Total Bills: {awbNos.length || 0}</p>
                  <p>Per Bill Cost: {data.cost || 0}</p>
                  <p>Total Bill Cost: {(awbNos.length || 0) * (data.cost || 0)}</p>
                  <p className="break-all">Bill Nos: {awbNos}</p>
                </div>
              }
              <div className="modal-action">
                <label htmlFor="stock-modal" className="btn" onClick={onClose}>Close</label>
                {!error && <label htmlFor="stock-modal" className="btn btn-primary">Accept</label>}
              </div>
            </div>
          </div>
        );
      }
    });
  };

  const handleAddCoLoader = (e: any) => {
    router.push('/stocks/co-loader');
  }


  const handleAddBooker = (e: any) => {
    router.push('/stocks/booker');
  }

  return <>
    <div className="flex justify-between m-4">
      <div>
        <h2 className="text-2xl font-semibold">Stock Entry</h2>
      </div>
      <div>
        <button className="btn btn-secondary mr-2" onClick={handleAddCourier}>Add Courier</button>
        <button className="btn btn-secondary mr-2" onClick={handleAddCoLoader}>Add Co-Loader</button>
        <button className="btn btn-secondary" onClick={handleAddBooker}>Add Booker</button>
      </div>
    </div>

    <div className="m-4 p-4 w-2/3 lg:w-1/2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control">
          <label className="label p-1">
            <span className="label-text text-2xs">Courier</span>
          </label>
          <select className={`select select-bordered ${errors.courier && 'select-error'}`}  {...register("courier", { required: true, })}>
            <option disabled={true} selected={true} value="">-- courier --</option>
            {
              props.data.courier.couriers.map((d: any, value: number) => {
                return <option key={value} value={d.name}>{d.name}</option>
              })
            }
          </select>
        </div>

        <div className="form-control">
          <label className="label p-1">
            <span className="label-text text-2xs">Co Loader</span>
          </label>
          <select className={`select select-bordered ${errors.coLoader && 'select-error'}`}  {...register("coLoader", { required: false })}>
            <option disabled={true} selected={true} value="">-- co-loader --</option>
            {
              props.data.loader.coloaders.map((d: any, value: number) => {
                return <option key={value} value={d.name}>{d.name}</option>
              })
            }
          </select>
        </div>

        {/* <div className="form-control">
          <label className="label p-1">
            <span className="label-text text-2xs">Courier</span>
          </label>
          <select className={`select select-bordered ${errors.courier && 'select-error'}`}  {...register("courier", { required: true })}>
            <option disabled={true} selected={true} value="">-- booker --</option>
            {
              props.data.booker.bookers.map((d: any, value: number) => {
                return <option key={value} value={d.type + '-' + d.name}>{d.type + '-' + d.name}</option>
              })
            }
          </select>
        </div> */}

        <div className="form-control">
          <label className="label p-1">
            <span className="label-text text-2xs">AWB Numbers</span>
          </label>
          <input type="text" placeholder="Stock Data - ex: 121212121-25" className={`input input-bordered ${errors.awb && 'input-error'}`} {...register("awb", { required: true, minLength: 3 })} />
        </div>

        <div className="form-control">
          <label className="label p-1">
            <span className="label-text text-2xs">Bill Cost</span>
          </label>
          <input type="text" placeholder="0" className={`input input-bordered ${errors.cost && 'input-error'}`} {...register("cost", { required: false, valueAsNumber: true })} />
        </div>

        <div className="modal-action">
          <input type="submit" className="btn btn-primary btn-wide" disabled={!formState.isValid} value={'Save Stock'}></input>
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
            </tr>
          </thead>
          <tbody>
            {
              props.data && props.data.stocks?.map((data: any, value: number) => {
                return <tr className="" key={value}>
                  <td>{value + 1}</td>
                  <td>{data.coloader}</td>
                  <td>{data.courier}</td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>

    </div>
  </>
}

export default withPageAuthRequired(StockEntry);

export async function getServerSideProps(context: any) {
  const stocks = await fetch(`${process.env.API_HOST}/api/stocks`);
  const couriers = await fetch(`${process.env.API_HOST}/api/stocks/courier`);
  const loaders = await fetch(`${process.env.API_HOST}/api/stocks/coloader`);
  const bookers = await fetch(`${process.env.API_HOST}/api/stocks/booker`);

  const stockData = await stocks.json();
  const courierData = await couriers.json();
  const loaderData = await loaders.json();
  const bookerData = await bookers.json();

  if (!stockData || !courierData) {
    return {
      success: false,
    }
  }

  return {
    props: { data: { stock: stockData, courier: courierData, loader: loaderData, booker: bookerData }, success: true },
  }
}