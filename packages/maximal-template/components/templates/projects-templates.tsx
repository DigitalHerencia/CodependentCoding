import {
  MyTasksContentBlock,
  MyTasksToolbarBlock,
  ProjectDetailContentBlock,
  ProjectDetailToolbarBlock,
  ProjectsContentBlock,
  ProjectsToolbarBlock,
  ProjectTaskDetailContentBlock,
  ProjectTaskDetailToolbarBlock,
  ProjectTasksContentBlock,
  ProjectTasksToolbarBlock,
  ProjectTimelineContentBlock,
  ProjectTimelineToolbarBlock,
} from "@/components/blocks/projects-page-blocks";
import { DashboardLayout } from "@/components/blocks/shared-blocks";
import {
  projectsPresentationCopy,
  projectsRemainingCopy,
} from "@/content/projects";
import type { ComponentProps } from "react";

export function MyTasksTemplate(
  props: ComponentProps<typeof MyTasksContentBlock>,
) {
  const { title } = props;
  return (
    <DashboardLayout
      title={title}
      nav={[]}
      toolbar={<MyTasksToolbarBlock {...props} />}
    >
      <MyTasksContentBlock {...props} />
    </DashboardLayout>
  );
}
export function ProjectDetailTemplate(
  props: ComponentProps<typeof ProjectDetailContentBlock>,
) {
  const { project } = props;
  return (
    <DashboardLayout
      title={project.name}
      nav={[]}
      toolbar={<ProjectDetailToolbarBlock {...props} />}
    >
      <ProjectDetailContentBlock {...props} />
    </DashboardLayout>
  );
}
export function ProjectTaskDetailTemplate(
  props: ComponentProps<typeof ProjectTaskDetailContentBlock>,
) {
  const { task } = props;
  return (
    <DashboardLayout
      title={task.title}
      nav={[]}
      toolbar={<ProjectTaskDetailToolbarBlock {...props} />}
    >
      <ProjectTaskDetailContentBlock {...props} />
    </DashboardLayout>
  );
}
export function ProjectTasksTemplate(
  props: ComponentProps<typeof ProjectTasksContentBlock>,
) {
  const { title } = props;
  return (
    <DashboardLayout
      title={title}
      nav={[]}
      toolbar={<ProjectTasksToolbarBlock {...props} />}
    >
      <ProjectTasksContentBlock {...props} />
    </DashboardLayout>
  );
}
export function ProjectsTemplate(
  props: ComponentProps<typeof ProjectsContentBlock>,
) {
  return (
    <DashboardLayout
      title={projectsPresentationCopy.projectPortfolio}
      nav={[]}
      toolbar={<ProjectsToolbarBlock {...props} />}
    >
      <ProjectsContentBlock {...props} />
    </DashboardLayout>
  );
}
export function ProjectTimelineTemplate(
  props: ComponentProps<typeof ProjectTimelineContentBlock>,
) {
  const { project } = props;
  return (
    <DashboardLayout
      title={projectsRemainingCopy.viewCount(project.name)}
      nav={[]}
      toolbar={<ProjectTimelineToolbarBlock {...props} />}
    >
      <ProjectTimelineContentBlock {...props} />
    </DashboardLayout>
  );
}
