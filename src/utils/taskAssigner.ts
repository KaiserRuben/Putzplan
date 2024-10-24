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
    frequency: 'weekly' | 'bi-weekly' | 'monthly';
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

type Frequency = 'weekly' | 'bi-weekly' | 'monthly' | 'bi-monthly';

export class TaskAssigner {
    private tasks: Task[];
    private users: User[];
    private weeklyRotationIndex: number = 0;

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
            'bi-monthly': 8
        };
        return week % frequencyMap[task.frequency] === 0;
    }

    private distributeTasksEvenly(weekTasks: Task[]): WeeklyAssignment {
        const assignment: { [userName: string]: Task[] } = {};
        this.users.forEach(user => assignment[user.name] = []);

        // Sort tasks by frequency (less frequent first) and then by estimated time (longer first)
        weekTasks.sort((a, b) => {
            const freqOrder = {'monthly': 0, 'bi-weekly': 1, 'weekly': 2};
            if (freqOrder[a.frequency] !== freqOrder[b.frequency]) {
                return freqOrder[a.frequency] - freqOrder[b.frequency];
            }
            return 0
        });

        // Distribute tasks
        weekTasks.forEach((task, index) => {
            const userIndex = (this.weeklyRotationIndex + index) % this.users.length;
            const user = this.users[userIndex];
            assignment[user.name].push(task);
            user.taskCounts[task.id]++;
            user.totalTime += task.estimatedTime;
        });

        // Rotate starting point for next week
        this.weeklyRotationIndex = (this.weeklyRotationIndex + 1) % this.users.length;

        return assignment as WeeklyAssignment;
    }

    getTasksForWeek(week: number): WeeklyAssignment {
        const weekTasks = this.getTasksDueThisWeek(week);
        return this.distributeTasksEvenly(weekTasks);
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