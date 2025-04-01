import { Request, Response } from 'express';
import { VisitorCounter } from '../models/VisitorCounter';
import { sendEmail } from '../services/emailService';

const MILESTONE_INTERVALS = [100, 500, 1000, 5000, 10000];

export const getVisitorCount = async (req: Request, res: Response): Promise<void> => {
  try {
    let counter = await VisitorCounter.findByPk(1);
    if (!counter) {
      counter = await VisitorCounter.create({
        id: 1,
        count: 0,
        last_updated: new Date(),
      });
    }
    res.status(200).json({ count: counter.count });
  } catch (error) {
    console.error('Error fetching visitor count:', error);
    res.status(500).json({ error: 'Failed to fetch visitor count' });
  }
};

export const incrementVisitorCount = async (req: Request, res: Response): Promise<void> => {
  try {
    let counter = await VisitorCounter.findByPk(1);
    if (!counter) {
      counter = await VisitorCounter.create({
        id: 1,
        count: 0,
        last_updated: new Date(),
      });
    }

    const newCount = counter.count + 1;
    await counter.update({ count: newCount });

    // Check for milestones
    const isMilestone = MILESTONE_INTERVALS.includes(newCount);
    if (isMilestone) {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'your-email@example.com',
        subject: `Milestone Reached: ${newCount} Visitors!`,
        text: `Congratulations! Your portfolio has reached ${newCount} visitors!`,
      });
    }

    res.status(200).json({ count: newCount });
  } catch (error) {
    console.error('Error incrementing visitor count:', error);
    res.status(500).json({ error: 'Failed to increment visitor count' });
  }
}; 