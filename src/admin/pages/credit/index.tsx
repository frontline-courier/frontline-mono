import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DataTable from 'react-data-table-component';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';

import moment from 'moment';
import { SubmitHandler, useForm } from 'react-hook-form';
import { MdUpdate } from 'react-icons/md';
import { apiPath } from '../../constants/path/apiPath';
import { creditModes } from '../../constants/credit/mode';
import { creditClients } from '../../constants/credit/clients';
import { creditCourier } from '../../constants/credit/couriers';
import { creditServices } from '../../constants/credit/service';
import { pagePath } from '../../constants/path/pagePath';

const DeletePage = () => { }

function BookingPage() {

  const { register, handleSubmit, watch, formState, reset, resetField } = useForm<any>({
    mode: 'onChange',
    defaultValues: {
      client: '',
      courier: '',
      mode: '',
      service: '',
    }
  });
  const { user, error, isLoading } = useUser();
  const [data, setData] = useState([]);
  const [deleteModel, setDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(25);
  const [searchData, setSearchData] = useState({ pod: '', client: '', courier: '', mode: '', service: '' });

  const fetchShipment = async (page: number) => {

    setLoading(true);
    const response =
      await axios.get(
        `${apiPath.creditBooking}?page=${page}&limit=${perPage}&courier=${searchData.courier || ''}&mode=${searchData.mode || ''}&client=${searchData.client || ''}&pod=${searchData.pod}&service=${searchData.service}`);
    setData(response.data.booking);
    setTotalRows(response.data.count);
    setLoading(false);
  };

  const handlePageChange = (page: number) => {
    fetchShipment(page);
  };

  const handlePerRowsChange = async (newPerPage: number, page: number) => {
    setLoading(true);
    const response =
      await axios.get(`${apiPath.creditBooking}?page=${page}&limit=${newPerPage}&courier=${searchData.courier || ''}&mode=${searchData.mode || ''}&client=${searchData.client || ''}&pod=${searchData.pod}&service=${searchData.service}`);
    setData(response.data.booking);
    setPerPage(newPerPage);
    setLoading(false);
  };

  const onSubmit: SubmitHandler<any> = async (data) => {
    setSearchData(data);
  };

  const handleDeleteModel = async (e: any) => {
    e.preventDefault();
    setDelete(true);
  }

  const columns = [
    {
      name: 'Client',
      selector: (row: any) => row.client,
      sortable: true,
    },
    {
      name: 'POD',
      selector: (row: any) => row.pod,
      sortable: true,
    },
    {
      name: 'Courier',
      selector: (row: any) => row.courier,
      sortable: true,
    },
    {
      name: 'Mode',
      selector: (row: any) => row.mode,
      sortable: true,
    },
    {
      name: 'Service',
      selector: (row: any) => row.service,
      sortable: true,
    },
    {
      name: 'BookedDate',
      selector: (row: any) => moment(row.bookedDate).format('DD-MM-YYYY'),
      sortable: true,
    },
    {
      name: 'Destination',
      selector: (row: any) => row.destination,
    },
    // {
    //   name: 'Pin code',
    //   selector: (row: any) => row.pinCode,
    //   sortable: true,
    // },
    {
      name: 'Actual Weight',
      selector: (row: any) => row.actualWeight,
      sortable: true,
    },
    {
      name: 'Vol Weight',
      selector: (row: any) => row.volWeight,
    },
    {
      name: 'ODA EDL',
      selector: (row: any) => row.odaEdl,
    },
    {
      name: 'Carrier Insurance',
      selector: (row: any) => row.carrierInsurance,
    },
    {
      name: 'FOV Risk',
      selector: (row: any) => row.fovRisk,
    },
    {
      name: 'Amount',
      selector: (row: any) => row.amount,
    },
    {
      name: '',
      cell: (row: any) => {
        return <div className="dropdown dropdown-end">
          <div tabIndex={0} className="m-1 btn btn-xs btn-secondary"><BsThreeDotsVertical /></div>
          <ul tabIndex={0} className="p-1 shadow menu dropdown-content bg-base-100 rounded-box w-40 right-0 top-0 z-[1]">
            <li><a href={`/credit/${row._id}/edit`}> <AiFillEdit className="mr-2" /> Edit</a></li>
            <li><a href={`/credit/${row._id}/delete`}> <AiFillDelete className="mr-2" /> Delete</a></li>
          </ul>
        </div>
      }
    }
  ];

  useEffect(() => {
    fetchShipment(1); // fetch page 1 of users
  }, [searchData]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <>
      <div className="flex justify-between m-4">
        <div className="">
          <h2 className="text-2xl font-semibold">Booking</h2>
        </div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} role="search">
            <input type="text" autoComplete="false" placeholder="AWB Number" className="input input-bordered" {...register('pod', { minLength: 3 })} />

            <select className={'select select-bordered '}  {...register('client')}>
              <option value={''}>-- client --</option>
              {
                creditClients.map((d) => {
                  return <option key={d.code} value={d.name}>{d.name}</option>
                })
              }
            </select>

            <select className={'select select-bordered'}  {...register('courier')}>
              <option value={''}>-- courier --</option>
              {
                creditCourier.map((d) => {
                  return <option key={d} value={d}>{d}</option>
                })
              }
            </select>

            <select className={'select select-bordered'} {...register('mode')}>
              <option value={''}>-- shipment mode --</option>
              {
                creditModes.map((d) => {
                  return <option key={d} value={d}>{d}</option>
                })
              }
            </select>

            <select className={'select select-bordered '} {...register('service')}>
              <option value={''}>-- service --</option>
              {
                creditServices.map((d) => {
                  return <option key={d} value={d}>{d}</option>
                })
              }
            </select>

            <input type="submit" className="btn btn-secondary mx-2" value="Search" />
          </form>
        </div>
        <div className="">
          <span className="btn btn-primary mx-2"><Link href={pagePath.createCreditBooking}>New Credit Entry</Link></span>
        </div>
      </div>

      <div>
        <DataTable
          columns={columns}
          data={data}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationPerPage={25}
          paginationRowsPerPageOptions={[25, 50, 100, 250]}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          fixedHeader
          highlightOnHover
        />
      </div>

      {/* {
        deleteModel &&
        <DeletePage />
      } */}
    </>
  );
}

export default withPageAuthRequired(BookingPage);
