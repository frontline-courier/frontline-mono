import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

function QuickBooking() {
  return <>
    <div>
      Coming soon...
    </div>

  </>
}


export default withPageAuthRequired(QuickBooking);
