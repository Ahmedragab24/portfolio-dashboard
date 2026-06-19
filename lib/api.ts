import { unstable_noStore as noStore } from "next/cache";

const getApiUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://[IP_ADDRESS]';
  } else {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    const hostname = window.location.hostname;
    return `http://${hostname}:3001`;
  }
};

const API_URL = getApiUrl();

// Types and Interfaces
export type ProjectType =
  | "ecommerce"
  | "landing"
  | "website"
  | "dashboard"
  | "mobile"
  | "other";

export interface Project {
  $id?: string;
  title: string;
  description: string;
  image: string;
  DemoLink?: string;
  githubLink?: string;
  categories?: any[];
  Technologies?: string[];
  projectType?: ProjectType[];
}

export interface Category {
  $id?: string;
  name: string;
  project?: string[];
}

export interface Message {
  $id?: string;
  $createdAt?: string;
  name: string;
  email: string;
  message: string;
  PhoneNumber: string;
}

export interface VisitorStats {
  $id?: string;
  total_visits: number;
  last_updated: string;
}

export interface Review {
  $id?: string;
  $createdAt?: string;
  name: string;
  avatar: string;
  rating: number;
  review: string;
}

export interface Experience {
  $id?: string;
  $createdAt?: string;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  link?: string;
  titleLink?: string;
  arabicTitleLink?: string;
  motion: number;
  duration: number;
}

export interface Statistics {
  $id?: string;
  $createdAt?: string;
  title: string;
  arTitle: string;
  number: number;
}

export interface About {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  name: string;
  arabicName: string;
  position: string;
  arabicPosition: string;
  description: string;
  arabicDescription: string;
  CV: string;
  email: string;
  socialMedia: { name: string; link: string; icon: string }[];
}

export interface Certificates {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  name: string;
  certificate: string;
}

export type Priority = "Low" | "Medium" | "High";

export type TodoCategory =
  | "Worship"
  | "Personality"
  | "Programming"
  | "Work"
  | "Health"
  | "Other";

export interface TodoList {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  Title: string;
  Description: string;
  completed: boolean;
  Date: Date;
  Priority: Priority;
  Category: TodoCategory;
}

// Session Token helper (using auth-session cookie instead of appwrite-session)
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

// Fetch helper
async function apiFetch(path: string, options: RequestInit = {}) {
  const token = await getSessionToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API fetch failed with status ${response.status}: ${text}`);
  }

  // Handle DELETE or empty responses
  if (response.status === 204 || options.method === 'DELETE') {
    return true;
  }

  return response.json();
}

// Projects
export async function getProjects(): Promise<Project[]> {
  noStore();
  try {
    return await apiFetch('/projects');
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getProject(id: string): Promise<Project> {
  noStore();
  return await apiFetch(`/projects/${id}`);
}

export async function createProject(project: Project): Promise<Project> {
  const categories = project.categories?.map(c => typeof c === 'object' ? c.$id || c.id : c) || [];
  return await apiFetch('/projects', {
    method: 'POST',
    body: JSON.stringify({ ...project, categories }),
  });
}

export async function updateProject(id: string, project: Partial<Project>): Promise<Project> {
  const categories = project.categories?.map(c => typeof c === 'object' ? c.$id || c.id : c);
  return await apiFetch(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...project, ...(categories !== undefined ? { categories } : {}) }),
  });
}

export async function deleteProject(id: string): Promise<boolean> {
  await apiFetch(`/projects/${id}`, {
    method: 'DELETE',
  });
  return true;
}

// Categories
export async function getCategories(): Promise<Category[]> {
  noStore();
  try {
    return await apiFetch('/categories');
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getCategory(id: string): Promise<Category> {
  noStore();
  return await apiFetch(`/categories/${id}`);
}

export async function createCategory(category: { name: string }): Promise<Category> {
  return await apiFetch('/categories', {
    method: 'POST',
    body: JSON.stringify(category),
  });
}

export async function updateCategory(id: string, category: { name: string }): Promise<Category> {
  return await apiFetch(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(category),
  });
}

export async function deleteCategory(id: string): Promise<boolean> {
  await apiFetch(`/categories/${id}`, {
    method: 'DELETE',
  });
  return true;
}

// Messages
export async function getMessages(): Promise<Message[]> {
  noStore();
  try {
    return await apiFetch('/messages');
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

export async function getMessage(id: string): Promise<Message> {
  noStore();
  return await apiFetch(`/messages/${id}`);
}

export async function createMessage(message: Message): Promise<Message> {
  return await apiFetch('/messages', {
    method: 'POST',
    body: JSON.stringify(message),
  });
}

export async function deleteMessage(id: string): Promise<boolean> {
  await apiFetch(`/messages/${id}`, {
    method: 'DELETE',
  });
  return true;
}

// Visitor Statistics
export async function getVisitorStats(): Promise<VisitorStats> {
  noStore();
  try {
    return await apiFetch('/visitor-stats');
  } catch (error) {
    console.error("Error fetching visitor stats:", error);
    return { total_visits: 0, last_updated: new Date().toISOString() };
  }
}

export async function incrementVisitorStats(): Promise<any> {
  return await apiFetch('/visitor-stats/increment', {
    method: 'POST',
  });
}

export async function incrementVisitorCount(): Promise<any> {
  return incrementVisitorStats();
}

// Reviews
export async function getReviews(): Promise<Review[]> {
  noStore();
  try {
    return await apiFetch('/reviews');
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

export async function getReview(id: string): Promise<Review> {
  noStore();
  return await apiFetch(`/reviews/${id}`);
}

export async function createReview(review: Review): Promise<Review> {
  return await apiFetch('/reviews', {
    method: 'POST',
    body: JSON.stringify(review),
  });
}

export async function updateReview(id: string, review: Partial<Review>): Promise<Review> {
  return await apiFetch(`/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(review),
  });
}

export async function deleteReview(id: string): Promise<boolean> {
  await apiFetch(`/reviews/${id}`, {
    method: 'DELETE',
  });
  return true;
}

// Experiences
export async function getExperiences(): Promise<Experience[]> {
  noStore();
  try {
    return await apiFetch('/experiences');
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }
}

export async function getExperience(id: string): Promise<Experience> {
  noStore();
  return await apiFetch(`/experiences/${id}`);
}

export async function createExperience(experience: Experience): Promise<Experience> {
  return await apiFetch('/experiences', {
    method: 'POST',
    body: JSON.stringify(experience),
  });
}

export async function updateExperience(id: string, experience: Partial<Experience>): Promise<Experience> {
  return await apiFetch(`/experiences/${id}`, {
    method: 'PUT',
    body: JSON.stringify(experience),
  });
}

export async function deleteExperience(id: string): Promise<boolean> {
  await apiFetch(`/experiences/${id}`, {
    method: 'DELETE',
  });
  return true;
}

// Statistics
export async function getStatistics(): Promise<Statistics[]> {
  noStore();
  try {
    return await apiFetch('/statistics');
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return [];
  }
}

export async function getStatistic(id: string): Promise<Statistics> {
  noStore();
  return await apiFetch(`/statistics/${id}`);
}

export async function createStatistics(stats: Statistics): Promise<Statistics> {
  return await apiFetch('/statistics', {
    method: 'POST',
    body: JSON.stringify(stats),
  });
}

export async function updateStatistics(id: string, stats: Partial<Statistics>): Promise<Statistics> {
  return await apiFetch(`/statistics/${id}`, {
    method: 'PUT',
    body: JSON.stringify(stats),
  });
}

export async function deleteStatistics(id: string): Promise<boolean> {
  await apiFetch(`/statistics/${id}`, {
    method: 'DELETE',
  });
  return true;
}

// About
export async function getAbout(): Promise<About> {
  noStore();
  return await apiFetch('/about');
}

export async function createAbout(about: About): Promise<About> {
  return await apiFetch('/about', {
    method: 'POST',
    body: JSON.stringify(about),
  });
}

export async function updateAbout(id: string, about: Partial<About>): Promise<About> {
  return await apiFetch(`/about/${id}`, {
    method: 'PUT',
    body: JSON.stringify(about),
  });
}

export async function deleteAbout(id: string): Promise<boolean> {
  await apiFetch(`/about/${id}`, {
    method: 'DELETE',
  });
  return true;
}

// Certificates
export async function getCertificates(): Promise<Certificates[]> {
  noStore();
  try {
    return await apiFetch('/certificates');
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return [];
  }
}

export async function getCertificate(id: string): Promise<Certificates> {
  noStore();
  return await apiFetch(`/certificates/${id}`);
}

export async function createCertificate(cert: Certificates): Promise<Certificates> {
  return await apiFetch('/certificates', {
    method: 'POST',
    body: JSON.stringify(cert),
  });
}

export async function updateCertificate(id: string, cert: Partial<Certificates>): Promise<Certificates> {
  return await apiFetch(`/certificates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(cert),
  });
}

export async function deleteCertificate(id: string): Promise<boolean> {
  await apiFetch(`/certificates/${id}`, {
    method: 'DELETE',
  });
  return true;
}

// Todos
export async function getTodos(): Promise<TodoList[]> {
  noStore();
  try {
    return await apiFetch('/todos');
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
}

export async function getTodo(id: string): Promise<TodoList> {
  noStore();
  return await apiFetch(`/todos/${id}`);
}

export async function createTodo(todo: Omit<TodoList, "$id" | "$createdAt" | "$updatedAt">): Promise<TodoList> {
  return await apiFetch('/todos', {
    method: 'POST',
    body: JSON.stringify(todo),
  });
}

export async function updateTodo(id: string, todo: Partial<TodoList>): Promise<TodoList> {
  return await apiFetch(`/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(todo),
  });
}

export async function deleteTodo(id: string): Promise<boolean> {
  await apiFetch(`/todos/${id}`, {
    method: 'DELETE',
  });
  return true;
}
