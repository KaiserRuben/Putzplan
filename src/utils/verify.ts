import {TaskAssigner} from "./taskAssigner.ts";

interface Task {
    id: number;
    name: string;
    frequency: 'weekly' | 'bi-weekly' | 'monthly';
    estimatedTime: number;
}

interface User {
    name: string;
}

interface VerificationResult {
    userTaskCounts: { [userName: string]: { [taskName: string]: number } };
    taskTotalCounts: { [taskName: string]: number };
    totalTasksPerUser: { [userName: string]: number };
}

function verifyTaskAssignments(
    assigner: TaskAssigner,
    numWeeks: number
): VerificationResult {
    const userTaskCounts: { [userName: string]: { [taskName: string]: number } } = {};
    const taskTotalCounts: { [taskName: string]: number } = {};
    const totalTasksPerUser: { [userName: string]: number } = {};

    for (let week = 1; week <= numWeeks; week++) {
        const assignment = assigner.getTasksForWeek(week);

        for (const [user, tasks] of Object.entries(assignment)) {
            if (!userTaskCounts[user]) {
                userTaskCounts[user] = {};
                totalTasksPerUser[user] = 0;
            }

            for (const task of tasks) {
                if (!userTaskCounts[user][task.name]) {
                    userTaskCounts[user][task.name] = 0;
                }
                userTaskCounts[user][task.name]++;
                totalTasksPerUser[user]++;

                if (!taskTotalCounts[task.name]) {
                    taskTotalCounts[task.name] = 0;
                }
                taskTotalCounts[task.name]++;
            }
        }
    }

    return { userTaskCounts, taskTotalCounts, totalTasksPerUser };
}

function printVerificationResult(result: VerificationResult): void {
    console.log("Task Assignment Verification Results:");
    console.log("\nUser Task Counts:");
    for (const [user, tasks] of Object.entries(result.userTaskCounts)) {
        console.log(`\n${user}:`);
        for (const [task, count] of Object.entries(tasks)) {
            console.log(`  ${task}: ${count} times`);
        }
        console.log(`  Total tasks: ${result.totalTasksPerUser[user]}`);
    }

    console.log("\nTotal Task Counts:");
    for (const [task, count] of Object.entries(result.taskTotalCounts)) {
        console.log(`  ${task}: ${count} times`);
    }
}

// Example usage:
const tasks: Task[] = [
    { id: 1, name: "Kitchen", frequency: "weekly", estimatedTime: 60 },
    { id: 2, name: "Living Room", frequency: "weekly", estimatedTime: 30 },
    { id: 3, name: "Workspace", frequency: "weekly", estimatedTime: 20 },
    { id: 4, name: "Bathroom", frequency: "weekly", estimatedTime: 40 },
    { id: 5, name: "Hallway", frequency: "bi-weekly", estimatedTime: 15 },
    { id: 6, name: "General Tasks", frequency: "bi-weekly", estimatedTime: 25 },
    { id: 7, name: "Clean Oven", frequency: "monthly", estimatedTime: 45 }
];

const users: User[] = [
    { name: "Alice" },
    { name: "Bob" },
    { name: "Charlie" }
];

const assigner = new TaskAssigner(tasks, users);
const numWeeks = 12;  // Verify assignments over 12 weeks

const verificationResult = verifyTaskAssignments(assigner, numWeeks);
printVerificationResult(verificationResult);