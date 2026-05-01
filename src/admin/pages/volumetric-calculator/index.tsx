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
          <VolumetricForm />
        </div>
      </div>
    </>
  );
};

export default withPageAuthRequired(VolumetricCalculator);
