import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FolderKanban,
  Tag,
  Plus,
  MessageSquare,
  AlertTriangle,
  LayoutDashboard,
  Facebook,
  Github,
  Linkedin,
  Instagram,
  MessageCircleMore,
  Send,
  Twitter,
  LinkIcon,
  Mail,
  Eye,
  PanelsTopLeft,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardStats } from "@/components/dashboard-stats";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { VisitorStats } from "@/components/visitor-stats";
import { getAbout } from "@/lib/appwrite";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Force dynamic rendering to always get fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const about = await getAbout();
  const isConfigured =
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT &&
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

  const getSocialIcon = (name: string) => {
    const normalizedName = name.toLowerCase().trim();

    if (normalizedName.includes("facebook")) return Facebook;
    if (normalizedName.includes("github")) return Github;
    if (normalizedName.includes("linkedin")) return Linkedin;
    if (normalizedName.includes("instagram")) return Instagram;
    if (normalizedName.includes("whatsapp")) return MessageCircleMore;
    if (normalizedName.includes("telegram")) return Send;
    if (normalizedName.includes("twitter")) return Twitter;
    return LinkIcon;
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      {!isConfigured && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Configuration Error</AlertTitle>
          <AlertDescription>
            Missing Appwrite configuration. Please set up your environment
            variables.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        {/* Profile Section */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 flex flex-col items-center">
            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-background shadow-lg mb-4">
              <Image
                src="/WhatsApp Image 2025-12-05 at 14.47.35_d247f30b.png"
                alt={about.name}
                width={128}
                height={128}
                className="h-full w-full object-cover object-top"
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{about.name}</h1>
            <Badge variant="secondary" className="mt-1">
              {about.position}
            </Badge>
          </div>

          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <Link
                    href={`mailto:${about.email}`}
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <Mail className="h-4 w-4 text-primary" />
                    {about.email}
                  </Link>
                  <Link
                    href="https://ahmed-elmadany.vercel.app/"
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <PanelsTopLeft className="h-4 w-4 text-primary" />
                    Portfolio Website
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                  <Link
                    href={about.CV}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <Eye className="h-4 w-4 text-primary" />
                    View CV
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Social Media
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {about?.socialMedia && about.socialMedia.length > 0 ? (
                    about.socialMedia.map((social, index) => {
                      const Icon = getSocialIcon(social.name);
                      return (
                        <a
                          key={index}
                          href={social.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm hover:text-primary transition-colors p-2 rounded-md hover:bg-muted"
                        >
                          <Icon className="h-4 w-4 text-primary" />
                          {social.name}
                        </a>
                      );
                    })
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No social media links available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Content */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          </div>

          <Suspense fallback={<StatsLoading />}>
            <DashboardStats />
          </Suspense>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-l-4 border-l-primary/70">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projects</CardTitle>
                <FolderKanban className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  <Suspense fallback={<Skeleton className="h-8 w-20" />}>
                    <DashboardStats type="projects" />
                  </Suspense>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/projects" className="w-full">
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-l-4 border-l-primary/70">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Categories
                </CardTitle>
                <Tag className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  <Suspense fallback={<Skeleton className="h-8 w-20" />}>
                    <DashboardStats type="categories" />
                  </Suspense>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/categories" className="w-full">
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-l-4 border-l-primary/70">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  <Suspense fallback={<Skeleton className="h-8 w-20" />}>
                    <DashboardStats type="messages" />
                  </Suspense>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/messages" className="w-full">
                  <Button className="w-full" variant="outline">
                    View Messages
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Visitor Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense
                fallback={<Skeleton className="h-[200px] rounded-lg" />}
              >
                <VisitorStats />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatsLoading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
    </div>
  );
}
