import app from './app';
import { CONFIG } from './shared/constants/config';
import { connectDatabase } from './framework/database/connection';

const startServer = async () => {
  await connectDatabase();

  app.listen(CONFIG.PORT, () => {
    console.log(`🚀 Server running in ${CONFIG.NODE_ENV} mode on port ${CONFIG.PORT}`);
    console.log(`🔗 Health Check: http://localhost:${CONFIG.PORT}/api/health`);
  });
};

startServer();
