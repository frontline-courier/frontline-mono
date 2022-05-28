import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function CreditIndexPage() {
  return (
    <>
      <div className="flex justify-between m-4">
        <div className="">
          <h2 className="text-2xl font-semibold">Stock Entry</h2>
        </div>
      </div>

      <div>
        Coming soon...
      </div>
    </>
  );
}

export const getServerSideProps = withPageAuthRequired();
