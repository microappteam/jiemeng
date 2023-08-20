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
      const workflowList = await dataBase
        .selectFrom('workflow')
        .select(['id', 'workflow'])
        .where('workflow.user_id', '=', session?.user?.email)
        .execute();

      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(
        JSON.stringify({
          success: true,
          data: workflowList,
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
      const workflow = JSON.parse(body);
      workflow.user_id = session?.user?.email;
      await dataBase.insertInto('workflow').values(workflow).execute();

      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(
        JSON.stringify({
          success: true,
          data: workflow,
        }),
      );
    });
    return;
  }

  if (request.method === 'DELETE') {
    const workflow = request.query;
    await dataBase
      .deleteFrom('workflow')
      .where('id', '=', workflow.id?.toString() || '')
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
      const workflow = JSON.parse(body);
      const result = await dataBase
        .updateTable('workflow')
        .set(workflow)
        .where('id', '=', workflow.id?.toString() || '')
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
