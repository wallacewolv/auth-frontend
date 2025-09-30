import { motion } from 'framer-motion';
import {
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../store/auth-store';

export function EmailVerificationPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const { error, isLoading, verifyEmail } = useAuthStore();

  const handleChange = (index: number, value: string) => {
    // Accepts only the last character typed
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Automatically moves focus to the next input
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]!.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6).split("");

    const newCode = [...code];
    for (let i = 0; i < 6; i++) {
      newCode[i] = pasted[i] || "";
    }
    setCode(newCode);

    // Focuses on the next empty input or the last one
    let lastFilledIndex = -1;
    for (let i = newCode.length - 1; i >= 0; i--) {
      if (newCode[i] !== "") {
        lastFilledIndex = i;
        break;
      }
    }
    const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = useCallback(
    async (e: FormEvent | Event) => {
      e.preventDefault();

      const verificationCode = code.join("");

      try {
       await verifyEmail(verificationCode);
       navigate("/");
       toast.success("Email verified successfully!");
      } catch (error: any) {
        toast.error(error.response.data.message || "Failed to verify email");
      }
    },
    [code, navigate, verifyEmail]
  );

  // Auto submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code, handleSubmit]);

  return (
    <div
      className="max-w-md w-full bg-gray-800/50 backdrop-filter 
      backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800/50 backdrop-filter backdrop-blur-xl 
        rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <h2
          className="text-3xl font-bold mb-6 text-center bg-gradient-to-r 
          from-green-400 to-emerald-500 text-transparent bg-clip-text"
        >
          Verify Your Email
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Enter the 6-digit code sent to your email address.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => void (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 
                  text-white border-2 border-gray-600 rounded-lg 
                  focus:border-green-500 focus:outline-none"
              />
            ))}
          </div>

          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 
          text-white font-bold py-3 px-4 rounded-lg shadow-lg 
          hover:from-green-600 hover:to-emerald-700 focus:outline-none 
            focus:ring-2 focus:ring-green-500/50 disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
