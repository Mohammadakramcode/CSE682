import { InputHTMLAttributes, forwardRef } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, Props>(function Input(props, ref) {
  const { className = "", ...rest } = props;
  return (
    <input
      ref={ref}
      className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 ${className}`}
      {...rest}
    />
  );
});

export default Input;



