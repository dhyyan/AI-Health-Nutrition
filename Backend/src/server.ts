import app from './app';
import { CONFIG } from './shared/constants/config';
import { connectDatabase } from './framework/database/connection';

const startServer = async () => {
  await connectDatabase();

  const server = app.listen(CONFIG.PORT, () => {
    console.log(`🚀 Server running in ${CONFIG.NODE_ENV} mode on port ${CONFIG.PORT}`);
    console.log(`🔗 Health Check: http://localhost:${CONFIG.PORT}/api/health`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${CONFIG.PORT} is already in use by another process.`);
      console.error(`💡 Tip: Run 'npx kill-port ${CONFIG.PORT}' or kill PID listening on ${CONFIG.PORT}.`);
    } else {
      console.error('❌ Server startup error:', err);
    }
  });
};

startServer();
