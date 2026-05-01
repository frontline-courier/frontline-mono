import { useUser } from '@auth0/nextjs-auth0/client';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import DataTable from 'react-data-table-component';
import { courierStatus } from '../../constants/shipmentStatus';
import { getDoxType } from '../../models/DoxType';
import { getShipmentMode } from '../../models/shipmentMode';
import { getTransportMode } from '../../models/transportMode';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { AiFillEdit, AiFillRead } from 'react-icons/ai';
import { MdUpdate, MdAdd } from 'react-icons/md';
import DeletePage from './delete';
import moment from 'moment';
import { SubmitHandler, useForm } from 'react-hook-form';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import { shipmentStatus } from '../../models/shipmentStatus';

const statusList = courierStatus.sort((a, b) => a.ShipmentStatus.localeCompare(b.ShipmentStatus));

const BookingPage = () => {
  const router = useRouter();
  const { page = 1 } = router.query; // Get page from query, default to 1
  const [courierList, setCourierList] = useState<any[]>([]); // State for couriers
  const [loadingCouriers, setLoadingCouriers] = useState(true); // Loading state for couriers
  const [errorCouriers, setErrorCouriers] = useState<string | null>(null); // Error state for couriers\ const { user, error, isLoading } = useUser();
  const [deleteModel, setDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(25);
  const [searchData, setSearchData] = useState({ awbNumber: '', referenceNumber: '', thirdPartyNumber: '', courier: 0, shipmentMode: 0, status: '' });
  const [rawBookingData, setRawBookingData] = useState([]); // Add this state to store raw data

  // useForm hook
  const { register, handleSubmit, reset } = useForm<any>({
    mode: 'onChange',
    defaultValues: {
      courier: 0,
      status: 0,
      shipmentMode: 0,
      shipmentStatus: ''
    }
  });

  // Fetch couriers on component mount
  const fetchCouriers = useCallback(async () => {
    try {
      const response = await axios.get('/api/couriers');
      setCourierList(response.data.couriers); // Set the fetched couriers
    } catch (error) {
      setErrorCouriers('Failed to load couriers'); // Handle error
    } finally {
      setLoadingCouriers(false); // Set loading to false
    }
  }, []);

  // Fetch data whenever page or perPage changes in the URL
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/bookings?page=${page}&limit=${perPage}&courier=${searchData.courier || 0
        }&mode=${searchData.shipmentMode || 0}&status=${searchData.status || ''
        }&awb=${searchData.awbNumber}&ref=${searchData.referenceNumber}&tpn=${searchData.thirdPartyNumber}`
      );
      
      setRawBookingData(response.data.booking); // Store raw data
      setTotalRows(response.data.count);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, searchData]);

  const getCourierName = useCallback((courierId: string): string => {
    if (courierId === null || courierId === undefined) { return 'NA'; }
    return courierList.find((c) => c.CourierId === parseInt(courierId, 10))?.Courier || 'NA';
  }, [courierList]);

  useEffect(() => {
    fetchCouriers();
    fetchData();
  }, [fetchCouriers, fetchData]); // Dependency on fetchCouriers

  // get data from list
  // to be removed after sometime
  const getShipmentStatus = (status: string): string => {
    if (typeof status === 'string') { return status; }
    return statusList.find((s) => s.StatusId === parseInt(status, 10))?.ShipmentStatus || 'NA';
  }

  const data = rawBookingData.map((booking: any) => ({
    ...booking,
    courier: getCourierName(booking.courier),
    bookedDate: moment(booking.bookedDate).format('DD-MM-YYYY HH:mm'),
    doxType: getDoxType(booking.doxType),
    shipmentMode: getShipmentMode(booking.shipmentMode),
    shipmentStatus: getShipmentStatus(booking.shipmentStatus)
  }));

  const activeFilterCount = [
    searchData.awbNumber,
    searchData.referenceNumber,
    searchData.thirdPartyNumber,
    searchData.status,
    searchData.courier > 0 ? searchData.courier : '',
    searchData.shipmentMode > 0 ? searchData.shipmentMode : '',
  ].filter(Boolean).length;

  const onSubmit: SubmitHandler<any> = async (data) => {
    setSearchData(data);
  };

  const handleDeleteModel = async (e: any) => {
    e.preventDefault();
    setDelete(true);
  }

  const getShipmentStatusColor = (s: string) => {
    switch ((s + '').toLowerCase()) {
      case 'booked':
        return 'bg-red-200';
      case 'in transit':
        return 'bg-yellow-200';
      case 'delivered':
        return 'bg-green-200';
      case 'taken for delivery':
        return 'bg-indigo-200';
      default:
        return '';
    }
  }

  const ExpandedComponent = ({ data }: any) => {
    return (
      <table className="table table-xs table-zebra">
        <tbody>
          {Object.entries(data).map(([key, value]) => {
            if (typeof value !== 'string') {
              return null; // Skip if value is not a string
            }

            return (
              <tr key={key}>
                <td>{key}</td>
                <td>{value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const columns = [
    {
      name: 'AWB',
      selector: (row: any) => row.awbNumber,
      sortable: true,
      minWidth: '120px',
    },
    {
      name: 'Reference',
      selector: (row: any) => row.referenceNumber,
      sortable: true,
      minWidth: '120px',
    },
    {
      name: 'tp #',
      selector: (row: any) => row.thirdPartyNumber,
      sortable: true,
      minWidth: '120px',
    },
    {
      name: 'Vendor Leaf',
      selector: (row: any) => row.additionalLeaf,
      sortable: true,
      width: '90px',
    },
    {
      name: 'courier',
      selector: (row: any) => row.courier,
      sortable: true,
      minWidth: '120px',
    },
    {
      name: 'BookedDate',
      selector: (row: any) => row.bookedDate,
      sortable: true,
      minWidth: '140px',
    },
    // {
    //   name: 'ShipperName',
    //   selector: (row: any) => row.shipperName,
    // },
    {
      name: 'ReceiverName',
      selector: (row: any) => row.receiverName,
      minWidth: '120px',
    },
    {
      name: 'DoxType',
      selector: (row: any) => row.doxType,
      sortable: true,
      minWidth: '90px',
    },
    {
      name: 'ShipmentMode',
      selector: (row: any) => row.shipmentMode,
      sortable: true,
      minWidth: '120px',
    },
    // {
    //   name: 'TransportMode',
    //   selector: (row: any) => getTransportMode(row.transportMode),
    //   sortable: true,
    // },
    // {
    //   name: 'Leaf',
    //   selector: (row: any) => row.additionalLeaf,
    // },
    {
      name: 'Status',
      selector: (row: any) => <div className={`badge badge-outline ${getShipmentStatusColor(row.shipmentStatus)}`}>{row.shipmentStatus}</div>,
      sortable: true,
      minWidth: '110px',
    },
    // {
    //   name: 'CoCourier',
    //   selector: (row: any) => coCourierType(row.coCourier),
    //   sortable: true,
    // },
    {
      name: 'Weight',
      selector: (row: any) => row.actualWeight,
      sortable: true,
      width: '90px',
    },
    {
      name: '',
      width: '78px',
      allowOverflow: true,
      button: true,
      cell: (row: any) => {
        return <div className="booking-action-dropdown dropdown dropdown-end">
          <div tabIndex={0} className="m-1 btn btn-xs btn-secondary"><BsThreeDotsVertical /></div>
          <ul tabIndex={0} className="booking-action-menu menu dropdown-content p-1 shadow bg-base-100 rounded-box w-40 right-0 top-full mt-2 z-[60]">
            <li><a href={`/bookings/${row._id}/edit`}> <AiFillEdit className="mr-2" /> Edit</a></li>
            <li><a href={`/bookings/${row._id}/view`}> <AiFillRead className="mr-2" /> View</a></li>
            {/* <li><a> <AiFillDelete className="mr-2" onClick={handleDeleteModel} /> Delete</a></li> */}
            <li><a href={`/bookings/${row._id}/status`}> <MdUpdate className="mr-2" /> Edit/Update Status</a></li>
            {/* <li><a> <FaMapMarkedAlt className="mr-2" /> Check Status</a></li> */}
          </ul>
        </div>
      }
    }
  ];

  const handlePageChange = (newPage: number) => {
    router.push({
      pathname: '/bookings',
      query: { ...router.query, page: newPage },
    });
  };

  const handlePerRowsChange = (newPerPage: number, newPage: number) => {
    // Reset page to 1 when perPage changes
    router.push({
      pathname: '/bookings',
      query: { ...router.query, page: 1, perPage: newPerPage },
    });
    setPerPage(newPerPage);
  };

  // Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
  function convertArrayOfObjectsToCSV(array: any) {
    let result: string;

    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item: any) => {
      let ctr = 0;
      keys.forEach(key => {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

  // Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
  function downloadCSV(array: any) {
    const link = document.createElement('a');
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv == null) return;

    const filename = `export${Date.now()}.csv`;

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
  }

  const Export = (event: any) => <button type="button" className="btn btn-sm rounded-xl border-primary bg-base-100 text-primary shadow-sm hover:bg-primary/10 hover:text-primary sm:w-auto" onClick={(e: any) => event.onExport(e.target.value)}>Download</button>;

  const NewBookingButton = () => (
    <Link href="/bookings/create" className="btn btn-sm rounded-xl border-primary bg-primary !text-white shadow-sm hover:brightness-95 hover:!text-white sm:w-auto">
      <span className="text-lg"><MdAdd /></span>
      <span>New Booking</span>
    </Link>
  );

  const DataTableButtons = () => {
    return <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
      <Export onExport={() => downloadCSV(data)} />
      <NewBookingButton />
    </div>
  }


  return  (
    <>
      {errorCouriers ? (
        <div className="alert alert-warning mb-3">
          <span>{errorCouriers}. Showing bookings with fallback courier labels.</span>
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-full flex-col gap-3">
        <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-slate-100 p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Booking Operations</p>
              <p className="max-w-2xl text-sm text-slate-600">
                Search by AWB, reference, third-party number, courier, mode, or status and jump into edit and status workflows from the same screen.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Visible</div>
                <div className="text-lg font-semibold text-slate-900">{data.length}</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Total</div>
                <div className="text-lg font-semibold text-slate-900">{totalRows}</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm col-span-2 sm:col-span-1">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Filters</div>
                <div className="text-lg font-semibold text-slate-900">{activeFilterCount}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
            <form onSubmit={handleSubmit(onSubmit)} role="search" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:flex xl:flex-wrap xl:items-end xl:gap-3">
              <input type="text" autoComplete="false" placeholder="AWB Number" className="input input-bordered input-sm w-full xl:w-44" {...register('awbNumber', { minLength: 3 })} />
              <input type="text" autoComplete="false" placeholder="Reference" className="input input-bordered input-sm w-full xl:w-40" {...register('referenceNumber', { minLength: 3 })} />
              <input type="text" autoComplete="false" placeholder="Third Party #" className="input input-bordered input-sm w-full xl:w-40" {...register('thirdPartyNumber', { minLength: 3 })} />
              <select className={'select select-bordered select-sm w-full xl:w-48'}  {...register('courier', { valueAsNumber: true },)}>
                <option value={0}>-- courier --</option>
                {
                  courierList.map((d) => {
                    return <option key={d.CourierId + d.Courier} value={d.CourierId}>{d.Courier}</option>
                  })
                }
              </select>
              <select className={'select select-bordered select-sm w-full xl:w-44'} {...register('shipmentMode', { valueAsNumber: true })}>
                <option value={0}>-- shipment mode --</option>
                <option value={1}>Domestic</option>
                <option value={2}>International</option>
                <option value={3}>Local</option>
                <option value={0}>NA</option>
              </select>
              <select className="select select-bordered select-sm w-full xl:w-44" {...register('status')}>
                <option value="">-- status --</option>
                {
                  statusList.map((s, i) => {
                    return <option key={s.StatusId} value={s.ShipmentStatus}>{s.ShipmentStatus}</option>
                  })
                }
              </select>
              <input type="submit" className="btn btn-secondary btn-sm w-full sm:col-span-2 lg:col-span-3 xl:w-auto" value="Search" />
            </form>
            <div className="xl:sticky xl:right-0 xl:self-start">
              <DataTableButtons />
            </div>
          </div>
        </section>

        <div className="booking-table-shell overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="booking-table-scroll overflow-x-auto">
            <div className="booking-table min-w-[1120px]">
              <DataTable
                columns={columns}
                data={data}
                progressPending={loading}
                expandableRows
                expandableRowsComponent={ExpandedComponent}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationPerPage={25}
                paginationRowsPerPageOptions={[25, 50, 100, 250]}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                // fixedHeader
                highlightOnHover
              />
            </div>
          </div>
        </div>
      </div>

      {/* {
        deleteModel &&
        <DeletePage />
      } */}
    </>
  );
};

export default withPageAuthRequired(BookingPage);
