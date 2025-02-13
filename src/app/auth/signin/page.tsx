"use client";

import { useRouter } from "next/navigation";
import SignInForm from "./SignInForm";

const SignInPage = () => {
  const router = useRouter();
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Sign In</h1>
        <SignInForm />

        <div className="mt-6 text-center">
          <p className="text-gray-300">
            Do you want to create an account?{" "}
            <button
              onClick={() => router.push("/auth/signup")}
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
