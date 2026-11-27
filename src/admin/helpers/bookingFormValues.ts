import { BookingFormInputs } from '../interfaces/bookingForm';
import { toDatetimeLocalString } from './dateHelpers';

export const getNumericFieldValue = (value: unknown) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
};

export function buildBookingFormValues(
  booking: Record<string, any>,
  defaultValues: Partial<BookingFormInputs>,
): Partial<BookingFormInputs> {
  return {
    ...defaultValues,
    ...booking,
    bookedDate: toDatetimeLocalString(booking.bookedDate),
    bookedBy: booking.bookedBy || '',
    paymentMode: booking.paymentMode || '',
    creditStatus: booking.creditStatus || '',
    creditNotes: booking.creditNotes || '',
    branch: booking.branch || '',
    bookingAmount: getNumericFieldValue(booking.bookingAmount),
    dueAmount: getNumericFieldValue(booking.dueAmount),
    actualWeight: getNumericFieldValue(booking.actualWeight),
    insured: booking.insured === true,
  };
}

export function buildCloneFormValues(
  booking: Record<string, any>,
  defaultValues: Partial<BookingFormInputs>,
): Partial<BookingFormInputs> {
  return {
    ...buildBookingFormValues(booking, defaultValues),
    awbNumber: '',
    bookedDate: toDatetimeLocalString(),
  };
}
