import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type AuthTextFieldProps = Omit<ComponentPropsWithoutRef<'input'>, 'className'> & {
  icon?: ReactNode;
  id: string;
  label: string;
};

export function AuthTextField({
  icon,
  id,
  label,
  ...inputProps
}: AuthTextFieldProps) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1.5 flex items-center gap-2 font-body text-sm font-extrabold text-secondary">
        {icon ? (
          <span aria-hidden className="text-base leading-none">
            {icon}
          </span>
        ) : null}
        {label}
      </span>
      <input
        className="w-full border-2 border-wood/45 bg-parchment px-3.5 py-2.5 font-body text-base font-bold text-foreground shadow-[3px_3px_0_rgb(61_43_31_/_0.1)] outline-none placeholder:text-secondary/55 focus:border-primary focus:ring-3 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
        id={id}
        {...inputProps}
      />
    </label>
  );
}
