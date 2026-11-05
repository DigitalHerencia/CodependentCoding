export const projectsBlockCopy = {
  searchProjects: "Search projects",
  projectStatus: "Project status",
  allStatuses: "All statuses",
  newProject: "New project",
} as const;

export const projectsPresentationCopy = {
  myOpenTasks: "My open tasks",

  upcomingWork: "Upcoming work",
  unscheduled: "Unscheduled",
  separator: " · ",
  noOpenTasksInTheLoadedProjectWork:
    "No open tasks in the loaded project work.",

  editProject: "Edit project",
  planAProject: "Plan a project",

  projectBrief: "Project brief",

  saving: "Saving…",
  saveProject: "Save project",
  createProject: "Create project",

  unassigned: "Unassigned",

  editTask: "Edit task",
  planATask: "Plan a task",

  priority: "Priority",
  saveTask: "Save task",
  createTask: "Create task",

  searchTasks: "Search tasks",
  searchTaskOrAssignee: "Search task or assignee",
  newTask: "New task",
  due: "Due ",
  dateNotSet: "date not set",
  separator2: " ·",
  noOpenTasksAtThisPriority: "No open tasks at this priority.",
  noBriefHasBeenWritten: "No brief has been written.",
  taskBoard: "Task board",
  deliveryTimeline: "Delivery timeline",
  addTask: "Add task",
  delivery: "Delivery",
  status: "Status",
  startDue: "Start / due",
  divisionSeparator: " /",
  remainingWork: "Remaining work",
  openOf: " open of ",
  tasks: " tasks",
  blockedInLoadedTasks: "Blocked in loaded tasks",
  backToTaskBoard: "Back to task board",
  briefAndAcceptanceCriteria: "Brief and acceptance criteria",
  noDescriptionProvided: "No description provided.",
  taskDelivery: "Task delivery",
  assignedTo: "Assigned to",
  dueDate: "Due date",
  completed: "Completed",
  notCompleted: "Not completed",
  showingUpTo100TasksOpenATaskTo:
    "Showing up to 100 tasks. Open a task to review its brief or edit its schedule.",
  priority2: " priority",
  noDueDate: "No due date",
  noTasks: "No tasks.",
  projectPortfolio: "Project portfolio",
  deliveryStatusAndRemainingWorkAcrossUpTo100:
    "Delivery status and remaining work across up to 100 projects.",
  noProjectBriefYet: "No project brief yet.",
  of: " of",
  tasksClosed: " tasks closed",
  start: "Start: ",
  due2: " · Due:",
  timeline: "Timeline",
  noMatchingProjectsCreateAProjectToPlanYour:
    "No matching projects. Create a project to plan your first delivery.",
  scheduleATask: "Schedule a task",
  projectWindow: "Project window: ",
  noStartDate: "No start date",
  sentenceSeparator: " →",
  noDeadline: "No deadline",
  noTasksHaveScheduledDeadlines: "No tasks have scheduled deadlines.",
  unscheduledWork: "Unscheduled work",
  setADeadline: " · Set a deadline",
} as const;

export const projectsControlCopy = {
  unassigned: "Unassigned",
  assignTo: "Assign to",
  saveAssignment: "Save assignment",
  taskStatus: "Task status",
  updateStatus: "Update status",
} as const;

export const projectsRemainingCopy = {
  priorityLabel: (value0: unknown) => `${value0} priority`,
  statusAndCount: (value0: unknown, value1: unknown) => `${value0} · ${value1}`,
  viewCount: (value0: unknown) => `${value0} views`,
  taskBoardTitle: (value0: unknown) => `${value0} · Task board`,

  projectName: "Project name",
  projectBrief: "Project brief",
  startsOn: "Starts on",
  dueOn: "Due on",
  taskTitle: "Task title",
  descriptionAndAcceptanceCriteria: "Description and acceptance criteria",
  priority: "Priority",
  taskBoard: "Task board",
} as const;
