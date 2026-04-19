import React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import BookingForm from '../../components/Forms/BookingForm';

function AddBookingPage() {

  return (
    <BookingForm></BookingForm>
  );
}

export default withPageAuthRequired(AddBookingPage);
