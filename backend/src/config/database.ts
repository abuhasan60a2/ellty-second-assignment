import mongoose from 'mongoose';
import { config } from './env';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('✅ Connected to MongoDB successfully');
  } catch (error: any) {
    console.error('❌ MongoDB connection error:', error.message);
    
    // Provide helpful error messages
    if (error.code === 8000 || error.codeName === 'AtlasError') {
      console.error('\n🔍 MongoDB Atlas Authentication Failed. Common fixes:');
      console.error('1. Check if your password contains special characters (@, #, %, &, etc.)');
      console.error('   → These need to be URL-encoded in the connection string');
      console.error('   → Example: @ becomes %40, # becomes %23');
      console.error('2. Verify your username and password are correct');
      console.error('3. Check if your IP address is whitelisted in MongoDB Atlas');
      console.error('4. Ensure your connection string format is correct:');
      console.error('   mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority');
    }
    
    // Don't exit the process, allow server to run without DB
    console.error('⚠️  Server will continue running, but database features will not work.\n');
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error: any) {
    console.error('Error disconnecting from MongoDB:', error.message);
  }
};

