import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

type RequestPath = 'body' | 'query' | 'params';

export const validate = (schema: z.ZodObject<any, any>, path: RequestPath = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[path]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {        
        const errorMessages = error.issues.map(issue => ({
            message: `${issue.path.join('.')} - ${issue.message}`,
        }))
        res.status(400).json({ error: 'Invalid data', details: errorMessages });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
};