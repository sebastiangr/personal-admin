import { Request, Response } from 'express';
import prisma from '../lib/db';

const getUserId = (req: Request) => req.user!.userId;

export const getAllLogs = async (req: Request, res: Response) => {
  try {
    const logs = await prisma.activityLog.findMany({      
      where: {
        company: {
          userId: getUserId(req),
        },
      },      
      orderBy: {
        createdAt: 'desc',
      },      
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(logs);

  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};