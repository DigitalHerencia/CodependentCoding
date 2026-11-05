import { projectsRemainingCopy } from "@/content/projects";
import { projectsPresentationCopy } from "@/content/projects";
// Why: Templates: pure presentation for the projects pages, laid out from DTOs; data and slots come from features.
import Link from "next/link";
import type { ReactNode } from "react";
import type { TaskDTO, ProjectSummaryDTO } from "@/types/projectsTypes";
import {
  DashboardLayout,
  DashboardPanel,
} from "@/components/blocks/shared-blocks";
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
        <DashboardPanel
          key={priority}
          title={projectsRemainingCopy.priorityLabel(priority)}
        >
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
                      {projectsPresentationCopy.due}
                      {task.dueAt?.slice(0, 10) ??
                        projectsPresentationCopy.dateNotSet}
                      {projectsPresentationCopy.separator2} {task.status}
                    </p>
                  </div>
                  {renderControls(task)}
                </li>
              ))}
          </ul>
          {!tasks.some((task) => task.priority === priority) && (
            <p>{projectsPresentationCopy.noOpenTasksAtThisPriority}</p>
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
          {projectsPresentationCopy.editProject}
        </Link>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <DashboardPanel title={projectsPresentationCopy.projectBrief}>
          <p className="whitespace-pre-wrap">
            {project.description ??
              projectsPresentationCopy.noBriefHasBeenWritten}
          </p>
          <nav className="mt-6 flex flex-wrap gap-4">
            <Link className="type-link" href={`/projects/${project.id}/tasks`}>
              {projectsPresentationCopy.taskBoard}
            </Link>
            <Link
              className="type-link"
              href={`/projects/${project.id}/timeline`}
            >
              {projectsPresentationCopy.deliveryTimeline}
            </Link>
            <Link
              className="type-link"
              href={`/projects/${project.id}/tasks/new`}
            >
              {projectsPresentationCopy.addTask}
            </Link>
          </nav>
        </DashboardPanel>
        <DashboardPanel title={projectsPresentationCopy.delivery}>
          <dl className="space-y-2">
            <dt>{projectsPresentationCopy.status}</dt>
            <dd>{project.status}</dd>
            <dt>{projectsPresentationCopy.startDue}</dt>
            <dd>
              {project.startsAt?.slice(0, 10) ??
                projectsPresentationCopy.unscheduled}
              {projectsPresentationCopy.divisionSeparator}{" "}
              {project.dueAt?.slice(0, 10) ??
                projectsPresentationCopy.unscheduled}
            </dd>
            <dt>{projectsPresentationCopy.remainingWork}</dt>
            <dd>
              {project.openTaskCount}
              {projectsPresentationCopy.openOf}
              {project.taskCount}
              {projectsPresentationCopy.tasks}
            </dd>
            <dt>{projectsPresentationCopy.blockedInLoadedTasks}</dt>
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
          {projectsPresentationCopy.editTask}
        </Link>
      }
    >
      <Link className="type-link" href={`/projects/${task.projectId}/tasks`}>
        {projectsPresentationCopy.backToTaskBoard}
      </Link>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <DashboardPanel
          title={projectsPresentationCopy.briefAndAcceptanceCriteria}
        >
          <p className="whitespace-pre-wrap">
            {task.description ?? projectsPresentationCopy.noDescriptionProvided}
          </p>
        </DashboardPanel>
        <DashboardPanel title={projectsPresentationCopy.taskDelivery}>
          <dl className="space-y-2">
            <dt>{projectsPresentationCopy.priority}</dt>
            <dd>{task.priority}</dd>
            <dt>{projectsPresentationCopy.assignedTo}</dt>
            <dd>
              {task.assignee?.displayName ??
                projectsPresentationCopy.unassigned}
            </dd>
            <dt>{projectsPresentationCopy.dueDate}</dt>
            <dd>
              {task.dueAt?.slice(0, 10) ?? projectsPresentationCopy.unscheduled}
            </dd>
            <dt>{projectsPresentationCopy.completed}</dt>
            <dd>
              {task.completedAt?.slice(0, 10) ??
                projectsPresentationCopy.notCompleted}
            </dd>
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
        {projectsPresentationCopy.showingUpTo100TasksOpenATaskTo}
      </p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Object.values(TaskStatus).map((status) => (
          <DashboardPanel
            key={status}
            title={projectsRemainingCopy.statusAndCount(
              status.replaceAll("_", " "),
              tasks.filter((task) => task.status === status).length,
            )}
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
                    <p>
                      {task.priority}
                      {projectsPresentationCopy.priority2}
                    </p>
                    <p className="text-sm text-muted-primary">
                      {task.assignee?.displayName ??
                        projectsPresentationCopy.unassigned}
                      {projectsPresentationCopy.separator2}{" "}
                      {task.dueAt?.slice(0, 10) ??
                        projectsPresentationCopy.noDueDate}
                    </p>
                    {renderControls(task)}
                  </article>
                ))}
              {!tasks.some((task) => task.status === status) && (
                <p className="p-3 text-muted-primary">
                  {projectsPresentationCopy.noTasks}
                </p>
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
    <DashboardLayout
      title={projectsPresentationCopy.projectPortfolio}
      nav={[]}
      toolbar={toolbar}
    >
      <p className="text-muted-primary">
        {projectsPresentationCopy.deliveryStatusAndRemainingWorkAcrossUpTo100}
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
              {project.description ??
                projectsPresentationCopy.noProjectBriefYet}
            </p>
            <div>
              <label htmlFor={`progress-${project.id}`}>
                {project.taskCount - project.openTaskCount}
                {projectsPresentationCopy.of} {project.taskCount}
                {projectsPresentationCopy.tasksClosed}
              </label>
              <progress
                id={`progress-${project.id}`}
                className="mt-2 block w-full accent-primary"
                max={Math.max(1, project.taskCount)}
                value={project.taskCount - project.openTaskCount}
              />
            </div>
            <p>
              {projectsPresentationCopy.start}
              {project.startsAt?.slice(0, 10) ??
                projectsPresentationCopy.unscheduled}
              {projectsPresentationCopy.due2}{" "}
              {project.dueAt?.slice(0, 10) ??
                projectsPresentationCopy.unscheduled}
            </p>
            <nav
              className="flex flex-wrap gap-4"
              aria-label={projectsRemainingCopy.viewCount(project.name)}
            >
              <Link
                className="type-link"
                href={`/projects/${project.id}/tasks`}
              >
                {projectsPresentationCopy.taskBoard}
              </Link>
              <Link
                className="type-link"
                href={`/projects/${project.id}/timeline`}
              >
                {projectsPresentationCopy.timeline}
              </Link>
              <Link className="type-link" href={`/projects/${project.id}/edit`}>
                {projectsPresentationCopy.editProject}
              </Link>
            </nav>
          </article>
        ))}
      </div>
      {projects.length === 0 && (
        <p className="surface-inset p-6">
          {projectsPresentationCopy.noMatchingProjectsCreateAProjectToPlanYour}
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
      title={projectsRemainingCopy.viewCount(project.name)}
      nav={[]}
      toolbar={
        <Link className="type-link" href={`/projects/${project.id}/tasks/new`}>
          {projectsPresentationCopy.scheduleATask}
        </Link>
      }
    >
      <p>
        {projectsPresentationCopy.projectWindow}
        {project.startsAt?.slice(0, 10) ?? projectsPresentationCopy.noStartDate}
        {projectsPresentationCopy.sentenceSeparator}{" "}
        {project.dueAt?.slice(0, 10) ?? projectsPresentationCopy.noDeadline}
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
                        {task.status}
                        {projectsPresentationCopy.separator}
                        {task.priority}
                      </span>
                    </li>
                  ))}
              </ul>
            </DashboardPanel>
          </li>
        ))}
      </ol>
      {dates.length === 0 && (
        <p>{projectsPresentationCopy.noTasksHaveScheduledDeadlines}</p>
      )}
      <DashboardPanel title={projectsPresentationCopy.unscheduledWork}>
        <ul className="space-y-3">
          {tasks
            .filter((task) => !task.dueAt)
            .map((task) => (
              <li key={task.id}>
                <Link
                  className="type-link"
                  href={`/projects/${project.id}/tasks/${task.id}/edit`}
                >
                  {task.title}
                  {projectsPresentationCopy.setADeadline}
                </Link>
              </li>
            ))}
        </ul>
      </DashboardPanel>
    </DashboardLayout>
  );
}
