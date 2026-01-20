'use client';

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authActions } from '../actions/auth';

const registerSchema = z.object({
  username: z.string().min(2, "Username required"),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be 6+ chars" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterInput = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/auth/dashboard";
        }, 1500);
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
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '400px',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2rem', color: '#f5576c', margin: '0 0 10px 0' }}>VibeMent</h1>
          <p style={{ color: '#888', margin: '0', fontSize: '0.9rem' }}>Create your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div style={{
              marginBottom: '15px',
              padding: '12px',
              background: '#fee',
              border: '1px solid #fcc',
              color: '#c33',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              marginBottom: '15px',
              padding: '12px',
              background: '#efe',
              border: '1px solid #cfc',
              color: '#3c3',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}>
              Registration successful! Redirecting...
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>Username</label>
            <input
              {...register("username")}
              type="text"
              placeholder="Choose a username"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #eee',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#f5576c'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#eee'}
            />
            {errors.username && <p style={{ color: '#c33', fontSize: '0.85rem', marginTop: '5px' }}>{errors.username.message}</p>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="your@email.com"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #eee',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#f5576c'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#eee'}
            />
            {errors.email && <p style={{ color: '#c33', fontSize: '0.85rem', marginTop: '5px' }}>{errors.email.message}</p>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>Password</label>
            <input
              {...register("password")}
              type="password"
              placeholder="Enter a strong password"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #eee',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#f5576c'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#eee'}
            />
            {errors.password && <p style={{ color: '#c33', fontSize: '0.85rem', marginTop: '5px' }}>{errors.password.message}</p>}
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>Confirm Password</label>
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm your password"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #eee',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#f5576c'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#eee'}
            />
            {errors.confirmPassword && <p style={{ color: '#c33', fontSize: '0.85rem', marginTop: '5px' }}>{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              opacity: isLoading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(245, 87, 108, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#f5576c', textDecoration: 'none', fontWeight: '600' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;