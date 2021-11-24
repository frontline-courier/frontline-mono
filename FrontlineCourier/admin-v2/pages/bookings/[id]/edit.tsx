import React, { useEffect, useState } from "react";
import Link from 'next/link';
import Router from "next/router";
import { useRouter } from "next/router";
import { useForm, SubmitHandler, useFormState } from "react-hook-form";
import { courierLists } from "../../../constants/courierList";
import moment from "moment";
import axios from "axios";
import { useUser } from "@auth0/nextjs-auth0";

type Inputs = {
  awbNumber: string,
  referenceNumber: string,
  bookedDate: string,
  courier: number,
  shipperName: string,
  origin: string,
  doxType: number,
  receiverName: string,
  destination: string,
  shipmentMode: number,
  transportMode: number,
  coCourier: number,
  bookingAmount: number,
  billAmount: number,
  actualWeight: number,
  remarks: string,
  internalRemarks: string,
  deliveryOfficeLocation: string,
  additionalContacts: string,
  additionalWeights: string,
  additionalLeaf: string,
};

export default function EditBookingPage(props: any) {

  const couriers = courierLists;
  const [loader, setLoader] = useState(false);
  const [saveError, setError] = useState('');
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();

  const { register, handleSubmit, watch, formState, reset, resetField } = useForm<Inputs>({
    mode: "onChange",
    defaultValues: props.data,
  });
  const errors = formState.errors;

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoader(true);

    try {
      const addResponse =
        await axios.post('/api/bookings/update', { ...data, updatedBy: user?.email })

      reset({});
      resetField("courier");
      resetField("doxType");
      resetField("shipmentMode");
      resetField("transportMode");
      Router.push('/bookings');
    } catch (e: any) {
      setError(e?.message);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    props.data.bookedDate = moment(props.data.bookedDate).format(moment.HTML5_FMT.DATETIME_LOCAL);
    resetField("bookedDate");
  }, [id]);

  return (
    <>
      <div className="flex justify-between m-4">
        <div className="">
          <h2 className="text-2xl font-semibold">Add Booking</h2>
        </div>
      </div>

      {loader && <div >Saving...</div>}

      {!loader &&
        <form onSubmit={handleSubmit(onSubmit)} className="m-4 p-4 w-full lg:w-2/3">
          <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">AWB</span>
              </label>
              <input type="text" placeholder="AWB" className={`input input-bordered ${errors.awbNumber && 'input-error'}`} {...register("awbNumber", { required: true, minLength: 5 })} />
            </div>
            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Reference</span>
              </label>
              <input type="text" placeholder="Reference" className={`input input-bordered ${errors.referenceNumber && 'input-error'}`} {...register("referenceNumber", { minLength: 5 })} />
            </div>
            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Booking Date</span>
              </label>
              <input type="datetime-local" placeholder="Booking Date" className={`input input-bordered ${errors.bookedDate && 'input-error'}`} {...register("bookedDate", { required: true, valueAsDate: true })} />
            </div>

            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Courier</span>
              </label>
              <select className={`select select-bordered ${errors.courier && 'select-error'}`}  {...register("courier", { required: true, valueAsNumber: true },)}>
                <option disabled={true} selected={true} value="">-- courier --</option>
                {
                  couriers.map((d) => {
                    return <option key={d.CourierId} value={d.CourierId}>{d.Courier}</option>
                  })
                }
              </select>
            </div>
            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Shipper Name</span>
              </label>
              <input type="text" placeholder="Shipper Name" className={`input input-bordered ${errors.shipperName && 'input-error'}`} {...register("shipperName", { required: true, minLength: 3 })} />
            </div>
            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Origin</span>
              </label>
              <input type="text" placeholder="Origin" className={`input input-bordered ${errors.origin && 'input-error'}`} {...register("origin", { required: true, minLength: 3 })} />
            </div>

            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">DoxType</span>
              </label>
              <select className={`select select-bordered ${errors.doxType && 'select-error'}`} {...register("doxType", { required: true, valueAsNumber: true })}>
                <option disabled={true} selected={true} value="">-- dox type --</option>
                <option value={1}>Dox</option>
                <option value={2}>Non Dox</option>
                <option value={0}>NA</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Receiver Name</span>
              </label>
              <input type="text" placeholder="Receiver Name" className={`input input-bordered ${errors.receiverName && 'input-error'}`} {...register("receiverName", { required: true, minLength: 3 })} />
            </div>
            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Destination</span>
              </label>
              <input type="text" placeholder="Destination" className={`input input-bordered ${errors.destination && 'input-error'}`} {...register("destination", { required: true, minLength: 3 })} />
            </div>

            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Shipment Mode</span>
              </label>
              <select className={`select select-bordered ${errors.shipmentMode && 'select-error'}`} {...register("shipmentMode", { required: true, valueAsNumber: true })}>
                <option disabled={true} selected={true} value="">-- shipment mode --</option>
                <option value={1}>Domestic</option>
                <option value={2}>International</option>
                <option value={3}>Local</option>
                <option value={0}>NA</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Transport Mode</span>
              </label>
              <select className={`select select-bordered ${errors.transportMode && 'select-error'}`} {...register("transportMode", { required: true, valueAsNumber: true })}>
                <option disabled={true} selected={true} value="">-- transport mode --</option>
                <option value={1}>Air</option>
                <option value={2}>Cargo</option>
                <option value={3}>Air Cargo</option>
                <option value={4}>Sea Cargo</option>
                <option value={5}>Surface Cargo</option>
                <option value={6}>Surface</option>
                <option value={7}>Train Cargo</option>
                <option value={8}>Road Cargo</option>
                <option value={0}>NA</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Co Courier</span>
              </label>
              <select className={`select select-bordered ${errors.awbNumber && 'select-error'}`} {...register("coCourier", { valueAsNumber: true })}>
                <option disabled={true} selected={true} value="">-- co courier --</option>
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Booking Amount</span>
              </label>
              <input type="text" placeholder="Booking Amount" className={`input input-bordered ${errors.bookingAmount && 'input-error'}`} {...register("bookingAmount", { required: true, valueAsNumber: true })} />
            </div>
            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Bill Amount</span>
              </label>
              <input type="text" placeholder="Bill Amount" className={`input input-bordered ${errors.billAmount && 'input-error'}`} {...register("billAmount", { required: true, valueAsNumber: true })} />
            </div>
            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Actual weight (Kg)</span>
              </label>
              <input type="text" placeholder="Actual weight" className={`input input-bordered ${errors.actualWeight && 'input-error'}`} {...register("actualWeight", { required: true, valueAsNumber: true })} />
            </div>

            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Add. Phone Number</span>
              </label>
              <input type="text" placeholder="Add. Phone Number" className="input input-bordered" {...register("additionalContacts")} />
            </div>
            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Add. Volume/Size</span>
              </label>
              <input type="text" placeholder="Add. Volume/Size" className="input input-bordered" {...register("additionalWeights")} />
            </div>
            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Add. Lead/Pouch</span>
              </label>
              <input type="text" placeholder="Add. Lead/Pouch" className="input input-bordered" {...register("additionalLeaf")} />
            </div>

            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Remarks</span>
              </label>
              <textarea className="textarea h-24 textarea-bordered" placeholder="Remarks" {...register("remarks")}></textarea>
            </div>
            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Delivery Office Location</span>
              </label>
              <textarea className="textarea h-24 textarea-bordered" placeholder="Delivery Office Location" {...register("deliveryOfficeLocation")}></textarea>
            </div>
            <div className="form-control">
              <label className="label p-1">
                <span className="label-text text-2xs">Internal Remarks</span>
              </label>
              <textarea className="textarea h-24 textarea-bordered" placeholder="Internal Remarks" {...register("internalRemarks")}></textarea>
            </div>

          </div>

          {
            saveError &&
            <div className="alert alert-error m-4">
              <div className="flex-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                </svg>
                <label>{saveError}</label>
              </div>
            </div>
          }

          <div className="modal-action">
            <div className="btn btn-wide"><Link href="/bookings">Back to Bookings</Link></div>
            {/* <label htmlFor="my-modal-2" className="btn btn-primary btn-wide" onClick={insertBooking}>Save</label> */}
            {!loader && <input type="submit" className="btn btn-primary btn-wide" disabled={!formState.isValid}></input>}
          </div>

        </form>
      }
    </>
  );
}

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const res = await fetch(`${process.env.API_HOST}/api/bookings/${id}`)
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