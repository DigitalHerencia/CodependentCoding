// Why: Module definition: navigation, resources and permission grants the registry reads.
import type { ModuleDefinition } from "@/types/moduleTypes";

export const projectsModule = {
  id: "projects",
  nav: {
    label: "Projects",
    icon: "folder-kanban",
    links: [
      { label: "All projects", href: "/projects" },
      { label: "New project", href: "/projects/new" },
      { label: "My tasks", href: "/my-tasks" },
    ],
  },
  dashboard: [
    {
      id: "projects-delivery",
      title: "Project delivery",
      description: "Plan work, assign tasks and follow deadlines.",
      href: "/projects",
    },
    {
      id: "projects-my-tasks",
      title: "My tasks",
      description: "Follow up on the work assigned to you.",
      href: "/my-tasks",
    },
  ],
  permissions: {
    resources: ["project", "task"],
    catalog: ["projects:read", "projects:write"],
    grants: {
      MANAGER: ["projects:read", "projects:write"],
      MEMBER: ["projects:read", "projects:write"],
      VIEWER: ["projects:read"],
    },
  },
} satisfies ModuleDefinition;
