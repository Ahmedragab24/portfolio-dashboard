import { Client, Databases, ID } from "appwrite";
import { number } from "zod";

// Initialize the Appwrite client with better error handling
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

// Initialize client and databases with safety checks
const client = getClient();
const databases = client ? new Databases(client) : null;

// Database and collection IDs
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
const PROJECTS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID || "";
const CATEGORIES_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID || "";
const MESSAGES_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID || "";
const REVIEWS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID || "";
const EXPERIENCE_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_EXPERIENCE_COLLECTION_ID || "";
const STATISTICS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_STATISTICS_COLLECTION_ID || "";
const ABOUT_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_ABOUT_COLLECTION_ID || "";
const CERTIFICATES_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_CERTIFICATES_COLLECTION_ID || "";

// Project type based on your schema
export interface Project {
  $id?: string;
  title: string;
  description: string;
  image: string;
  DemoLink?: string;
  githubLink?: string;
  categories?: string[];
  Technologies?: string[];
}

// Category type based on your schema
export interface Category {
  $id?: string;
  name: string;
  project?: string[];
}

// Message type based on your schema
export interface Message {
  $id?: string;
  $createdAt?: string;
  name: string;
  email: string;
  message: string;
  PhoneNumber: string;
}

// Add these to your existing types
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
  $id: string;
  $createdAt: string;
  $updatedAt: string;
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

// Check if we can make API calls
const canMakeApiCalls = () => {
  if (!client || !databases) {
    console.error("Appwrite client or databases not initialized");
    return false;
  }

  if (!DATABASE_ID) {
    console.error("Database ID is missing");
    return false;
  }

  return true;
};

// Get all projects
export async function getProjects() {
  if (!canMakeApiCalls() || !PROJECTS_COLLECTION_ID) {
    console.error("Cannot fetch projects: Missing configuration");
    return [];
  }

  try {
    const response = await databases!.listDocuments(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID
    );
    return response.documents as unknown as Project[];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

// Get a single project
export async function getProject(id: string) {
  if (!canMakeApiCalls() || !PROJECTS_COLLECTION_ID) {
    console.error("Cannot fetch project: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    const response = await databases!.getDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      id
    );
    return response as unknown as Project;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
}

// Create a new project
export async function createProject(project: Project) {
  if (!canMakeApiCalls() || !PROJECTS_COLLECTION_ID) {
    console.error("Cannot create project: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    const response = await databases!.createDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      ID.unique(),
      project
    );
    return response as unknown as Project;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

// Update a project
export async function updateProject(id: string, project: Partial<Project>) {
  if (!canMakeApiCalls() || !PROJECTS_COLLECTION_ID) {
    console.error("Cannot update project: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    const response = await databases!.updateDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      id,
      project
    );
    return response as unknown as Project;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

// Delete a project
export async function deleteProject(id: string) {
  if (!canMakeApiCalls() || !PROJECTS_COLLECTION_ID) {
    console.error("Cannot delete project: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    await databases!.deleteDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, id);
    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}

// Get all categories
export async function getCategories() {
  if (!canMakeApiCalls() || !CATEGORIES_COLLECTION_ID) {
    console.error("Cannot fetch categories: Missing configuration");
    return [];
  }

  try {
    const response = await databases!.listDocuments(
      DATABASE_ID,
      CATEGORIES_COLLECTION_ID
    );
    return response.documents as unknown as Category[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Create a new category
export async function createCategory(category: Category) {
  if (!canMakeApiCalls() || !CATEGORIES_COLLECTION_ID) {
    console.error("Cannot create category: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    const response = await databases!.createDocument(
      DATABASE_ID,
      CATEGORIES_COLLECTION_ID,
      ID.unique(),
      category
    );
    return response as unknown as Category;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

// Delete a category
export async function deleteCategory(id: string) {
  if (!canMakeApiCalls() || !CATEGORIES_COLLECTION_ID) {
    console.error("Cannot delete category: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    await databases!.deleteDocument(DATABASE_ID, CATEGORIES_COLLECTION_ID, id);
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}

// Get all messages
export async function getMessages() {
  if (!canMakeApiCalls() || !MESSAGES_COLLECTION_ID) {
    console.error("Cannot fetch messages: Missing configuration");
    return [];
  }

  try {
    const response = await databases!.listDocuments(
      DATABASE_ID,
      MESSAGES_COLLECTION_ID
    );
    return response.documents as unknown as Message[];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

// Get a single message
export async function getMessage(id: string) {
  if (!canMakeApiCalls() || !MESSAGES_COLLECTION_ID) {
    console.error("Cannot fetch message: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    const response = await databases!.getDocument(
      DATABASE_ID,
      MESSAGES_COLLECTION_ID,
      id
    );
    return response as unknown as Message;
  } catch (error) {
    console.error("Error fetching message:", error);
    throw error;
  }
}

// Delete a message
export async function deleteMessage(id: string) {
  if (!canMakeApiCalls() || !MESSAGES_COLLECTION_ID) {
    console.error("Cannot delete message: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    await databases!.deleteDocument(DATABASE_ID, MESSAGES_COLLECTION_ID, id);
    return true;
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
}

// Add these functions to your appwrite.ts file
// Get visitor stats
export async function getVisitorStats() {
  if (!canMakeApiCalls() || !DATABASE_ID) {
    console.error("Cannot fetch visitor stats: Missing configuration");
    return { total_visits: 0, last_updated: new Date().toISOString() };
  }

  try {
    // We'll use a single document to store the visitor count
    const VISITOR_STATS_COLLECTION_ID =
      process.env.NEXT_PUBLIC_APPWRITE_VISITOR_STATS_COLLECTION_ID || "";
    const VISITOR_STATS_DOCUMENT_ID = "total_visits";

    if (!VISITOR_STATS_COLLECTION_ID) {
      return { total_visits: 0, last_updated: new Date().toISOString() };
    }

    try {
      // Try to get the existing document
      const response = await databases!.getDocument(
        DATABASE_ID,
        VISITOR_STATS_COLLECTION_ID,
        VISITOR_STATS_DOCUMENT_ID
      );
      return response as unknown as VisitorStats;
    } catch (error) {
      // If document doesn't exist, create it
      const newStats = {
        total_visits: 0,
        last_updated: new Date().toISOString(),
      };

      await databases!.createDocument(
        DATABASE_ID,
        VISITOR_STATS_COLLECTION_ID,
        VISITOR_STATS_DOCUMENT_ID,
        newStats
      );

      return newStats as VisitorStats;
    }
  } catch (error) {
    console.error("Error fetching visitor stats:", error);
    return { total_visits: 0, last_updated: new Date().toISOString() };
  }
}

// Increment visitor count
export async function incrementVisitorCount() {
  if (!canMakeApiCalls() || !DATABASE_ID) {
    console.error("Cannot update visitor count: Missing configuration");
    return false;
  }

  try {
    const VISITOR_STATS_COLLECTION_ID =
      process.env.NEXT_PUBLIC_APPWRITE_VISITOR_STATS_COLLECTION_ID || "";
    const VISITOR_STATS_DOCUMENT_ID = "total_visits";

    if (!VISITOR_STATS_COLLECTION_ID) {
      return false;
    }

    // Get current stats
    let currentStats: VisitorStats;

    try {
      // Try to get the existing document
      currentStats = (await databases!.getDocument(
        DATABASE_ID,
        VISITOR_STATS_COLLECTION_ID,
        VISITOR_STATS_DOCUMENT_ID
      )) as unknown as VisitorStats;
    } catch (error) {
      // If document doesn't exist, create it
      currentStats = {
        total_visits: 0,
        last_updated: new Date().toISOString(),
      };
    }

    // Increment the count
    const updatedStats = {
      total_visits: currentStats.total_visits + 1,
      last_updated: new Date().toISOString(),
    };

    // Update or create the document
    try {
      await databases!.updateDocument(
        DATABASE_ID,
        VISITOR_STATS_COLLECTION_ID,
        VISITOR_STATS_DOCUMENT_ID,
        updatedStats
      );
    } catch (error) {
      await databases!.createDocument(
        DATABASE_ID,
        VISITOR_STATS_COLLECTION_ID,
        VISITOR_STATS_DOCUMENT_ID,
        updatedStats
      );
    }

    return true;
  } catch (error) {
    console.error("Error updating visitor count:", error);
    return false;
  }
}

// Get all reviews
export async function getReviews() {
  if (!canMakeApiCalls() || !REVIEWS_COLLECTION_ID || !databases) {
    console.error("Cannot fetch reviews: Missing configuration");
    return [];
  }

  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      REVIEWS_COLLECTION_ID
    );
    return response.documents as unknown as Review[];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

// Get a single review
export async function getReview(id: string) {
  if (!databases || !DATABASE_ID || !REVIEWS_COLLECTION_ID) {
    console.error("Cannot fetch review: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    const response = await databases.getDocument(
      DATABASE_ID,
      REVIEWS_COLLECTION_ID,
      id
    );
    return response as unknown as Review;
  } catch (error) {
    console.error("Error fetching review:", error);
    throw error;
  }
}

// Create a new review
export async function createReview(review: Review) {
  if (!databases || !DATABASE_ID || !REVIEWS_COLLECTION_ID) {
    console.error("Cannot create review: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    // Set default approved status to false if not provided
    const reviewData = {
      ...review,
    };

    const response = await databases.createDocument(
      DATABASE_ID,
      REVIEWS_COLLECTION_ID,
      ID.unique(),
      reviewData
    );
    return response as unknown as Review;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
}

// Update a review
export async function updateReview(id: string, review: Partial<Review>) {
  if (!databases || !DATABASE_ID || !REVIEWS_COLLECTION_ID) {
    console.error("Cannot update review: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    const {
      $id,
      $createdAt,
      $databaseId,
      $collectionId,
      $updatedAt,
      ...cleanReview
    } = review as any;

    const response = await databases.updateDocument(
      DATABASE_ID,
      REVIEWS_COLLECTION_ID,
      id,
      cleanReview
    );
    return response as unknown as Review;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
}

// Delete a review
export async function deleteReview(id: string) {
  if (!databases || !DATABASE_ID || !REVIEWS_COLLECTION_ID) {
    console.error("Cannot delete review: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    await databases.deleteDocument(DATABASE_ID, REVIEWS_COLLECTION_ID, id);
    return true;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
}

// Get All Experiences
export async function getExperiences() {
  if (!canMakeApiCalls() || !EXPERIENCE_COLLECTION_ID) {
    console.error("Cannot fetch experiences: Missing configuration");
    return [];
  }

  try {
    const response = await databases!.listDocuments(
      DATABASE_ID,
      EXPERIENCE_COLLECTION_ID
    );
    return response.documents as unknown as Experience[];
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }
}

// Get a single experience
export async function getExperience(id: string) {
  if (!canMakeApiCalls() || !EXPERIENCE_COLLECTION_ID) {
    console.error("Cannot fetch experience: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    const response = await databases!.getDocument(
      DATABASE_ID,
      EXPERIENCE_COLLECTION_ID,
      id
    );
    return response as unknown as Experience;
  } catch (error) {
    console.error("Error fetching experience:", error);
    throw error;
  }
}

// Create a new experience
export async function createExperience(experience: Experience) {
  if (!canMakeApiCalls() || !EXPERIENCE_COLLECTION_ID) {
    console.error("Cannot create experience: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    const response = await databases!.createDocument(
      DATABASE_ID,
      EXPERIENCE_COLLECTION_ID,
      ID.unique(),
      experience
    );
    return response as unknown as Experience;
  } catch (error) {
    console.error("Error creating experience:", error);
    throw error;
  }
}

// Update an experience
export async function updateExperience(
  id: string,
  experience: Partial<Experience>
) {
  if (!canMakeApiCalls() || !EXPERIENCE_COLLECTION_ID) {
    console.error("Cannot update experience: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    // Create a clean copy without system properties
    const {
      $id,
      $createdAt,
      $databaseId,
      $collectionId,
      $updatedAt,
      ...cleanExperience
    } = experience as any;

    const response = await databases!.updateDocument(
      DATABASE_ID,
      EXPERIENCE_COLLECTION_ID,
      id,
      cleanExperience
    );
    return response as unknown as Experience;
  } catch (error) {
    console.error("Error updating experience:", error);
    throw error;
  }
}

// Delete an experience
export async function deleteExperience(id: string) {
  if (!canMakeApiCalls() || !EXPERIENCE_COLLECTION_ID) {
    console.error("Cannot delete experience: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    await databases!.deleteDocument(DATABASE_ID, EXPERIENCE_COLLECTION_ID, id);
    return true;
  } catch (error) {
    console.error("Error deleting experience:", error);
    throw error;
  }
}
// Get All Statistics
export async function getStatistics() {
  if (!canMakeApiCalls() || !STATISTICS_COLLECTION_ID) {
    console.error("Cannot fetch statistics: Missing configuration");
    return [];
  }

  try {
    const response = await databases!.listDocuments(
      DATABASE_ID,
      STATISTICS_COLLECTION_ID
    );
    return response.documents as unknown as Statistics[];
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return [];
  }
}

// Get a single Statistics
export async function getStatistic(id: string) {
  if (!canMakeApiCalls() || !STATISTICS_COLLECTION_ID) {
    console.error("Cannot fetch statistics: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    const response = await databases!.getDocument(
      DATABASE_ID,
      STATISTICS_COLLECTION_ID,
      id
    );
    return response as unknown as Statistics;
  } catch (error) {
    console.error("Error fetching statistics:", error);
    throw error;
  }
}

// Create a new Statistics
export async function createStatistics(statistics: Statistics) {
  if (!canMakeApiCalls() || !STATISTICS_COLLECTION_ID) {
    console.error("Cannot create statistics: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    const response = await databases!.createDocument(
      DATABASE_ID,
      STATISTICS_COLLECTION_ID,
      ID.unique(),
      statistics
    );
    return response as unknown;
  } catch (error) {
    console.error("Error creating statistics:", error);
    throw error;
  }
}

// Update an Statistics
export async function updateStatistics(
  id: string,
  statistics: Partial<Statistics>
) {
  if (!canMakeApiCalls() || !STATISTICS_COLLECTION_ID) {
    console.error("Cannot update statistics: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    // Create a clean copy without system properties
    const {
      $id,
      $createdAt,
      $databaseId,
      $collectionId,
      $updatedAt,
      ...cleanStatistics
    } = statistics as any;

    const response = await databases!.updateDocument(
      DATABASE_ID,
      STATISTICS_COLLECTION_ID,
      id,
      cleanStatistics
    );
    return response as unknown as Experience;
  } catch (error) {
    console.error("Error updating statistics:", error);
    throw error;
  }
}

// Delete an experience
export async function deleteStatistics(id: string) {
  if (!canMakeApiCalls() || !STATISTICS_COLLECTION_ID) {
    console.error("Cannot delete statistics: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    await databases!.deleteDocument(DATABASE_ID, STATISTICS_COLLECTION_ID, id);
    return true;
  } catch (error) {
    console.error("Error deleting statistics:", error);
    throw error;
  }
}

// Get about information
export async function getAbout() {
  if (!canMakeApiCalls() || !ABOUT_COLLECTION_ID) {
    console.error("Cannot fetch about information: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    // Since we expect only one about document, we'll get the first one
    const response = await databases!.listDocuments(
      DATABASE_ID,
      ABOUT_COLLECTION_ID
    );

    if (response.documents.length === 0) {
      // Create a default about document if none exists
      const defaultAbout: About = {
        $id: "",
        $createdAt: "",
        $updatedAt: "",
        name: "Your Name",
        arabicName: "اسمك",
        position: "Your Position",
        arabicPosition: "منصبك",
        description: "Your description goes here.",
        arabicDescription: "وصفك يذهب هنا.",
        CV: "",
        email: "your.email@example.com",
        socialMedia: [
          {
            name: "GitHub",
            link: "https://github.com/yourusername",
            icon: "github",
          },
        ],
      };

      return await createAbout(defaultAbout);
    }

    return response.documents[0] as unknown as About;
  } catch (error) {
    console.error("Error fetching about information:", error);
    throw error;
  }
}

// Create about information
export async function createAbout(about: About) {
  if (!canMakeApiCalls() || !ABOUT_COLLECTION_ID) {
    console.error("Cannot create about information: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    const response = await databases!.createDocument(
      DATABASE_ID,
      ABOUT_COLLECTION_ID,
      ID.unique(),
      about
    );
    return response as unknown as About;
  } catch (error) {
    console.error("Error creating about information:", error);
    throw error;
  }
}

// Update about information
export async function updateAbout(id: string, about: Partial<About>) {
  if (!canMakeApiCalls() || !ABOUT_COLLECTION_ID) {
    console.error("Cannot update about information: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    // Create a clean copy without system properties
    const {
      $id,
      $createdAt,
      $databaseId,
      $collectionId,
      $updatedAt,
      ...cleanAbout
    } = about as any;

    const response = await databases!.updateDocument(
      DATABASE_ID,
      ABOUT_COLLECTION_ID,
      id,
      cleanAbout
    );
    return response as unknown as About;
  } catch (error) {
    console.error("Error updating about information:", error);
    throw error;
  }
}

// Delete about information
export async function deleteAbout(id: string) {
  if (!canMakeApiCalls() || !ABOUT_COLLECTION_ID) {
    console.error("Cannot delete about information: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    await databases!.deleteDocument(DATABASE_ID, ABOUT_COLLECTION_ID, id);
    return true;
  } catch (error) {
    console.error("Error deleting about information:", error);
    throw error;
  }
}

// Get all certificates
export async function getCertificates() {
  if (!canMakeApiCalls() || !CERTIFICATES_COLLECTION_ID) {
    console.error("Cannot fetch certificates: Missing configuration");
    return [];
  }

  try {
    const response = await databases!.listDocuments(
      DATABASE_ID,
      CERTIFICATES_COLLECTION_ID
    );
    return response.documents as unknown as Certificates[];
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return [];
  }
}

// Get a single certificate
export async function getCertificate(id: string) {
  if (!canMakeApiCalls() || !CERTIFICATES_COLLECTION_ID) {
    console.error("Cannot fetch certificate: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    const response = await databases!.getDocument(
      DATABASE_ID,
      CERTIFICATES_COLLECTION_ID,
      id
    );
    return response as unknown as Certificates;
  } catch (error) {
    console.error("Error fetching certificate:", error);
    throw error;
  }
}

// Create a new certificate
export async function createCertificate(certificate: Certificates) {
  if (!canMakeApiCalls() || !CERTIFICATES_COLLECTION_ID) {
    console.error("Cannot create certificate: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    const response = await databases!.createDocument(
      DATABASE_ID,
      CERTIFICATES_COLLECTION_ID,
      ID.unique(),
      certificate
    );
    return response as unknown as Certificates;
  } catch (error) {
    console.error("Error creating certificate:", error);
    throw error;
  }
}

// Update a certificate
export async function updateCertificate(
  id: string,
  certificate: Partial<Certificates>
) {
  if (!canMakeApiCalls() || !CERTIFICATES_COLLECTION_ID) {
    console.error("Cannot update certificate: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    // Create a clean copy without system properties
    const {
      $id,
      $createdAt,
      $databaseId,
      $collectionId,
      $updatedAt,
      ...cleanCertificate
    } = certificate as any;

    const response = await databases!.updateDocument(
      DATABASE_ID,
      CERTIFICATES_COLLECTION_ID,
      id,
      cleanCertificate
    );
    return response as unknown as Certificates;
  } catch (error) {
    console.error("Error updating certificate:", error);
    throw error;
  }
}

// Delete a certificate
export async function deleteCertificate(id: string) {
  if (!canMakeApiCalls() || !CERTIFICATES_COLLECTION_ID) {
    console.error("Cannot delete certificate: Missing configuration");
    throw new Error("Missing configuration");
  }

  try {
    await databases!.deleteDocument(
      DATABASE_ID,
      CERTIFICATES_COLLECTION_ID,
      id
    );
    return true;
  } catch (error) {
    console.error("Error deleting certificate:", error);
    throw error;
  }
}
