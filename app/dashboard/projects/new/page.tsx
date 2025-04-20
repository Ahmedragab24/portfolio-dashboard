import { ProjectForm } from "@/components/project-form"

export default function NewProjectPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">New Project</h1>
      </div>
      <ProjectForm />
    </div>
  )
}
