import { Request, Response, NextFunction } from 'express';
import { sendEmail } from '../services/emailService';
import { Contact } from '../models/Contact';
import { AppError } from '../middleware/errorHandler';

export const sendContactEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, message } = req.body;

    // Save to database
    const contact = await Contact.create({
      name,
      email,
      message,
      status: 'pending',
    });

    // Send email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@example.com',
      subject: `New Contact Form Submission from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
    });

    res.status(200).json({
      status: 'success',
      message: 'Your message has been sent successfully',
      data: {
        id: contact.id,
      },
    });
  } catch (error) {
    next(new AppError('Failed to send message', 500));
  }
};

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const messages = await Contact.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      status: 'success',
      results: messages.length,
      data: messages,
    });
  } catch (error) {
    next(new AppError('Failed to get messages', 500));
  }
};

export const updateMessageStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'read', 'replied'].includes(status)) {
      return next(new AppError('Invalid status value', 400));
    }

    const message = await Contact.findByPk(id);

    if (!message) {
      return next(new AppError('Message not found', 404));
    }

    await message.update({ status });

    res.status(200).json({
      status: 'success',
      data: message,
    });
  } catch (error) {
    next(new AppError('Failed to update message status', 500));
  }
}; 