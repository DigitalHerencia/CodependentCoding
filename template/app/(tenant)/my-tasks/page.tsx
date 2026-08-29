import { TasksFeature } from "@/features/projects/tasksFeature";

// URL ownership stops here; orchestration is delegated to the feature.
export default function Page() {
  return <TasksFeature />;
}
