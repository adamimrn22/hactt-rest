import z from 'zod';

export const createProjectSchema = z.object({
    name: z.string('Please enter the project name').min(3).max(100),
    description: z.string().max(500).optional(),
    channelName: z.string().min(3).max(50).optional(),
});

export const updateProjectSchema = z.object({
    name: z.string().min(3).max(100).optional(),
    description: z.string().max(500).optional(),
    channelName: z.string().min(3).max(50).optional(),
});

const EnrollUsersToProjectSchema = z.array(
    z.object({
        userId: z.cuid2(),
        role: z.cuid(), // Define valid roles
    })
);
