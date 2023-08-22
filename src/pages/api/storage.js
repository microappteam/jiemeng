import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth].js';
import { createKysely } from '@vercel/postgres-kysely';
import http from 'http';

const dataBase = createKysely();

const server = http.createServer(async (request, response) => {
  const session = await getServerSession(request, response, authOptions);
  console.log('session:', session);
  if (!session?.user?.email) {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        success: false,
        data: [],
        error: 'Not logged in',
      }),
    );
    return;
  }

  if (request.method === 'GET') {
    try {
      const dreamsList = await dataBase
        .selectFrom('dreams')
        .select(['id', 'dream'])
        .where('dreams.user_id', '=', session?.user?.email)
        .execute();

      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(
        JSON.stringify({
          success: true,
          data: dreamsList,
        }),
      );
    } catch (error) {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(
        JSON.stringify({
          success: false,
          data: [],
          error: 'serve error' + error,
        }),
      );
    }
    return;
  }

  if (request.method === 'POST') {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', async () => {
      const dream = JSON.parse(body);
      dream.user_id = session?.user?.email;
      await dataBase.insertInto('dreams').values(dream).execute();

      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(
        JSON.stringify({
          success: true,
          data: dream,
        }),
      );
    });
    return;
  }

  if (request.method === 'DELETE') {
    const dream = request.query;
    await dataBase
      .deleteFrom('dreams')
      .where('id', '=', dream.id?.toString() || '')
      .execute();

    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        success: true,
        data: {},
      }),
    );
    return;
  }

  if (request.method === 'PUT') {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', async () => {
      const dream = JSON.parse(body);
      const result = await dataBase
        .updateTable('dreams')
        .set(dream)
        .where('id', '=', dream.id?.toString() || '')
        .execute();

      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(
        JSON.stringify({
          success: true,
          data: { result },
        }),
      );
    });
    return;
  }

  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(
    JSON.stringify({
      success: false,
      data: [],
    }),
  );
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
