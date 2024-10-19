import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getTasksForWeek, Task } from "../utils/taskAssigner";
import { useLocalStorage } from "../utils/localstorage.ts";
import { getCurrentWeekNumber } from "../utils/date.ts";
import { FaClock, FaRedo, FaExclamationTriangle, FaTrophy, FaArrowLeft } from 'react-icons/fa';

const TaskDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [currentUser] = useLocalStorage<string | null>('currentUser', null);
    const [task, setTask] = useState<Task | null>(null);
    const weekNumber = getCurrentWeekNumber();

    useEffect(() => {
        if (currentUser && id) {
            const userTasks = getTasksForWeek(weekNumber)[currentUser] || [];
            const foundTask = userTasks.find((t) => t.id === parseInt(id));
            setTask(foundTask || null);
        }
    }, [currentUser, id, weekNumber]);

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-pink-200 to-purple-300">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-xl shadow-lg text-center"
                >
                    <h2 className="text-2xl font-bold text-purple-600 mb-4">Ups! Kein Putz-Held ausgewählt</h2>
                    <p className="text-gray-600 mb-6">Bitte wähle zuerst deinen Putz-Helden aus!</p>
                    <Link
                        to="/"
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Held auswählen
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (!task) return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-pink-200 to-purple-300">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-xl shadow-lg text-center"
            >
                <h2 className="text-2xl font-bold text-purple-600 mb-4">Quest nicht gefunden</h2>
                <p className="text-gray-600 mb-6">Diese Reinigungsmission scheint nicht zu existieren!</p>
                <Link
                    to="/tasks"
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                >
                    Zurück zur Questliste
                </Link>
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-200 to-blue-300 p-8">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Link to="/tasks" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition duration-300 ease-in-out transform hover:translate-x-2">
                    <FaArrowLeft className="mr-2" /> Zurück zur Questliste
                </Link>
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-6">
                    {task.name}
                </h1>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6 mb-8"
            >
                <p className="text-xl text-gray-700 mb-4 flex items-center">
                    <FaClock className="mr-2 text-green-500" /> Zeit: {task.estimatedTime} Minuten
                </p>
                <p className="text-xl text-gray-700 flex items-center">
                    <FaRedo className="mr-2 text-blue-500" /> Häufigkeit: {task.frequency}
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                    <FaTrophy className="mr-2" /> Unter-Quests
                </h2>
                <ul className="space-y-4">
                    <AnimatePresence>
                        {task.subtasks.map((subtask) => (
                            <motion.li
                                key={subtask.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white rounded-lg shadow p-4"
                            >
                                <h3 className="text-xl font-semibold text-indigo-600 mb-2">{subtask.name}</h3>
                                <p className="text-gray-600 mb-2">{subtask.description}</p>
                                {subtask.cautions && (
                                    <p className="text-red-600 flex items-center">
                                        <FaExclamationTriangle className="mr-2" /> Achtung: {subtask.cautions}
                                    </p>
                                )}
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            </motion.div>
        </div>
    );
};

export default TaskDetail;