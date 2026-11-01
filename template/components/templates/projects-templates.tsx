// Why: Templates: pure presentation for the projects pages, laid out from DTOs; data and slots come from features.
import Link from "next/link";
import type { ReactNode } from "react";
import type { TaskDTO, ProjectSummaryDTO } from "@/types/projectsTypes";
import {
  DashboardLayout,
  DashboardPanel,
} from "@/components/blocks/dashboard-layout";
import { TaskStatus } from "@/schemas/projectsSchemas";

// lays out the my-tasks page from DTOs; no data access, no state.
export function MyTasksTemplate({
  title,
  tasks,
  toolbar,
  renderControls,
}: {
  title: string;
  tasks: readonly TaskDTO[];
  toolbar: ReactNode;
  renderControls: (task: TaskDTO) => ReactNode;
}) {
  return (
    <DashboardLayout title={title} nav={[]} toolbar={toolbar}>
      {["URGENT", "HIGH", "MEDIUM", "LOW"].map((priority) => (
        <DashboardPanel key={priority} title={`${priority} priority`}>
          <ul className="space-y-3">
            {tasks
              .filter((task) => task.priority === priority)
              .map((task) => (
                <li
                  key={task.id}
                  className="grid gap-4 border-b border-border py-3 lg:grid-cols-[1fr_auto]"
                >
                  <div>
                    <Link
                      className="type-label hover:underline"
                      href={`/projects/${task.projectId}/tasks/${task.id}`}
                    >
                      {task.title}
                    </Link>
                    <p className="mt-2">
                      Due {task.dueAt?.slice(0, 10) ?? "date not set"} ·{" "}
                      {task.status}
                    </p>
                  </div>
                  {renderControls(task)}
                </li>
              ))}
          </ul>
          {!tasks.some((task) => task.priority === priority) && (
            <p>No open tasks at this priority.</p>
          )}
        </DashboardPanel>
      ))}
    </DashboardLayout>
  );
}

// lays out one project's overview from DTOs; features pass panels as children.
export function ProjectDetailTemplate({
  project,
  tasks,
  children,
}: {
  project: ProjectSummaryDTO;
  tasks: TaskDTO[];
  children: ReactNode;
}) {
  return (
    <DashboardLayout
      title={project.name}
      nav={[]}
      toolbar={
        <Link className="type-link" href={`/projects/${project.id}/edit`}>
          Edit project
        </Link>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <DashboardPanel title="Project brief">
          <p className="whitespace-pre-wrap">
            {project.description ?? "No brief has been written."}
          </p>
          <nav className="mt-6 flex flex-wrap gap-4">
            <Link className="type-link" href={`/projects/${project.id}/tasks`}>
              Task board
            </Link>
            <Link
              className="type-link"
              href={`/projects/${project.id}/timeline`}
            >
              Delivery timeline
            </Link>
            <Link
              className="type-link"
              href={`/projects/${project.id}/tasks/new`}
            >
              Add task
            </Link>
          </nav>
        </DashboardPanel>
        <DashboardPanel title="Delivery">
          <dl className="space-y-2">
            <dt>Status</dt>
            <dd>{project.status}</dd>
            <dt>Start / due</dt>
            <dd>
              {project.startsAt?.slice(0, 10) ?? "Unscheduled"} /{" "}
              {project.dueAt?.slice(0, 10) ?? "Unscheduled"}
            </dd>
            <dt>Remaining work</dt>
            <dd>
              {project.openTaskCount} open of {project.taskCount} tasks
            </dd>
            <dt>Blocked in loaded tasks</dt>
            <dd>{tasks.filter((task) => task.status === "BLOCKED").length}</dd>
          </dl>
        </DashboardPanel>
      </div>
      {children}
    </DashboardLayout>
  );
}

// lays out one task from its DTO; the client island arrives as children.
export function ProjectTaskDetailTemplate({
  task,
  children,
}: {
  task: TaskDTO;
  children: ReactNode;
}) {
  return (
    <DashboardLayout
      title={task.title}
      nav={[]}
      toolbar={
        <Link
          className="type-link"
          href={`/projects/${task.projectId}/tasks/${task.id}/edit`}
        >
          Edit task
        </Link>
      }
    >
      <Link className="type-link" href={`/projects/${task.projectId}/tasks`}>
        Back to task board
      </Link>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <DashboardPanel title="Brief and acceptance criteria">
          <p className="whitespace-pre-wrap">
            {task.description ?? "No description provided."}
          </p>
        </DashboardPanel>
        <DashboardPanel title="Task delivery">
          <dl className="space-y-2">
            <dt>Priority</dt>
            <dd>{task.priority}</dd>
            <dt>Assigned to</dt>
            <dd>{task.assignee?.displayName ?? "Unassigned"}</dd>
            <dt>Due date</dt>
            <dd>{task.dueAt?.slice(0, 10) ?? "Unscheduled"}</dd>
            <dt>Completed</dt>
            <dd>{task.completedAt?.slice(0, 10) ?? "Not completed"}</dd>
          </dl>
          <div className="mt-4">{children}</div>
        </DashboardPanel>
      </div>
    </DashboardLayout>
  );
}

// lays out the task board grouped by status from DTOs.
export function ProjectTasksTemplate({
  title,
  tasks,
  toolbar,
  renderControls,
}: {
  title: string;
  tasks: readonly TaskDTO[];
  toolbar: ReactNode;
  renderControls: (task: TaskDTO) => ReactNode;
}) {
  return (
    <DashboardLayout title={title} nav={[]} toolbar={toolbar}>
      <p className="text-muted-primary">
        Showing up to 100 tasks. Open a task to review its brief or edit its
        schedule.
      </p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Object.values(TaskStatus).map((status) => (
          <DashboardPanel
            key={status}
            title={`${status.replaceAll("_", " ")} · ${tasks.filter((task) => task.status === status).length}`}
          >
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <article
                    className="space-y-3 surface-inset p-4"
                    key={task.id}
                  >
                    <Link
                      className="type-label hover:underline"
                      href={`/projects/${task.projectId}/tasks/${task.id}`}
                    >
                      {task.title}
                    </Link>
                    <p>{task.priority} priority</p>
                    <p className="text-sm text-muted-primary">
                      {task.assignee?.displayName ?? "Unassigned"} ·{" "}
                      {task.dueAt?.slice(0, 10) ?? "No due date"}
                    </p>
                    {renderControls(task)}
                  </article>
                ))}
              {!tasks.some((task) => task.status === status) && (
                <p className="p-3 text-muted-primary">No tasks.</p>
              )}
            </div>
          </DashboardPanel>
        ))}
      </div>
    </DashboardLayout>
  );
}

// lays out the portfolio with progress per project; the toolbar is a slot.
export function ProjectsTemplate({
  projects,
  toolbar,
}: {
  projects: readonly ProjectSummaryDTO[];
  toolbar: ReactNode;
}) {
  return (
    <DashboardLayout title="Project portfolio" nav={[]} toolbar={toolbar}>
      <p className="text-muted-primary">
        Delivery status and remaining work across up to 100 projects.
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        {projects.map((project) => (
          <article key={project.id} className="space-y-4 surface-card p-5">
            <header className="flex flex-wrap justify-between gap-3">
              <Link
                className="type-title hover:underline"
                href={`/projects/${project.id}`}
              >
                {project.name}
              </Link>
              <span>{project.status.replaceAll("_", " ")}</span>
            </header>
            <p className="whitespace-pre-wrap text-muted-primary">
              {project.description ?? "No project brief yet."}
            </p>
            <div>
              <label htmlFor={`progress-${project.id}`}>
                {project.taskCount - project.openTaskCount} of{" "}
                {project.taskCount} tasks closed
              </label>
              <progress
                id={`progress-${project.id}`}
                className="mt-2 block w-full accent-primary"
                max={Math.max(1, project.taskCount)}
                value={project.taskCount - project.openTaskCount}
              />
            </div>
            <p>
              Start: {project.startsAt?.slice(0, 10) ?? "Unscheduled"} · Due:{" "}
              {project.dueAt?.slice(0, 10) ?? "Unscheduled"}
            </p>
            <nav
              className="flex flex-wrap gap-4"
              aria-label={`${project.name} views`}
            >
              <Link
                className="type-link"
                href={`/projects/${project.id}/tasks`}
              >
                Task board
              </Link>
              <Link
                className="type-link"
                href={`/projects/${project.id}/timeline`}
              >
                Timeline
              </Link>
              <Link className="type-link" href={`/projects/${project.id}/edit`}>
                Edit project
              </Link>
            </nav>
          </article>
        ))}
      </div>
      {projects.length === 0 && (
        <p className="surface-inset p-6">
          No matching projects. Create a project to plan your first delivery.
        </p>
      )}
    </DashboardLayout>
  );
}

// lays out tasks on the project's date range from DTOs.
export function ProjectTimelineTemplate({
  project,
  tasks,
}: {
  project: ProjectSummaryDTO;
  tasks: TaskDTO[];
}) {
  const dates = [
    ...new Set(
      tasks.flatMap((task) => (task.dueAt ? [task.dueAt.slice(0, 10)] : [])),
    ),
  ].sort();
  return (
    <DashboardLayout
      title={`${project.name} · Timeline`}
      nav={[]}
      toolbar={
        <Link className="type-link" href={`/projects/${project.id}/tasks/new`}>
          Schedule a task
        </Link>
      }
    >
      <p>
        Project window: {project.startsAt?.slice(0, 10) ?? "No start date"} →{" "}
        {project.dueAt?.slice(0, 10) ?? "No deadline"}
      </p>
      <ol className="space-y-4 border-l-4 border-primary pl-5">
        {dates.map((date) => (
          <li key={date}>
            <DashboardPanel title={date}>
              <ul className="space-y-3">
                {tasks
                  .filter((task) => task.dueAt?.startsWith(date))
                  .map((task) => (
                    <li
                      key={task.id}
                      className="flex flex-wrap justify-between gap-3"
                    >
                      <Link
                        className="type-link"
                        href={`/projects/${project.id}/tasks/${task.id}`}
                      >
                        {task.title}
                      </Link>
                      <span>
                        {task.status} · {task.priority}
                      </span>
                    </li>
                  ))}
              </ul>
            </DashboardPanel>
          </li>
        ))}
      </ol>
      {dates.length === 0 && <p>No tasks have scheduled deadlines.</p>}
      <DashboardPanel title="Unscheduled work">
        <ul className="space-y-3">
          {tasks
            .filter((task) => !task.dueAt)
            .map((task) => (
              <li key={task.id}>
                <Link
                  className="type-link"
                  href={`/projects/${project.id}/tasks/${task.id}/edit`}
                >
                  {task.title} · Set a deadline
                </Link>
              </li>
            ))}
        </ul>
      </DashboardPanel>
    </DashboardLayout>
  );
}
