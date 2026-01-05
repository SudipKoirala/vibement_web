import { z } from 'zod';

export const RegisterDTO = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['user', 'admin']).optional(),
});

export type RegisterDTOType = z.infer<typeof RegisterDTO>;
