import type { ComponentPropsWithoutRef } from 'react';

type AuthTextFieldProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'className'
> & {
  id: string;
  label: string;
};

export function AuthTextField({ id, label, ...inputProps }: AuthTextFieldProps) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1.5 block font-micro text-[10px] tracking-[2px] uppercase text-soil">
        {label}
      </span>
      <input
        className="w-full rounded-sm border-3 border-bark bg-parchment px-3.5 py-2.5 font-body text-xl text-ink outline-none placeholder:text-oat-ink focus:border-harvest focus:ring-3 focus:ring-harvest/25 disabled:cursor-not-allowed disabled:opacity-70"
        id={id}
        {...inputProps}
      />
    </label>
  );
}
