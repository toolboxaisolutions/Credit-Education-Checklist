import dotenv from 'dotenv';
dotenv.config();

import { ghlService } from './index';

// Test connection
async function test() {
  try {
    console.log('Testing GHL connection...');
    console.log('API Key set:', !!process.env.GHL_API_KEY);
    console.log('Location ID set:', !!process.env.GHL_LOCATION_ID);
    console.log('Connected:', ghlService.isConnected());

    // Try a simple call
    const testContact = await ghlService.getContactByPhone('+14155551234');
    console.log('Test result:', testContact);
    console.log('✅ GHL connection working!');
  } catch (error) {
    console.error('❌ GHL connection test failed:', error);
    process.exit(1);
  }
}

test();
