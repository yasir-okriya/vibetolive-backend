import { z } from "zod";


const userValidationSchema = z.object({
    body: z.object({
        username: z.string().uuid().optional(),
        email: z.string().email({ message: "Invalid email address" }),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" }),
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        phone_number: z.string().optional(),
        is_staff: z.boolean().optional().default(false),
        is_superuser: z.boolean().optional().default(false),
    })
});

const refreshTokenValidation = z.object({
    body: z.object({
        refresh: z.string(),
    })
});


const loginDataValidationSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    })
});

export const UserValidation = {
    userValidationSchema,
    refreshTokenValidation,
    loginDataValidationSchema,
};