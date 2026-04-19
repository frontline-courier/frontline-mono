import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import CreateCreditForm from '../../components/Forms/CreditBookingForm';

export default withPageAuthRequired(function Page() {

  return (
    <CreateCreditForm />
  );
});
