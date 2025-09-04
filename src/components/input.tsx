import type { ComponentType, InputHTMLAttributes, SVGProps } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export function Input({ icon: Icon, ...props }: InputProps) {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="w-5 h-5 text-green-500" />
      </div>
      <input
        {...props}
        className="w-full pl-10 pr-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700 
        focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white 
        placeholder-gray-400 transition duration-200"
      />
    </div>
  );
};
