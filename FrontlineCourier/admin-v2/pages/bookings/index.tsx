import { useUser } from "@auth0/nextjs-auth0";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from 'next/link';
import DataTable from "react-data-table-component";
import { courierLists } from "../../constants/courierList";
import { courierStatus } from "../../constants/shipmentStatus";
import { getDoxType } from "../../models/DoxType";
import { getShipmentMode } from "../../models/shipmentMode";
import { getTransportMode } from "../../models/transportMode";
import { BsThreeDotsVertical } from 'react-icons/bs';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { MdUpdate } from 'react-icons/md';
import DeletePage from "./delete";
import moment from "moment";
import { SubmitHandler, useForm } from "react-hook-form";

const courierList = courierLists;
const statusList = courierStatus;

export default function BookingPage() {

  // get data from list
  // to be removed after sometime
  const getShipmentStatus = (status: string): string => {
    if (typeof status === 'string') { return status; }
    return statusList.find((s) => s.StatusId === parseInt(status, 10))?.ShipmentStatus || 'NA';
  }

  const getCourierName = (courierId: string): string => {
    if (courierId === null || courierId === undefined) { return 'NA'; }
    return courierList.find((c) => c.CourierId === parseInt(courierId, 10))?.Courier || 'NA';
  }

  const coCourierType = (coCourier: string): string => {
    switch (parseInt(coCourier, 10)) {
      case 1:
        return 'yes';
      case 0:
        return 'no';
      default:
        return 'na';
    }
  }

  const { register, handleSubmit, watch, formState, reset, resetField } = useForm<any>({
    mode: "onChange",
    defaultValues: {}
  });
  const { user, error, isLoading } = useUser();
  const [data, setData] = useState([]);
  const [deleteModel, setDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(25);

  const fetchUsers = async (page: number) => {

    setLoading(true);
    const response = await axios.get(`/api/bookings?page=${page}&limit=${perPage}`);
    setData(response.data.booking);
    setTotalRows(response.data.count);
    setLoading(false);
  };

  const handlePageChange = (page: number) => {
    fetchUsers(page);
  };

  const handlePerRowsChange = async (newPerPage: number, page: number) => {
    setLoading(true);
    const response = await axios.get(`/api/bookings?page=${page}&limit=${newPerPage}`);
    setData(response.data.booking);
    setPerPage(newPerPage);
    setLoading(false);
  };

  const onSubmit: SubmitHandler<any> = async (data) => {
    setLoading(true);

    try {
      const response =
        await axios.get(`/api/bookings?awb=${data.awbNumber}&ref=${data.referenceNumber}`);

      setData(response.data.booking);
      setTotalRows(response.data.count);
    } catch (e: any) {
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModel = async (e: any) => {
    e.preventDefault();
    setDelete(true);
  }

  const getShipmentStatusColor = (s: string) => {
    switch (s.toLowerCase())
    {
      case 'booked':
        return 'bg-red-400';
      case 'in transit':
        return 'bg-yellow-400';
      case 'delivered': 
        return 'bg-green-400';
      case 'taken for delivery':
        return 'bg-indigo-400';
      default:
        return '';
    }
  }

  // A super simple expandable component.
  const ExpandedComponent = ({ data }: any) =>
  // {
  //   <table>
  //     <tbody>
  //       (
  //         <tr key={1}>{2}<td></td><td>{3}</td></tr>
  //       )
  //     </tbody>
  //   </table>
  // }
  <pre>{JSON.stringify(data, null, 2)}</pre>;

  const columns = [
    {
      name: 'AWB',
      selector: (row: any) => row.awbNumber,
      sortable: true,
    },
    {
      name: 'Reference',
      selector: (row: any) => row.referenceNumber,
      sortable: true,
    },
    {
      name: 'Leaf',
      selector: (row: any) => row.additionalLeaf,
      sortable: true,
    },
    {
      name: 'courier',
      selector: (row: any) => getCourierName(row.courier),
      sortable: true,
    },
    {
      name: 'BookedDate',
      selector: (row: any) => moment(row.bookedDate).format('DD-MM-YYYY HH:mm'),
      sortable: true,
    },
    // {
    //   name: 'ShipperName',
    //   selector: (row: any) => row.shipperName,
    // },
    {
      name: 'ReceiverName',
      selector: (row: any) => row.receiverName,
    },
    {
      name: 'DoxType',
      selector: (row: any) => getDoxType(row.doxType),
      sortable: true,
    },
    {
      name: 'ShipmentMode',
      selector: (row: any) => getShipmentMode(row.shipmentMode),
      sortable: true,
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
      selector: (row: any) => <div className={`badge ${getShipmentStatusColor(row.shipmentStatus)}`}>{getShipmentStatus(row.shipmentStatus)}</div>,
      sortable: true,
    },
    // {
    //   name: 'CoCourier',
    //   selector: (row: any) => coCourierType(row.coCourier),
    //   sortable: true,
    // },
    {
      name: 'Weight',
      selector: (row: any) => row.actualWeight,
    },
    {
      name: '',
      cell: (row: any) => {
        return <div className="dropdown dropdown-end">
          <div tabIndex={0} className="m-1 btn btn-xs btn-secondary"><BsThreeDotsVertical /></div>
          <ul tabIndex={0} className="p-1 shadow menu dropdown-content bg-base-100 rounded-box w-40 right-0 top-0">
            <li><a href={`/bookings/${row._id}/edit`}> <AiFillEdit className="mr-2" /> Edit</a></li>
            {/* <li><a> <AiFillDelete className="mr-2" onClick={handleDeleteModel} /> Delete</a></li> */}
            <li><a href={`/bookings/${row._id}/status`}> <MdUpdate className="mr-2" /> Edit/Update Status</a></li>
            {/* <li><a> <FaMapMarkedAlt className="mr-2" /> Check Status</a></li> */}
          </ul>
        </div>
      }
    }
  ];

  function convertArrayOfObjectsToCSV(array: any) {
    let result: any;

    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = Object.keys(data[0]) || {};

    result = '';
    result += keys?.join(columnDelimiter);
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

    const filename = 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
  }
  const Export = ({ onExport }: any) => <button className="btn btn-sm btn-success" onClick={e => onExport((e.target as any).value)}>Export</button>;

  const actionsMemo = React.useMemo(() => <Export onExport={() => downloadCSV(data)} />, []);

  useEffect(() => {
    fetchUsers(1); // fetch page 1 of users
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <>
      <div className="flex justify-between m-4">
        <div className="">
          <h2 className="text-2xl font-semibold">Booking</h2>
        </div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" autoComplete="false" placeholder="AWB Number" className="input input-bordered" {...register("awbNumber", { minLength: 5 })} />
            <input type="text" autoComplete="false" placeholder="Reference" className="input input-bordered" {...register("referenceNumber", { minLength: 5 })} />
            {/* <select className={`select select-bordered`}  {...register("courier", { valueAsNumber: true },)}>
              <option disabled={true} selected={true} value="">-- courier --</option>
              {
                courierList.map((d) => {
                  return <option key={d.CourierId} value={d.CourierId}>{d.Courier}</option>
                })
              }
            </select>
            <select className={`select select-bordered`} {...register("shipmentMode", { valueAsNumber: true })}>
              <option disabled={true} selected={true} value="">-- shipment mode --</option>
              <option value={1}>Domestic</option>
              <option value={2}>International</option>
              <option value={3}>Local</option>
              <option value={0}>NA</option>
            </select>
            <select className="select select-bordered" {...register("statusId", {valueAsNumber: true  })}>
              <option disabled={true} selected={true}>-- status --</option>
              {
                statusList.map((s, i) => {
                  return <option key={s.StatusId + i} value={s.ShipmentStatus}>{s.ShipmentStatus}</option>
                })
              }
            </select> */}
            <input type="submit" className="btn btn-secondary mx-2" value="Search" />
          </form>
        </div>
        <div className="">
          <span className="btn btn-primary mx-2"><Link href="/bookings/create">New Booking</Link></span>
        </div>
      </div>

      <div>
        <DataTable
          columns={columns}
          data={data}
          actions={actionsMemo}
          progressPending={loading}
          expandableRows
          expandableRowsComponent={ExpandedComponent}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationRowsPerPageOptions={[25, 50, 100, 250]}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          fixedHeader
          highlightOnHover
        />
      </div>

      {
        deleteModel &&
        <DeletePage />
      }
    </>
  );
}
