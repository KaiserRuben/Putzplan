import {tasks as taskData, users as userData} from '../../data.json';

const tasks: Task[] = taskData as Task[];
const users: inputUser[] = userData as inputUser[];

export interface Subtask {
    id: number;
    name: string;
    description: string;
    cleaningProducts: string[];
    tips: string;
    cautions: string;
}

export interface Task {
    id: number;
    name: string;
    frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'bi-monthly' | 'three-monthly' | 'four-monthly' | 'six-monthly';
    estimatedTime: number;
    subtasks: Subtask[];
}

export interface inputUser {
    name: string;
    color?: string;
}


export interface User extends inputUser {
    taskCounts: { [taskId: number]: number };
    totalTime: number;
}

export interface WeeklyAssignment {
    [userName: string]: Task[];
}

type Frequency = 'weekly' | 'bi-weekly' | 'monthly' | 'bi-monthly' | 'three-monthly' | 'four-monthly' | 'six-monthly';

export class TaskAssigner {
    private tasks: Task[];
    private users: User[];

    constructor(tasks: Task[], users: inputUser[]) {
        if (tasks.length === 0 || users.length === 0) {
            throw new Error("Tasks and users arrays cannot be empty");
        }
        this.tasks = tasks;
        this.users = users.map(u => ({
            name: u.name,
            color: u.color,
            taskCounts: this.tasks.reduce((acc, task) => ({...acc, [task.id]: 0}), {}),
            totalTime: 0
        }));
    }

    private getTasksDueThisWeek(week: number): Task[] {
        return this.tasks.filter(task => this.isTaskDueThisWeek(task, week));
    }

    private isTaskDueThisWeek(task: Task, week: number): boolean {
        const frequencyMap: { [K in Frequency]: number } = {
            'weekly': 1,
            'bi-weekly': 2,
            'monthly': 4,
            'bi-monthly': 8,
            'three-monthly': 12,
            'four-monthly': 16,
            'six-monthly': 24
        };
        return week % frequencyMap[task.frequency] === 0;
    }

    private distributeTasksEvenly(weekTasks: Task[], week: number): WeeklyAssignment {
        const assignment: { [userName: string]: Task[] } = {};
        this.users.forEach(user => assignment[user.name] = []);

        // Sort tasks by frequency (less frequent first) and then by estimated time
        weekTasks.sort((a, b) => {
            const freqOrder = {
                'six-monthly': 0,
                'four-monthly': 1,
                'three-monthly': 2,
                'bi-monthly': 3,
                'monthly': 4,
                'bi-weekly': 5,
                'weekly': 6
            };
            if (freqOrder[a.frequency] !== freqOrder[b.frequency]) {
                return freqOrder[a.frequency] - freqOrder[b.frequency];
            }
            return b.estimatedTime - a.estimatedTime;
        });

        // Use the week number to determine the starting rotation
        weekTasks.forEach((task, index) => {
            // Calculate rotation based on the week number and task's frequency
            const baseRotation = week % this.users.length;
            const taskFreqOffset = index % this.users.length;
            const userIndex = (baseRotation + taskFreqOffset) % this.users.length;

            const user = this.users[userIndex];
            assignment[user.name].push(task);
            user.taskCounts[task.id]++;
            user.totalTime += task.estimatedTime;
        });

        return assignment;
    }

    getTasksForWeek(week: number): WeeklyAssignment {
        const weekTasks = this.getTasksDueThisWeek(week);
        return this.distributeTasksEvenly(weekTasks, week);
    }

    getUserStats(): { [userName: string]: { totalTime: number, taskCounts: { [taskName: string]: number } } } {
        const stats: { [userName: string]: { totalTime: number, taskCounts: { [taskName: string]: number } } } = {};

        this.users.forEach(user => {
            stats[user.name] = {
                totalTime: user.totalTime,
                taskCounts: {}
            };

            for (const taskId in user.taskCounts) {
                const task = this.tasks.find(t => t.id === Number(taskId));
                if (task) {
                    stats[user.name].taskCounts[task.name] = user.taskCounts[taskId];
                }
            }
        });

        return stats;
    }
}

export function getTasksForWeek(week: number): WeeklyAssignment {
    const assigner = new TaskAssigner(tasks, users);
    return assigner.getTasksForWeek(week);
}

export function getUsers(): inputUser[] {
    return users;
}

export function analyzeTaskDistribution(weeks: number) {
    // Track assignments and time per user
    const userStats: {
        [userName: string]: {
            totalTime: number,
            taskCounts: { [taskName: string]: number },
            weeklyAssignments: { [week: number]: string[] }
        }
    } = {};

    // Initialize stats for each user
    users.forEach(user => {
        userStats[user.name] = {
            totalTime: 0,
            taskCounts: {},
            weeklyAssignments: {}
        };
    });

    // Analyze assignments for each week
    for (let week = 0; week < weeks; week++) {
        const weeklyAssignment = getTasksForWeek(week);

        // Process assignments for each user
        Object.entries(weeklyAssignment).forEach(([userName, tasks]) => {
            userStats[userName].weeklyAssignments[week] = tasks.map(t => t.name);

            tasks.forEach(task => {
                // Update task counts
                userStats[userName].taskCounts[task.name] =
                    (userStats[userName].taskCounts[task.name] || 0) + 1;

                // Update total time
                userStats[userName].totalTime += task.estimatedTime;
            });
        });
    }

    // Calculate statistics
    const totalTimePerUser = Object.entries(userStats).map(([name, stats]) => ({
        name,
        totalTime: stats.totalTime,
        averageTimePerWeek: Math.round(stats.totalTime / weeks)
    }));

    // Print detailed analysis
    console.group(`Task Distribution Analysis (${weeks} weeks)`);

    // Time distribution
    console.group('Time Distribution (minutes)');
    totalTimePerUser.forEach(({name, totalTime, averageTimePerWeek}) => {
        console.log(`${name}:
    Total: ${totalTime}
    Average per week: ${averageTimePerWeek}`);
    });
    console.groupEnd();

    // Task frequency by user
    console.group('Task Distribution by User');
    Object.entries(userStats).forEach(([userName, stats]) => {
        console.group(userName);
        Object.entries(stats.taskCounts)
            .sort((a, b) => b[1] - a[1])
            .forEach(([taskName, count]) => {
                console.log(`${taskName}: ${count} times (${Math.round(count / weeks * 100)}%)`);
            });
        console.groupEnd();
    });
    console.groupEnd();

    // Weekly assignments
    console.group('Weekly Assignments');
    for (let week = 0; week < weeks; week++) {
        console.group(`Week ${week}`);
        Object.entries(userStats).forEach(([userName, stats]) => {
            console.log(`${userName}: ${stats.weeklyAssignments[week].join(', ')}`);
        });
        console.groupEnd();
    }
    console.groupEnd();

    // Fairness metrics
    console.group('Fairness Metrics');
    const timeSpread = Math.max(...totalTimePerUser.map(u => u.totalTime)) -
        Math.min(...totalTimePerUser.map(u => u.totalTime));
    console.log(`Time spread between users: ${timeSpread} minutes`);
    console.log(`Average time per week spread: ${Math.round(timeSpread / weeks)} minutes`);
    console.groupEnd();

    console.groupEnd();
}


// // Example usage:
//
// import {getCurrentWeekNumber} from "./date";
//
// const assigner = new TaskAssigner(tasks, users);
// const weeklyAssignment = assigner.getTasksForWeek(getCurrentWeekNumber());
// console.log(JSON.stringify(weeklyAssignment, null, 2));

// // Test for multiple weeks
// for (let week = 1; week <= 6; week++) {
//     console.log(`Week ${week}:`);
//     const weeklyAssignment = assigner.getTasksForWeek(week);
//     console.log(JSON.stringify(weeklyAssignment, null, 2));
//     console.log('\n');
// }
//
// console.log("User Stats:");
// console.log(JSON.stringify(assigner.getUserStats(), null, 2));