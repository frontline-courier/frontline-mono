import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import CreateCreditForm from '../../../components/Forms/CreditBookingForm';

export default withPageAuthRequired(function Page() {

  return (
    <>
      <div className="flex justify-between m-4">
        <div className="">
          <h2 className="text-2xl font-semibold">Credit Entry /  Delete</h2>
        </div>
      </div>

      <CreateCreditForm />
    </>
  );
});
