import React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import ShipmentForm from '../../components/Forms/BookingRateForm';

function BookingRatesAddPage() {

  return (
    <>
      <div className="flex justify-between m-4">
        <div className="">
          <h2 className="text-2xl font-semibold">Add Booking Rate</h2>
        </div>
      </div>

      <ShipmentForm />
    </>
  );
}

export default withPageAuthRequired(BookingRatesAddPage);
