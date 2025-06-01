import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';

// Load environment variables from .env file
dotenvConfig({ path: join(process.cwd(), '.env') });

export const config = {
  // Gmail configuration
  gmail: {
    password: process.env.GMAIL_APP_PASSWORD || '',
    user: process.env.GMAIL_USER || ''
  },
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Server configuration
  port: parseInt(process.env.PORT || '3000', 10)
};
