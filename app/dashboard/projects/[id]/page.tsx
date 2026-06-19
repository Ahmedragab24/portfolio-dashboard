import { getProject, getCategories } from "@/lib/api"
import { ProjectForm } from "@/components/project-form"

interface EditProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params
  const project = await getProject(id)
  const categories = await getCategories()

  // Format categories for the form component
  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.$id || "",
  }))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
      </div>
      <ProjectForm project={project} categories={categoryOptions} />
    </div>
  )
}
