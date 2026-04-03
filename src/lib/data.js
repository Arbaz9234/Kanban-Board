export const COLUMNS = [
  { id: "todo", label: "To Do", icon: "list" },
  { id: "inprogress", label: "In Progress", icon: "clock" },
  { id: "done", label: "Done", icon: "check" },
];

export const INITIAL_TASKS = [
  {
    id: "task-1",
    title: "Build reusable React hooks for form validation",
    column: "todo",
    priority: "High",
    date: "Mar 30",
    comments: 3,
    avatar: "AT",
  },
  {
    id: "task-2",
    title: "Set up CI/CD pipeline with GitHub Actions for staging",
    column: "todo",
    priority: "Medium",
    date: "Apr 02",
    comments: 5,
    avatar: "AT",
  },
  {
    id: "task-3",
    title: "Optimize database queries for dashboard analytics",
    column: "inprogress",
    priority: "High",
    date: "Mar 31",
    comments: 4,
    avatar: "AT",
  },
  {
    id: "task-4",
    title: "Integrate third-party authentication (OAuth 2.0)",
    column: "inprogress",
    priority: "Medium",
    date: "Apr 03",
    comments: 2,
    avatar: "AT",
  },
  {
    id: "task-5",
    title: "Fix responsive layout issues on mobile breakpoints",
    column: "done",
    priority: "Low",
    date: "Apr 01",
    comments: 1,
    avatar: "AT",
  },
];
