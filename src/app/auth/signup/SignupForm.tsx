"use client";

import { useRef, useState } from "react";
import "./SignUp.css";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  KeyOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { register } from "@/actions/user";
import { useRouter } from "next/navigation";

const SignUpForm = () => {
  const [error, setError] = useState<string>();
  const ref = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Password validation (on password change)
    if (name === "password") {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={};':"\\|,.<>/?`~])[A-Za-z\d!@#$%^&*()_+\-={};':"\\|,.<>/?`~]{8,}$/; // At least 8 characters, one lowercase, one uppercase, one number, one special character
      if (!passwordRegex.test(value)) {
        setPasswordError(
          "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character."
        );
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (formData: FormData) => {
    const r = await register({
      email: formData.get("email") as string,
      raw: formData.get("password") as string,
      name: `${formData.get("firstName")} ${formData.get("lastName")}`,
      role: "Admin",
    });
    ref.current?.reset();
    if (r?.error) {
      setError(r.error);
      return;
    } else {
      return router.push("/auth/signin");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const generatePassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}|:<>?-=[];,./`~";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    if (ref.current) {
      const passwordInput = ref.current.querySelector<HTMLInputElement>(
        'input[name="password"]'
      );
      if (passwordInput) {
        passwordInput.value = password;
      }
    }
    setShowPassword(true);
    setPasswordError("");
  };

  return (
    <form ref={ref} action={handleSubmit} className="space-y-4">
      {/* Name Fields */}
      <div className="relative">{error}</div>
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <UserOutlined
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={20}
          />
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="form-input"
            required
          />
        </div>
        <div className="relative">
          <UserOutlined
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={20}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            className="form-input"
            required
          />
        </div>
      </div>

      {/* Email and Password Fields */}
      <div className="relative">
        <MailOutlined
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={20}
        />
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          className="form-input"
          required
        />
      </div>
      <div className="relative">
        <LockOutlined
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={20}
        />
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          onChange={handleChange}
          placeholder="Enter your password"
          className="form-input"
          required
        />
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-800"
        >
          {showPassword ? (
            <EyeOutlined size={20} />
          ) : (
            <EyeInvisibleOutlined size={20} />
          )}
        </button>
        <button
          type="button"
          onClick={generatePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800"
        >
          <KeyOutlined size={20} />
        </button>
      </div>
      {passwordError && (
        <p className="text-red-500 mt-1 text-xs">{passwordError}</p>
      )}
      {!showPassword && (
        <div className="relative">
          <LockOutlined
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={20}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            className="form-input"
            required
          />
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="submit-button"
        disabled={passwordError.length > 0}
      >
        Create Account
      </button>
    </form>
  );
};

export default SignUpForm;
