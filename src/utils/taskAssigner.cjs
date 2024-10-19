"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var data_json_1 = require("../../data.json");
var TaskAssigner = /** @class */ (function () {
    function TaskAssigner(tasks, users) {
        var _this = this;
        this.weeklyRotationIndex = 0;
        if (tasks.length === 0 || users.length === 0) {
            throw new Error("Tasks and users arrays cannot be empty");
        }
        this.tasks = tasks;
        this.users = users.map(function (name) { return ({
            name: name,
            taskCounts: _this.tasks.reduce(function (acc, task) {
                var _a;
                return (__assign(__assign({}, acc), (_a = {}, _a[task.id] = 0, _a)));
            }, {}),
            totalTime: 0
        }); });
    }
    TaskAssigner.prototype.getTasksDueThisWeek = function (week) {
        var _this = this;
        return this.tasks.filter(function (task) { return _this.isTaskDueThisWeek(task, week); });
    };
    TaskAssigner.prototype.isTaskDueThisWeek = function (task, week) {
        var frequencyMap = {
            'weekly': 1,
            'bi-weekly': 2,
            'monthly': 4
        };
        return week % frequencyMap[task.frequency] === 0;
    };
    TaskAssigner.prototype.distributeTasksEvenly = function (weekTasks) {
        var _this = this;
        var assignment = {};
        this.users.forEach(function (user) { return assignment[user.name] = []; });
        // Sort tasks by frequency (less frequent first) and then by estimated time (longer first)
        weekTasks.sort(function (a, b) {
            var freqOrder = { 'monthly': 0, 'bi-weekly': 1, 'weekly': 2 };
            if (freqOrder[a.frequency] !== freqOrder[b.frequency]) {
                return freqOrder[a.frequency] - freqOrder[b.frequency];
            }
            return 0;
        });
        // Distribute tasks
        weekTasks.forEach(function (task, index) {
            var userIndex = (_this.weeklyRotationIndex + index) % _this.users.length;
            var user = _this.users[userIndex];
            assignment[user.name].push(task);
            user.taskCounts[task.id]++;
            user.totalTime += task.estimatedTime;
        });
        // Rotate starting point for next week
        this.weeklyRotationIndex = (this.weeklyRotationIndex + 1) % this.users.length;
        return assignment;
    };
    TaskAssigner.prototype.getTasksForWeek = function (week) {
        var weekTasks = this.getTasksDueThisWeek(week);
        return this.distributeTasksEvenly(weekTasks);
    };
    TaskAssigner.prototype.getUserStats = function () {
        var _this = this;
        var stats = {};
        this.users.forEach(function (user) {
            stats[user.name] = {
                totalTime: user.totalTime,
                taskCounts: {}
            };
            var _loop_1 = function (taskId) {
                var task = _this.tasks.find(function (t) { return t.id === Number(taskId); });
                if (task) {
                    stats[user.name].taskCounts[task.name] = user.taskCounts[taskId];
                }
            };
            for (var taskId in user.taskCounts) {
                _loop_1(taskId);
            }
        });
        return stats;
    };
    return TaskAssigner;
}());
// Example usage:
var tasks = data_json_1.tasks;
var users = ["Alice", "Bob", "Charlie"];
var assigner = new TaskAssigner(tasks, users);
// Test for multiple weeks
for (var week = 1; week <= 6; week++) {
    console.log("Week ".concat(week, ":"));
    var weeklyAssignment = assigner.getTasksForWeek(week);
    console.log(JSON.stringify(weeklyAssignment, null, 2));
    console.log('\n');
}
console.log("User Stats:");
console.log(JSON.stringify(assigner.getUserStats(), null, 2));
