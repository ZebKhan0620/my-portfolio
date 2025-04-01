import { Request, Response } from 'express';
import { FAQ } from '../models/FAQ';

export const getFAQs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    const where: any = { active: true };

    if (category) {
      where.category = category;
    }

    const faqs = await FAQ.findAll({
      where,
      order: [
        ['category', 'ASC'],
        ['display_order', 'ASC'],
      ],
    });

    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
};

export const createFAQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const { question, answer, category, display_order } = req.body;

    if (!question || !answer) {
      res.status(400).json({ error: 'Question and answer are required' });
      return;
    }

    const faq = await FAQ.create({
      question,
      answer,
      category: category || 'general',
      display_order: display_order || 0,
      active: true,
    });

    res.status(201).json(faq);
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ error: 'Failed to create FAQ' });
  }
};

export const updateFAQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { question, answer, category, display_order, active } = req.body;

    const faq = await FAQ.findByPk(id);
    if (!faq) {
      res.status(404).json({ error: 'FAQ not found' });
      return;
    }

    await faq.update({
      question,
      answer,
      category,
      display_order,
      active,
    });

    res.json(faq);
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
};

export const deleteFAQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findByPk(id);
    if (!faq) {
      res.status(404).json({ error: 'FAQ not found' });
      return;
    }

    await faq.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
}; 