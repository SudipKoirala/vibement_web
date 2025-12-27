import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be 6+ chars" }),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    console.log("Login Data:", data);
    // redirect to dashboard for now
    window.location.href = "/auth/dashboard";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-green-600">Login</h2>
      <div className="mb-4">
        <label>Email</label>
        <input
          {...register("email")}
          className="w-full border px-3 py-2 rounded"
          placeholder="Enter email"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      <div className="mb-4">
        <label>Password</label>
        <input
          type="password"
          {...register("password")}
          className="w-full border px-3 py-2 rounded"
          placeholder="Enter password"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>
      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
        Login
      </button>
    </form>
  );
}
