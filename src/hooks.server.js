import { createSocketIOServer } from '$lib/socketHandler.js';

export function handleSocketIO(server) {
  const io = createSocketIOServer(server);

  return {
    name: 'socket-io-handler',
    configureServer(app) {
      app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
        next();
      });
    },
    async handle({ event, resolve }) {
      const response = await resolve(event);
      return response;
    },
  };
}