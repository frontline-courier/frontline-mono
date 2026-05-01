import { useEffect, useState } from 'react';
import { shipmentStatus } from '../../../models/shipmentStatus';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { statusRelation } from '../../../constants/deliveryRelation';
import moment from 'moment';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

const status = shipmentStatus;
const relations = statusRelation;

const getDefaultStatusFormValues = () => ({
  statusDate: moment().format(moment.HTML5_FMT.DATETIME_LOCAL),
  statusId: '',
  remark: '',
  receivedPerson: '',
  receivedPersonRelation: '',
});

function ShipmentStatusPage(props: any) {

  const [bookingData, setBookingData] = useState(props.data);
  const [isStatusUpdating, setStatusUpdate] = useState(false);
  const [isDeletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [updateError, setError] = useState('');

  const { register, handleSubmit, formState, reset } = useForm(
    {
      mode: 'onChange',
      defaultValues: getDefaultStatusFormValues(),
    });

  useEffect(() => {
    setBookingData(props.data);
  }, [props.data]);

  const deliveryHistory = bookingData?.delivery || [];
  const currentStatus = deliveryHistory[deliveryHistory.length - 1]?.statusId || 'Booked';
  const currentStatusUpdatedAt = deliveryHistory[deliveryHistory.length - 1]?.statusDate;

  const onSubmit = async (data: any) => {
    try {
      setError('');
      setStatusUpdate(true);
      await axios.post(`/api/bookings/${bookingData._id}/status`, data);

      const { remark, statusDate, statusId, receivedPerson, receivedPersonRelation } = data;

      setBookingData((currentBooking: any) => ({
        ...currentBooking,
        shipmentStatus: statusId,
        receivedPerson: receivedPerson || '',
        receivedPersonRelation: receivedPersonRelation || '',
        delivery: [
          ...(currentBooking?.delivery || []),
          {
            remark,
            statusDate,
            statusId,
            updatedDateTime: new Date().toISOString(),
          },
        ],
      }));
    } catch (e: any) {
      setError(e.response?.data?.error || e?.message || 'Failed to update status.');
    } finally {
      setStatusUpdate(false);
      reset(getDefaultStatusFormValues());
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
      setError('');
      setDeletingIndex(index);
      await axios.put(`/api/bookings/${bookingData._id}/status`, { ...arr, action: 'delete' });

      setBookingData((currentBooking: any) => {
        const nextDelivery = (currentBooking?.delivery || []).filter((_: any, deliveryIndex: number) => deliveryIndex !== index);

        return {
          ...currentBooking,
          shipmentStatus: nextDelivery[nextDelivery.length - 1]?.statusId || 'Booked',
          receivedPerson: '',
          receivedPersonRelation: '',
          delivery: nextDelivery,
        };
      });
    } catch (e: any) {
      setError(e.response?.data?.error || e?.message || 'Failed to delete status.');
    } finally {
      setDeletingIndex(null);
    }
  }

  return (
    <>
      <div className="flex m-4">
        {
          props.success &&
          <div className="w-full max-w-4xl space-y-4">
            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body gap-4">
                <div>
                  <h2 className="card-title">Shipment Status</h2>
                  <p className="text-sm opacity-70">AWB: {bookingData?.awbNumber || 'NA'}</p>
                </div>

                <div className="stats stats-vertical border border-base-200 bg-base-100 md:stats-horizontal">
                  <div className="stat py-4">
                    <div className="stat-title">Current Status</div>
                    <div className="stat-value text-lg">{currentStatus}</div>
                  </div>
                  <div className="stat py-4">
                    <div className="stat-title">Last Updated</div>
                    <div className="stat-value text-sm font-medium">
                      {currentStatusUpdatedAt ? moment(currentStatusUpdatedAt).format('Do MMM YYYY - hh:mm a (ddd)') : 'Booked only'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {updateError && (
              <div className="alert alert-error">
                <div className="flex-1">
                  <label>{updateError}</label>
                </div>
              </div>
            )}

            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-0">
                <div className="px-4 pt-4">
                  <h3 className="card-title text-base">Status Timeline</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="table w-full table-zebra">
                    <tbody>
                      <tr>
                        <td className="font-medium">Booked</td>
                        <td>{moment(bookingData.bookedDate).format('Do MMM YYYY - hh:mm a (ddd)')}</td>
                        <td>-</td>
                        <td></td>
                      </tr>
                      {
                        deliveryHistory.map((status: any, index: number) => {
                          const isLatestStatus = index + 1 === deliveryHistory.length;

                          return <tr key={status.statusId + index} className="hover">
                            <td>
                              <span className="badge badge-outline">{status.statusId}</span>
                            </td>
                            <td>{moment(status.statusDate).format('Do MMM YYYY - hh:mm a (ddd)')}</td>
                            <td>{status.remark || '-'}</td>
                            <td>
                              {isLatestStatus && (
                                <button
                                  type="button"
                                  className="btn btn-error btn-sm"
                                  onClick={() => handleDelete(status, index)}
                                  disabled={isDeletingIndex === index || isStatusUpdating}
                                >
                                  {isDeletingIndex === index ? 'Deleting...' : 'Delete'}
                                </button>
                              )}
                            </td>
                          </tr>
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {deliveryHistory.length === 0 && (
              <div className="alert alert-info">
                <div className="flex-1">
                  <label>No delivery updates yet.</label>
                </div>
              </div>
            )}

            {
              !(deliveryHistory.some((s: any) => s.statusId === 'Delivered') && !isStatusUpdating)
              &&
              <div className="card bg-base-100 shadow-sm border border-base-200">
                <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
                  <h3 className="card-title text-lg">Update Status</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="form-control">
                      <label className="label justify-start pb-2">
                        <span className="label-text">Status Date</span>
                      </label>
                      <input type="datetime-local" placeholder="Status Date" className="input input-bordered w-full" {...register('statusDate', { required: true })} />
                    </div>
                    <div className="form-control">
                      <label className="label justify-start pb-2">
                        <span className="label-text">Status</span>
                      </label>
                      <select className="select select-bordered w-full" {...register('statusId', { required: true })}>
                        <option disabled={true} value="">-- status --</option>
                        {
                          status.map((s, i) => {
                            return <option key={s.StatusId + i} value={s.ShipmentStatus}>{s.ShipmentStatus}</option>
                          })
                        }
                      </select>
                    </div>
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="label justify-start pb-2">
                      <span className="label-text">Remarks</span>
                    </label>
                    <textarea placeholder="remark" className="textarea h-24 textarea-bordered w-full" {...register('remark')} />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="form-control">
                      <label className="label justify-start pb-2">
                        <span className="label-text">Receiver Name</span>
                      </label>
                      <input type="text" placeholder="Receiver Name" className="input input-bordered w-full" {...register('receivedPerson')} />
                    </div>

                    <div className="form-control">
                      <label className="label justify-start pb-2">
                        <span className="label-text">Relation with Receiver</span>
                      </label>
                      <select className="select select-bordered w-full" {...register('receivedPersonRelation')}>
                        <option disabled={true} value="">-- relation --</option>
                        {
                          relations.map((d, i) => {
                            return <option key={d.RelationId + i} value={d.Name}>{d.Name}</option>
                          })
                        }
                      </select>
                    </div>
                  </div>

                  <div className="card-actions justify-end">
                    <input type="submit" className="btn btn-success" disabled={!formState.isValid || isStatusUpdating || isDeletingIndex !== null} value={isStatusUpdating ? 'Saving...' : 'Save Status'} />
                  </div>
                </form>
              </div>
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
  const res = await fetch(`${process.env.API_HOST}/api/bookings/${id}`, {
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

export default withPageAuthRequired(ShipmentStatusPage);
