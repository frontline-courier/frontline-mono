import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { creditClients } from '../../constants/credit/clients';
import { creditCourier } from '../../constants/credit/couriers';
import { creditModes } from '../../constants/credit/mode';
import { creditServices } from '../../constants/credit/service';
import { apiPath } from '../../constants/path/apiPath';
import { pagePath } from '../../constants/path/pagePath';

type ReportFilters = {
  startDate: string;
  endDate: string;
  client: string;
  courier: string;
  mode: string;
  service: string;
};

type ReportSummary = {
  totalBookings: number;
  totalAmount: number;
  totalSurcharges: number;
  totalRevenue: number;
  totalWeight: number;
  averageRevenue: number;
};

type BreakdownRow = {
  name: string;
  bookingCount: number;
  totalAmount: number;
  totalSurcharges: number;
  totalRevenue: number;
  totalWeight: number;
  averageRevenue: number;
};

type RecentBooking = {
  _id: string;
  client: string;
  pod: string;
  courier: string;
  mode: string;
  service: string;
  destination: string;
  bookedDate: string;
  amount: number;
  total: number;
};

type CreditReportResponse = {
  summary: ReportSummary;
  breakdowns: {
    clients: BreakdownRow[];
    couriers: BreakdownRow[];
    modes: BreakdownRow[];
    services: BreakdownRow[];
  };
  recentBookings: RecentBooking[];
};

const defaultFilters: ReportFilters = {
  startDate: '',
  endDate: '',
  client: '',
  courier: '',
  mode: '',
  service: '',
};

const emptySummary: ReportSummary = {
  totalBookings: 0,
  totalAmount: 0,
  totalSurcharges: 0,
  totalRevenue: 0,
  totalWeight: 0,
  averageRevenue: 0,
};

const emptyReport: CreditReportResponse = {
  summary: emptySummary,
  breakdowns: {
    clients: [],
    couriers: [],
    modes: [],
    services: [],
  },
  recentBookings: [],
};

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 2,
});

const formatCurrency = (value: number) => currencyFormatter.format(value || 0);

const formatNumber = (value: number) => numberFormatter.format(value || 0);

const formatDate = (value: string) => {
  if (!value) {
    return '-';
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const hasActiveFilters = (filters: ReportFilters) => Object.values(filters).some(Boolean);

function BreakdownTable({
  title,
  description,
  rows,
}: {
  title: string;
  description: string;
  rows: BreakdownRow[];
}) {
  return (
    <div className="card border border-base-200 bg-base-100 shadow-sm">
      <div className="card-body gap-4 p-4">
        <div>
          <h2 className="card-title text-base">{title}</h2>
          <p className="text-sm text-base-content/70">{description}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Name</th>
                <th className="text-right">Bookings</th>
                <th className="text-right">Revenue</th>
                <th className="text-right">Avg</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-sm text-base-content/60">
                    No data for the selected filters.
                  </td>
                </tr>
              )}

              {rows.map((row) => (
                <tr key={row.name}>
                  <td className="font-medium">{row.name}</td>
                  <td className="text-right">{formatNumber(row.bookingCount)}</td>
                  <td className="text-right">{formatCurrency(row.totalRevenue)}</td>
                  <td className="text-right">{formatCurrency(row.averageRevenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default withPageAuthRequired(function Page() {
  const [draftFilters, setDraftFilters] = useState<ReportFilters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<ReportFilters>(defaultFilters);
  const [report, setReport] = useState<CreditReportResponse>(emptyReport);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    const fetchReport = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await axios.get<CreditReportResponse>(apiPath.creditBookingReports, {
          params: appliedFilters,
        });

        if (!ignore) {
          setReport(data);
        }
      } catch (err: any) {
        if (!ignore) {
          setError(err.response?.data?.error || err.message || 'Unable to load reports.');
          setReport(emptyReport);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchReport();

    return () => {
      ignore = true;
    };
  }, [appliedFilters]);

  const updateFilter = (field: keyof ReportFilters, value: string) => {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
    }));
  };

  const handleApplyFilters = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAppliedFilters(draftFilters);
  };

  const handleResetFilters = () => {
    setDraftFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Credit Reports</p>
          <h1 className="text-3xl font-semibold text-base-content">Credit booking performance</h1>
          <p className="max-w-3xl text-sm text-base-content/70">
            Track billed value, surcharge contribution, shipment volume, and the strongest clients and couriers from the credit ledger.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href={pagePath.creditBookingList} className="btn btn-outline btn-sm">
            Credit entries
          </Link>
          <Link href={pagePath.createCreditBooking} className="btn btn-primary btn-sm">
            New credit entry
          </Link>
        </div>
      </div>

      <form onSubmit={handleApplyFilters} className="card border border-base-200 bg-base-100 shadow-sm">
        <div className="card-body gap-4 p-4">
          <div className="flex flex-col gap-1">
            <h2 className="card-title text-base">Filters</h2>
            <p className="text-sm text-base-content/70">Leave fields blank to report on the full credit history.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="form-control">
              <span className="label-text mb-2 text-xs uppercase tracking-[0.18em] text-base-content/60">Start date</span>
              <input
                type="date"
                className="input input-bordered"
                value={draftFilters.startDate}
                onChange={(event) => updateFilter('startDate', event.target.value)}
              />
            </label>

            <label className="form-control">
              <span className="label-text mb-2 text-xs uppercase tracking-[0.18em] text-base-content/60">End date</span>
              <input
                type="date"
                className="input input-bordered"
                value={draftFilters.endDate}
                onChange={(event) => updateFilter('endDate', event.target.value)}
              />
            </label>

            <label className="form-control">
              <span className="label-text mb-2 text-xs uppercase tracking-[0.18em] text-base-content/60">Client</span>
              <select
                className="select select-bordered"
                value={draftFilters.client}
                onChange={(event) => updateFilter('client', event.target.value)}
              >
                <option value="">All clients</option>
                {creditClients.map((client) => (
                  <option key={client.code} value={client.name}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-control">
              <span className="label-text mb-2 text-xs uppercase tracking-[0.18em] text-base-content/60">Courier</span>
              <select
                className="select select-bordered"
                value={draftFilters.courier}
                onChange={(event) => updateFilter('courier', event.target.value)}
              >
                <option value="">All couriers</option>
                {creditCourier.map((courier) => (
                  <option key={courier} value={courier}>
                    {courier}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-control">
              <span className="label-text mb-2 text-xs uppercase tracking-[0.18em] text-base-content/60">Mode</span>
              <select
                className="select select-bordered"
                value={draftFilters.mode}
                onChange={(event) => updateFilter('mode', event.target.value)}
              >
                <option value="">All modes</option>
                {creditModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-control">
              <span className="label-text mb-2 text-xs uppercase tracking-[0.18em] text-base-content/60">Service</span>
              <select
                className="select select-bordered"
                value={draftFilters.service}
                onChange={(event) => updateFilter('service', event.target.value)}
              >
                <option value="">All services</option>
                {creditServices.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-base-content/60">
              {hasActiveFilters(appliedFilters) ? 'Filtered view applied.' : 'Showing all credit bookings.'}
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleResetFilters}>
                Reset
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Apply filters
              </button>
            </div>
          </div>
        </div>
      </form>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="stat rounded-2xl border border-base-200 bg-base-100 shadow-sm">
          <div className="stat-title">Total bookings</div>
          <div className="stat-value text-3xl">{loading ? '...' : formatNumber(report.summary.totalBookings)}</div>
          <div className="stat-desc">Filtered credit shipment count</div>
        </div>

        <div className="stat rounded-2xl border border-base-200 bg-base-100 shadow-sm">
          <div className="stat-title">Billed amount</div>
          <div className="stat-value text-3xl">{loading ? '...' : formatCurrency(report.summary.totalAmount)}</div>
          <div className="stat-desc">Base amount before add-ons</div>
        </div>

        <div className="stat rounded-2xl border border-base-200 bg-base-100 shadow-sm">
          <div className="stat-title">Surcharges</div>
          <div className="stat-value text-3xl">{loading ? '...' : formatCurrency(report.summary.totalSurcharges)}</div>
          <div className="stat-desc">ODA, insurance, and FOV risk</div>
        </div>

        <div className="stat rounded-2xl border border-base-200 bg-base-100 shadow-sm">
          <div className="stat-title">Total revenue</div>
          <div className="stat-value text-3xl">{loading ? '...' : formatCurrency(report.summary.totalRevenue)}</div>
          <div className="stat-desc">Computed from stored total values</div>
        </div>

        <div className="stat rounded-2xl border border-base-200 bg-base-100 shadow-sm">
          <div className="stat-title">Average revenue</div>
          <div className="stat-value text-3xl">{loading ? '...' : formatCurrency(report.summary.averageRevenue)}</div>
          <div className="stat-desc">Average per credit booking</div>
        </div>

        <div className="stat rounded-2xl border border-base-200 bg-base-100 shadow-sm">
          <div className="stat-title">Total weight</div>
          <div className="stat-value text-3xl">{loading ? '...' : formatNumber(report.summary.totalWeight)}</div>
          <div className="stat-desc">Sum of actual shipment weight</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <BreakdownTable
          title="Top clients"
          description="Clients ranked by total revenue across the selected slice."
          rows={report.breakdowns.clients}
        />
        <BreakdownTable
          title="Top couriers"
          description="Courier performance based on booked credit revenue."
          rows={report.breakdowns.couriers}
        />
        <BreakdownTable
          title="Mode mix"
          description="Shipment mode contribution to revenue and booking count."
          rows={report.breakdowns.modes}
        />
        <BreakdownTable
          title="Service mix"
          description="Service-level share of the credit ledger."
          rows={report.breakdowns.services}
        />
      </div>

      <div className="card border border-base-200 bg-base-100 shadow-sm">
        <div className="card-body gap-4 p-4">
          <div>
            <h2 className="card-title text-base">Recent bookings in report scope</h2>
            <p className="text-sm text-base-content/70">Latest matching credit bookings, useful for drilling back into the underlying entries.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>POD</th>
                  <th>Client</th>
                  <th>Courier</th>
                  <th>Mode</th>
                  <th>Service</th>
                  <th>Destination</th>
                  <th className="text-right">Amount</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {report.recentBookings.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-sm text-base-content/60">
                      No credit bookings matched the selected filters.
                    </td>
                  </tr>
                )}

                {report.recentBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{formatDate(booking.bookedDate)}</td>
                    <td className="font-medium">{booking.pod}</td>
                    <td>{booking.client}</td>
                    <td>{booking.courier}</td>
                    <td>{booking.mode}</td>
                    <td>{booking.service}</td>
                    <td>{booking.destination}</td>
                    <td className="text-right">{formatCurrency(booking.amount)}</td>
                    <td className="text-right">{formatCurrency(booking.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
});
