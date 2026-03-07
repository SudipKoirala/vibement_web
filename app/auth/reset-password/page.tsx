'use client';

import { Suspense } from 'react';
import ResetPasswordContent from '@/app/auth/reset-password/ResetPasswordContent';

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><p>Loading...</p></div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
