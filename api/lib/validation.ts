import { z } from 'zod';

export const validationSchemas = {
  job: z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(10).max(5000),
    requirements: z.array(z.string().min(1)).max(20),
    location: z.string().min(1),
    salary_range: z.object({
      min: z.number().min(0),
      max: z.number().min(0)
    }),
    employment_type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'REMOTE'])
  }),
  
  profile: z.object({
    full_name: z.string().min(1).max(100),
    bio: z.string().max(1000).optional(),
    skills: z.array(z.string()).max(50),
    experience: z.number().min(0).max(50)
  }),
  
  application: z.object({
    job_id: z.string().uuid(),
    cover_letter: z.string().max(2000).optional()
  })
};
