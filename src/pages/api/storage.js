import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth].api';
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
        .selectFrom('dreams')
        .select(['id', 'dream', 'user_id', 'username', 'created_at'])
        .where('user_id', '=', session?.user?.email)
        .execute();

      response.status(200).json({
        success: true,
        data: dreamsList,
      });
    } catch (error) {
      return response.status(200).json({
        success: false,
        data: [],
        error: 'server error: ' + error,
      });
    }
    return;
  }

  if (request.method === 'POST') {
    const dream = request.body;
    dream.user_id = session?.user?.email;
    await dataBase.insertInto('dreams').values(dream).execute();
    return response.status(200).json({
      success: true,
      data: dream,
    });
  }

  if (request.method === 'DELETE') {
    const { id } = request.query;
    await dataBase
      .deleteFrom('dreams')
      .where('id', '=', id?.toString() || '')
      .execute();
    return response.status(200).json({
      success: true,
      data: {},
    });
  }

  if (request.method === 'PUT') {
    const dream = request.body;
    const result = await dataBase
      .updateTable('dreams')
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
