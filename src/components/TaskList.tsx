import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getTasksForWeek, Task } from "../utils/taskAssigner";
import { useLocalStorage } from "../utils/localstorage.ts";
import { getCurrentWeekNumber } from "../utils/date.ts";
import { FaScroll, FaListUl, FaTrophy, FaClock, FaRedo } from 'react-icons/fa';

const TaskList: React.FC = () => {
    const [viewMode, setViewMode] = useState<'full' | 'subtasks'>('full');
    const [currentUser] = useLocalStorage<string | null>('currentUser', null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const weekNumber = getCurrentWeekNumber();

    useEffect(() => {
        if (currentUser) {
            const userTasks = getTasksForWeek(weekNumber)[currentUser] || [];
            setTasks(userTasks);
        }
    }, [currentUser, weekNumber]);

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-pink-200 to-purple-300">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-xl shadow-lg text-center"
                >
                    <h2 className="text-2xl font-bold text-purple-600 mb-4">Hoppla! Kein Reiniger ausgewählt</h2>
                    <p className="text-gray-600 mb-6">Bitte wählen Sie zuerst Ihren Reinigungshelden!</p>
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 24
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-300 p-8">
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
            >
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-2">
                    Woche {weekNumber} Aufgaben
                </h1>
                <p className="text-xl text-gray-700">Deine Reinigungsabenteuer warten, tapferer {currentUser}!</p>
            </motion.div>

            <motion.div
                className="mb-6 flex justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <button
                    onClick={() => setViewMode('full')}
                    className={`mr-2 px-6 py-3 rounded-full font-bold transition duration-300 ease-in-out ${
                        viewMode === 'full'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-white text-indigo-600 hover:bg-indigo-100'
                    }`}
                >
                    <FaScroll className="inline-block mr-2" /> Vollständige Aufgaben
                </button>
                <button
                    onClick={() => setViewMode('subtasks')}
                    className={`px-6 py-3 rounded-full font-bold transition duration-300 ease-in-out ${
                        viewMode === 'subtasks'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-white text-indigo-600 hover:bg-indigo-100'
                    }`}
                >
                    <FaListUl className="inline-block mr-2" /> Teilaufgaben
                </button>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
            >
                <AnimatePresence>
                    {tasks.map((task) => (
                        <motion.div
                            key={task.id}
                            variants={itemVariants}
                            layout
                            className="bg-white rounded-xl shadow-lg p-6 transform transition duration-300 ease-in-out hover:scale-105"
                        >
                            <h2 className="text-2xl font-bold text-indigo-600 mb-3">{task.name}</h2>
                            {viewMode === 'full' ? (
                                <>
                                    <p className="text-gray-600 mb-2">
                                        <FaClock className="inline-block mr-2 text-indigo-400" />
                                        Zeit: {task.estimatedTime} Minuten
                                    </p>
                                    <p className="text-gray-600 mb-4">
                                        <FaRedo className="inline-block mr-2 text-indigo-400" />
                                        Häufigkeit: {task.frequency}
                                    </p>
                                    <Link
                                        to={`/task/${task.id}`}
                                        className="inline-block bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                                    >
                                        <FaTrophy className="inline-block mr-2" /> Aufgabe starten
                                    </Link>
                                </>
                            ) : (
                                <ul className="list-disc list-inside space-y-2">
                                    {task.subtasks.map((subtask) => (
                                        <li key={subtask.id} className="text-gray-700">
                                            {subtask.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default TaskList;