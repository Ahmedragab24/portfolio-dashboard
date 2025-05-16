import { Client, Account } from "appwrite";

// Initialize the Appwrite client
const getClient = () => {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

  if (!endpoint || !projectId) {
    console.error("Appwrite environment variables are missing");
    return null;
  }

  try {
    return new Client().setEndpoint(endpoint).setProject(projectId);
  } catch (error) {
    console.error("Failed to initialize Appwrite client:", error);
    return null;
  }
};

// Initialize client and account
const client = getClient();
const account = client ? new Account(client) : null;

// Check if we can make auth API calls
const canMakeAuthCalls = () => {
  if (!client || !account) {
    console.error("Appwrite client or account not initialized");
    return false;
  }
  return true;
};

// User type
export interface User {
  $id: string;
  email: string;
  name: string;
}

// Login
// lib/auth.ts

export async function login(email: string, password: string) {
  if (!canMakeAuthCalls()) {
    throw new Error("Auth not initialized");
  }

  try {
    // 🔄 حاول حذف الجلسة الحالية أولاً إذا كانت موجودة
    try {
      await account!.deleteSession("current");
    } catch (err) {
      // تجاهل الخطأ إذا لم تكن هناك جلسة
      console.log("No active session to delete.");
    }

    // ✅ إنشاء جلسة جديدة
    await account!.createEmailPasswordSession(email, password);

    const jwt = await account!.createJWT();

    document.cookie = `appwrite-session=${jwt.jwt}; path=/; secure; samesite=lax; max-age=86400`;

    return jwt;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

// Logout
export async function logout() {
  if (!canMakeAuthCalls()) {
    throw new Error("Auth not initialized");
  }

  try {
    await account!.deleteSession("current");

    document.cookie = "appwrite-session=; path=/; max-age=0";
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}

// Get current user
export async function getCurrentUser() {
  if (!canMakeAuthCalls()) {
    return null;
  }

  try {
    const currentAccount = await account!.get();
    return currentAccount as User;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Check if user is logged in
export async function isLoggedIn() {
  if (!canMakeAuthCalls()) {
    return false;
  }

  try {
    const currentAccount = await account!.get();
    return !!currentAccount;
  } catch (error) {
    return false;
  }
}
