import prisma from './db';

export async function createNotification({
  userId,
  type,
  title,
  message,
  link
}: {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
}) {
  try {
    await prisma.notification.create({
      data: { userId, type, title, message, link }
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
}
