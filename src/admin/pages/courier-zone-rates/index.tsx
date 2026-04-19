import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import CourierZoneRateForm from '../../components/Forms/CourierZoneRateForm';

export default function CourierZoneRatesPage() {
  const { user, error: userError, isLoading: isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/api/auth/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="alert alert-error m-4">
        Failed to load user data. Please try again.
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="bg-base-200">
      <div className="container mx-auto px-4 py-2">
        <CourierZoneRateForm />
      </div>
    </div>
  );
}
