import Link from "next/link";
import SignUpForm from "./SignupForm";

export default function SignUp() {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
        <SignUpForm />
        <div className="mt-6 text-center">
          <p className="text-gray-300">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
