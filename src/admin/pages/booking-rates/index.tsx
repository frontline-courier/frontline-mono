import React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import ShipmentForm from '../../components/Forms/BookingRateForm';

function BookingRatesAddPage() {

  return (
    <ShipmentForm />
  );
}

export default withPageAuthRequired(BookingRatesAddPage);
