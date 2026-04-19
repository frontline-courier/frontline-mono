import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Head from 'next/head';
import Link from 'next/link';
import VolumetricForm from '../../components/Forms/VolumetricForm';

const VolumetricCalculator = () => {
  return (
    <>
      <Head>
        <title>Volumetric Weight Calculator | Frontline Courier</title>
      </Head>
      <div className="flex flex-col">
        <div className="w-full">
          <div className="text-sm breadcrumbs px-6 py-3 bg-base-200">
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>Volumetric Calculator</li>
            </ul>
          </div>
          <div className="divider m-0"></div>
          
          

          <VolumetricForm />
        </div>
      </div>
    </>
  );
};

export default withPageAuthRequired(VolumetricCalculator);
