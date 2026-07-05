import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
  className?: string;
  variant?: "login" | "boxed";
};

export function PasswordInput({
  value,
  onChange,
  placeholder,
  required,
  minLength,
  autoComplete = "current-password",
  className = "login-input",
  variant = "login",
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const isLogin = variant === "login";

  return (
    <div className="relative group/password">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        className={`${className} ${isLogin ? "pr-8" : "pr-9"}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className={
          isLogin
            ? `absolute right-0 bottom-[0.55rem] flex h-5 w-5 items-center justify-center rounded-full text-black/25 transition-all duration-200 hover:text-[#E11D2A] hover:bg-black/[0.03] group-focus-within/password:text-black/40`
            : `absolute right-2.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-[#A3A3A3] transition-all duration-200 hover:text-[#E11D2A] hover:bg-[#FEE2E2]/50`
        }
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {visible ? (
          <EyeOff size={13} strokeWidth={1.75} className="opacity-90" />
        ) : (
          <Eye size={13} strokeWidth={1.75} className="opacity-90" />
        )}
      </button>
    </div>
  );
}
