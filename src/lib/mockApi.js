/**
 * Mock API — simulates a real backend with network delay and random failures.
 * 1.5s delay, 20% chance of failure.
 */
export async function updateTaskStatus(taskId, newColumn) {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // 20% random failure
  if (Math.random() < 0.2) {
    // Force failure for testing rollback
    // if (true) {
    throw new Error("Server error: Could not save task update.");
  }

  // // 100% failure
  // throw new Error("Server error: Could not save task update.");

  return { success: true, taskId, newColumn };
}
