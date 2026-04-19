import React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import BookingForm from '../../../components/Forms/BookingForm';

function ViewBookingPage(props: any) {

  return (
    <BookingForm></BookingForm>
  );
}

export default withPageAuthRequired(ViewBookingPage);
