import { FormEvent, useState } from "react";
import { LockFilled, MailFilled } from "@ant-design/icons";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const SignInForm = () => {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    if (res?.error) {
      setError(res.error as string);
    }
    if (res?.ok) {
      return router.push("/");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        {error && <div className="text-red-800">{error}</div>}
      </div>
      <div className="relative">
        <MailFilled
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={20}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full pl-10 pr-4 py-3 bg-white/10 text-white rounded-xl outline-none focus:ring-2 focus:ring-cyan-400 transition-all hover:bg-white/20"
          required
        />
      </div>
      <div className="relative">
        <LockFilled
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={20}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full pl-10 pr-4 py-3 bg-white/10 text-white rounded-xl outline-none focus:ring-2 focus:ring-cyan-400 transition-all hover:bg-white/20"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 font-medium"
      >
        Sign In
      </button>
    </form>
  );
};

export default SignInForm;
