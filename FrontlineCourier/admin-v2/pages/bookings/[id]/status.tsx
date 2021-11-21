import { useEffect, useState } from "react";
import { shipmentStatus } from "../../../models/shipmentStatus";
import { useForm } from "react-hook-form";
import axios from "axios";
import { statusRelation } from "../../../constants/deliveryRelation";
import moment from "moment";

const status = shipmentStatus;
const relations = statusRelation;

export default function ShipmentStatusPage(props: any) {

  const { register, handleSubmit, formState, reset } = useForm(
    {
      mode: 'onChange'
    });

  const [updateError, setError] = useState('');

  const onSubmit = async (data: any) => {
    try {
      const response =
        await axios.post(`/api/bookings/${props.data._id}/status`, data);

      const { remark, statusDate, statusId } = data;
      props.data.delivery = [...props.data.delivery, { remark, statusDate, statusId }];
      location.reload();
    } catch (e: any) {
      console.log(e);
      setError(e?.message);
    } finally {
    }
  }

  // const handleEdit = async (arr: any, index: number) => {
  //   try {
  //     reset(arr);
  //   } catch (e: any) {
  //     console.log(e);
  //   } finally {
  //   }
  // };

  const handleDelete = async (arr: any, index: number) => {
    try {
      const response =
        await axios.put(`/api/bookings/${props.data._id}/status`, { ...arr, action: 'delete' });

      // const { remark, statusDate, statusId } = arr;
      console.log(props.data.delivery)
      props.data.delivery = props.data.delivery?.splice(index, 1);
      console.log(props.data.delivery);
      location.reload();
    } catch (e: any) {
      console.log(e);
      setError(e?.message);
    } finally {
    }
  }

  useEffect(() => {
    console.log(props);
  }, []);

  return (
    <>
      <div className="flex justify-between m-4">
        <div className="">
          <h2 className="text-2xl font-semibold">Shipment Status</h2>
        </div>
      </div>

      <div className="flex m-4">
        {
          props.success &&
          <div>
            <table className="table w-full table-zebra">
              <tbody>
                <tr>
                  <td>Booked </td>
                  <td>{moment(props.data.bookedDate).format('Do MMM YYYY - hh:mm a (ddd)')}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                {
                  props.data.delivery &&
                  props.data.delivery.map((status: any, index: number) => {
                    return <tr key={status.statusId + index} className="hover">
                      <td>{status.statusId}</td>
                      <td>{moment(status.statusDate).format('Do MMM YYYY - hh:mm a (ddd)')}</td>
                      <td>{status.remark}</td>
                      {index + 1 === props.data.delivery.length &&
                        <>
                          {/* <td><button className="btn btn-warning" onClick={() => handleEdit(status, index)}>Edit</button></td> */}
                          <td><button className="btn btn-danger" onClick={() => handleDelete(status, index)}>Delete</button></td>
                        </>
                      }
                      {index + 1 !== props.data.delivery.length &&
                        <>
                          {/* <td></td> */}
                          <td></td>
                        </>
                      }
                    </tr>
                  })
                }
              </tbody>
            </table>

            {
              !(props.data.delivery?.some((s: any) => s.statusId === 'Delivered'))
              &&
              <form className="shadow bordered rounded m-4 p-4" onSubmit={handleSubmit(onSubmit)}>
                <h3 className="text-lg font-semibold mb-2">Update Status</h3>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Status Date</span>
                  </label>
                  <input type="datetime-local" defaultValue={moment().format(moment.HTML5_FMT.DATETIME_LOCAL)} placeholder="Status Date" className="input input-bordered" {...register("statusDate", { required: true })} />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Status</span>
                  </label>
                  <select className="select select-bordered" {...register("statusId", { required: true })}>
                    <option disabled={true} selected={true}>-- status --</option>
                    {
                      status.map((s, i) => {
                        return <option key={s.StatusId + i} value={s.ShipmentStatus}>{s.ShipmentStatus}</option>
                      })
                    }
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Remarks</span>
                  </label>
                  <textarea placeholder="remark" className="textarea h-20 textarea-bordered" {...register("remark")} />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Receiver Name</span>
                  </label>
                  <input type="text" placeholder="Receiver Name" className="input input-bordered" {...register("receiverName")} />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Relation with Receiver</span>
                  </label>
                  <select className="select select-bordered" {...register("receivedPersonRelation")}>
                    <option disabled={true} selected={true} defaultValue="">-- courier --</option>
                    {
                      relations.map((d, i) => {
                        return <option key={d.RelationId + i} value={d.Name}>{d.Name}</option>
                      })
                    }
                  </select>
                </div>

                <input type="submit" className="btn btn-block btn-success mt-4" disabled={!formState.isValid} />
              </form>
            }

          </div>
        }
        {
          !(props.success) &&
          <div className="alert alert-error m-4">
            <div className="flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
              </svg>
              <label>Failed to load data, please try again!</label>
            </div>
          </div>
        }
      </div>
    </>
  )
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