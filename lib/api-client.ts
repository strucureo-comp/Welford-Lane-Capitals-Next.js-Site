// API client utilities for making authenticated requests

export class APIClient {
  private baseURL = '/api';

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  }

  async logout() {
    const response = await fetch(`${this.baseURL}/auth/logout`, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Logout failed');
    }

    return response.json();
  }

  async signup(data: {
    email: string;
    password: string;
    full_name: string;
    role?: string;
    company?: string;
  }) {
    const response = await fetch(`${this.baseURL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }

    return response.json();
  }

  async getSession() {
    const response = await fetch(`${this.baseURL}/auth/session`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Session check failed');
    }

    return response.json();
  }

  // Profile endpoints
  async getProfile() {
    const response = await fetch(`${this.baseURL}/profile`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get profile');
    }

    return response.json();
  }

  async updateProfile(updates: Record<string, any>) {
    const response = await fetch(`${this.baseURL}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update profile');
    }

    return response.json();
  }

  async getProfiles() {
    const response = await fetch(`${this.baseURL}/profiles`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get profiles');
    }

    return response.json();
  }

  async getProfileById(id: string) {
    const response = await fetch(`${this.baseURL}/profiles/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get profile');
    }

    return response.json();
  }

  // Activity logs
  async getActivityLogs(params?: { limit?: number; offset?: number }) {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());

    const response = await fetch(`${this.baseURL}/activity?${query}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get activity logs');
    }

    return response.json();
  }

  async logActivity(action: string, details?: Record<string, any>) {
    const response = await fetch(`${this.baseURL}/activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, details }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to log activity');
    }

    return response.json();
  }

  async getUserActivityLogs(
    userId: string,
    params?: { limit?: number; offset?: number }
  ) {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());

    const response = await fetch(`${this.baseURL}/activity/user/${userId}?${query}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get user activity logs');
    }

    return response.json();
  }

  // Admin endpoints
  async adminGetUsers() {
    const response = await fetch(`${this.baseURL}/admin/users`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get users');
    }

    return response.json();
  }

  async adminCreateUser(data: {
    email: string;
    password: string;
    full_name: string;
    role?: string;
    company?: string;
    aum?: number;
  }) {
    const response = await fetch(`${this.baseURL}/admin/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create user');
    }

    return response.json();
  }

  async adminGetStats() {
    const response = await fetch(`${this.baseURL}/admin/stats`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get stats');
    }

    return response.json();
  }

  async adminGetActivityLogs(params?: { limit?: number; offset?: number }) {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());

    const response = await fetch(`${this.baseURL}/admin/activity?${query}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get activity logs');
    }

    return response.json();
  }

  async adminUpdateProfile(userId: string, updates: Record<string, any>) {
    const response = await fetch(`${this.baseURL}/profiles/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update profile');
    }

    return response.json();
  }

  async adminDeleteProfile(userId: string) {
    const response = await fetch(`${this.baseURL}/profiles/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete profile');
    }

    return response.json();
  }
}

export const apiClient = new APIClient();
