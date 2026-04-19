import React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import BookingForm from '../../../components/Forms/BookingForm';

function EditBookingPage(props: any) {

  return (
    <BookingForm></BookingForm>
  );
}

export default withPageAuthRequired(EditBookingPage);
