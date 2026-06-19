const getApiUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';
  } else {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    const hostname = window.location.hostname;
    return `http://${hostname}:3001`;
  }
};

const API_URL = getApiUrl();

export interface User {
  $id: string;
  email: string;
  name: string;
}

// Safely get JWT from cookies whether running on server or client
async function getSessionToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      return cookieStore.get('auth-session')?.value || null;
    } catch {
      return null;
    }
  } else {
    const match = document.cookie.match(/(^| )auth-session=([^;]+)/);
    return match ? match[2] : null;
  }
}

// Login
export async function login(email: string, password: string) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error('Invalid credentials or server error');
    }

    const data = await res.json(); // returns { jwt, user }

    // Set the cookie
    document.cookie = `auth-session=${data.jwt}; path=/; secure; samesite=lax; max-age=86400`;

    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

// Logout
export async function logout() {
  try {
    const token = await getSessionToken();
    if (token) {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error('Error logging out of backend:', error);
  } finally {
    // Always clear local cookie
    document.cookie = 'auth-session=; path=/; max-age=0';
  }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = await getSessionToken();
    if (!token) return null;

    const res = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return null;
    }

    return await res.ok ? res.json() : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Check if user is logged in
export async function isLoggedIn(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

// Update profile details
export async function updateProfile(data: { email?: string; password?: string; name?: string }): Promise<any> {
  try {
    const token = await getSessionToken();
    if (!token) throw new Error("Unauthorized");

    const res = await fetch(`${API_URL}/auth/update-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Failed to update profile");
    }

    return await res.json();
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}
