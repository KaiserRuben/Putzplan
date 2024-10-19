import {tasks as data} from '../../data.json';

interface Subtask {
    id: number;
    name: string;
    description: string;
    cleaningProducts: string[];
    tips: string;
    cautions: string;
}

interface Task {
    id: number;
    name: string;
    frequency: 'weekly' | 'bi-weekly' | 'monthly';
    estimatedTime: number;
    subtasks: Subtask[];
}


interface User {
    name: string;
    taskCounts: { [taskId: number]: number };
    totalTime: number;
}

type Frequency = 'weekly' | 'bi-weekly' | 'monthly';

class TaskAssigner {
    private tasks: Task[];
    private users: User[];
    private weeklyRotationIndex: number = 0;

    constructor(tasks: Task[], users: string[]) {
        if (tasks.length === 0 || users.length === 0) {
            throw new Error("Tasks and users arrays cannot be empty");
        }
        this.tasks = tasks;
        this.users = users.map(name => ({
            name,
            taskCounts: this.tasks.reduce((acc, task) => ({ ...acc, [task.id]: 0 }), {}),
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
            'monthly': 4
        };
        return week % frequencyMap[task.frequency] === 0;
    }

    private distributeTasksEvenly(weekTasks: Task[]): { [userName: string]: Task[] } {
        const assignment: { [userName: string]: Task[] } = {};
        this.users.forEach(user => assignment[user.name] = []);

        // Sort tasks by frequency (less frequent first) and then by estimated time (longer first)
        weekTasks.sort((a, b) => {
            const freqOrder = { 'monthly': 0, 'bi-weekly': 1, 'weekly': 2 };
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

        return assignment;
    }

    getTasksForWeek(week: number): { [userName: string]: Task[] } {
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

// Example usage:
const tasks: Task[] = data as Task[];

const users = ["Alice", "Bob", "Charlie"];

const assigner = new TaskAssigner(tasks, users);

// Test for multiple weeks
for (let week = 1; week <= 6; week++) {
    console.log(`Week ${week}:`);
    const weeklyAssignment = assigner.getTasksForWeek(week);
    console.log(JSON.stringify(weeklyAssignment, null, 2));
    console.log('\n');
}

console.log("User Stats:");
console.log(JSON.stringify(assigner.getUserStats(), null, 2));