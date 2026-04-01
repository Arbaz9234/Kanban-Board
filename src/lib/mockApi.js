/**
 * Mock API — simulates a real backend with network delay and random failures.
 * 1.5s delay, 20% chance of failure.
 */
export async function updateTaskStatus(taskId, newColumn) {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (Math.random() < 0.2) {
    throw new Error("Server error: Could not save task update.");
  }

  return { success: true, taskId, newColumn };
}
