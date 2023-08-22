import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth].js';
import { dataBase } from './db';

export default async function handler(request, response) {
  const session = await getServerSession(request, response, authOptions);
  if (!session?.user?.email) {
    return response.status(200).json({
      success: false,
      data: [],
      error: 'Not logged in',
    });
  }

  if (request.method === 'GET') {
    try {
      const dreamsList = await dataBase
        .select('id', 'dream')
        .from('dreams')
        .where('dreams.user_id', '=', session?.user?.email)
        .executeStream();

      const results = [];
      for await (const row of dreamsList) {
        results.push(row);
      }

      response.status(200).json({
        success: true,
        data: results,
      });
    } catch (error) {
      return response.status(200).json({
        success: false,
        data: [],
        error: 'serve error' + error,
      });
    }
    return;
  }

  if (request.method === 'POST') {
    const dream = request.body;
    dream.user_id = session?.user?.email;
    await dataBase.insert('dreams').values(dream).execute();
    return response.status(200).json({
      success: true,
      data: dream,
    });
  }

  if (request.method === 'DELETE') {
    const dream = request.query;
    await dataBase
      .deleteFrom('dreams')
      .where('id', '=', dream.id?.toString() || '')
      .execute();
    return response.status(200).json({
      success: true,
      data: {},
    });
  }

  if (request.method === 'PUT') {
    const dream = request.body;
    const result = await dataBase
      .update('dreams')
      .set(dream)
      .where('id', '=', dream.id?.toString() || '')
      .execute();
    return response.status(200).json({
      success: true,
      data: { result },
    });
  }

  return response.status(200).json({
    success: false,
    data: [],
  });
}
