import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be 6+ chars" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterInput = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterInput) => {
    console.log("Register Data:", data);
    window.location.href = "/auth/dashboard";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-green-600">Register</h2>
      <div className="mb-4">
        <label>Name</label>
        <input {...register("name")} className="w-full border px-3 py-2 rounded" placeholder="Your Name" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>
      <div className="mb-4">
        <label>Email</label>
        <input {...register("email")} className="w-full border px-3 py-2 rounded" placeholder="Enter email" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      <div className="mb-4">
        <label>Password</label>
        <input type="password" {...register("password")} className="w-full border px-3 py-2 rounded" placeholder="Enter password" />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>
      <div className="mb-4">
        <label>Confirm Password</label>
        <input type="password" {...register("confirmPassword")} className="w-full border px-3 py-2 rounded" placeholder="Confirm password" />
        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
      </div>
      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
        Register
      </button>
    </form>
  );
}
