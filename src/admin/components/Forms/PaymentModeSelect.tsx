import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

type PaymentModeSelectProps = {
  options: readonly string[];
  value: string;
  hasError?: boolean;
  onChange: (nextValue: string) => void;
};

const CREDIT_PAYMENT_MODE = 'Credit';

export const getPaymentModeOptionClassName = (mode: string) => (
  mode === CREDIT_PAYMENT_MODE ? 'text-status-danger' : 'text-status-default'
);

export default function PaymentModeSelect({ options, value, hasError = false, onChange }: PaymentModeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        return;
      }

      setIsOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-xl border bg-white px-3 py-2 text-left text-sm font-normal text-slate-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2',
          hasError
            ? 'border-red-300 focus-visible:ring-red-200'
            : 'border-slate-200 focus-visible:ring-slate-300 hover:border-slate-300'
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <span>{value || '-- payment mode --'}</span>
      </button>

      {isOpen ? (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <ul className="max-h-64 overflow-y-auto py-1" role="listbox" aria-label="Payment mode options">
            {options.map((mode) => {
              const isSelected = mode === value;

              return (
                <li key={mode}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      'flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-slate-50',
                      getPaymentModeOptionClassName(mode)
                    )}
                    onClick={() => {
                      onChange(mode);
                      setIsOpen(false);
                    }}
                  >
                    <span>{mode}</span>
                    {isSelected ? <span className="text-xs opacity-60">Selected</span> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}