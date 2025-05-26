import { ProjectForm } from "@/components/project-form";
import { getCategories } from "@/lib/appwrite";

export default async function NewProjectPage() {
  // Fetch categories from the API
  const categoriesData = await getCategories();
  const categories = categoriesData.map((cat) => ({
    label: cat.name,
    value: cat.$id || "",
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">New Project</h1>
      </div>
      <ProjectForm categories={categories} />
    </div>
  );
}
