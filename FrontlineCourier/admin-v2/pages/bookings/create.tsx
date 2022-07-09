import React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import BookingForm from '../../components/Forms/BookingForm';

function AddBookingPage() {

  return (
    <>
      <div className="flex justify-between m-4">
        <div className="">
          <h2 className="text-2xl font-semibold">Add Booking</h2>
        </div>
      </div>

      <BookingForm></BookingForm>
    </>
  );
}

export default withPageAuthRequired(AddBookingPage);
