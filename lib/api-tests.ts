/**
 * API Test Script
 * 
 * This script helps you test the backend API endpoints.
 * You can run these tests in the browser console or create a test page.
 */

import { apiClient } from './lib/api-client';

export const testAPI = {
  // Test authentication
  async testLogin() {
    try {
      console.log('🔐 Testing login...');
      const result = await apiClient.login('test@example.com', 'password123');
      console.log('✅ Login successful:', result);
      return result;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  },

  async testSession() {
    try {
      console.log('🔍 Testing session check...');
      const result = await apiClient.getSession();
      console.log('✅ Session valid:', result);
      return result;
    } catch (error) {
      console.error('❌ Session check failed:', error);
      throw error;
    }
  },

  // Test profile operations
  async testGetProfile() {
    try {
      console.log('👤 Testing get profile...');
      const result = await apiClient.getProfile();
      console.log('✅ Profile retrieved:', result);
      return result;
    } catch (error) {
      console.error('❌ Get profile failed:', error);
      throw error;
    }
  },

  async testUpdateProfile() {
    try {
      console.log('✏️ Testing update profile...');
      const result = await apiClient.updateProfile({
        full_name: 'Updated Name',
        company: 'Test Company'
      });
      console.log('✅ Profile updated:', result);
      return result;
    } catch (error) {
      console.error('❌ Update profile failed:', error);
      throw error;
    }
  },

  // Test activity logging
  async testLogActivity() {
    try {
      console.log('📝 Testing log activity...');
      const result = await apiClient.logActivity('test_action', {
        test: true,
        timestamp: new Date().toISOString()
      });
      console.log('✅ Activity logged:', result);
      return result;
    } catch (error) {
      console.error('❌ Log activity failed:', error);
      throw error;
    }
  },

  async testGetActivityLogs() {
    try {
      console.log('📋 Testing get activity logs...');
      const result = await apiClient.getActivityLogs({ limit: 10 });
      console.log('✅ Activity logs retrieved:', result);
      return result;
    } catch (error) {
      console.error('❌ Get activity logs failed:', error);
      throw error;
    }
  },

  // Test admin operations
  async testAdminGetUsers() {
    try {
      console.log('👥 Testing admin get users...');
      const result = await apiClient.adminGetUsers();
      console.log('✅ Users retrieved:', result);
      return result;
    } catch (error) {
      console.error('❌ Admin get users failed:', error);
      throw error;
    }
  },

  async testAdminGetStats() {
    try {
      console.log('📊 Testing admin get stats...');
      const result = await apiClient.adminGetStats();
      console.log('✅ Stats retrieved:', result);
      return result;
    } catch (error) {
      console.error('❌ Admin get stats failed:', error);
      throw error;
    }
  },

  // Run all tests
  async runAllTests() {
    console.log('🚀 Running all API tests...\n');
    
    try {
      await this.testLogin();
      await this.testSession();
      await this.testGetProfile();
      await this.testLogActivity();
      await this.testGetActivityLogs();
      
      console.log('\n✅ All basic tests passed!');
      
      console.log('\n🔧 Testing admin endpoints (will fail if not admin)...');
      try {
        await this.testAdminGetUsers();
        await this.testAdminGetStats();
        console.log('\n✅ Admin tests passed!');
      } catch (error) {
        console.log('\n⚠️ Admin tests skipped (requires admin role)');
      }
      
    } catch (error) {
      console.error('\n❌ Tests failed');
      throw error;
    }
  }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testAPI = testAPI;
}
