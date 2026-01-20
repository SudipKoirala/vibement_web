"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authActions } from "../actions/auth";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authActions.register(data);

      if (result.success) {
        window.location.href = "/auth/dashboard";
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-green-600">Register</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
        <input
          {...register("name")}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Your Name"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input
          {...register("email")}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter email"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
        <input
          type="password"
          {...register("password")}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter password"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
        <input
          type="password"
          {...register("confirmPassword")}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Confirm password"
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
      >
        {isLoading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
