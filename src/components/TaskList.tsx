import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {getTasksForWeek, Task} from "../utils/taskAssigner";
import {useLocalStorage} from "../utils/localstorage.ts";
import {getCurrentWeekNumber} from "../utils/date.ts";
import {motion, AnimatePresence} from 'framer-motion';
import {FaClock, FaRedo, FaChevronDown, FaChevronUp} from 'react-icons/fa';
const TaskList: React.FC = () => {
    const [viewMode, setViewMode] = useState<'full' | 'subtasks'>('full');
    const [currentUser] = useLocalStorage<string | null>('currentUser', null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [expandedTask, setExpandedTask] = useState<number | null>(1);
    const weekNumber = getCurrentWeekNumber();

    useEffect(() => {
        if (currentUser) {
            const userTasks = getTasksForWeek(weekNumber)[currentUser] || [];
            setTasks(userTasks);
        }
    }, [currentUser, weekNumber]);

    if (!currentUser) {
        return <div className="text-center p-4 text-xl font-bold text-red-500">Bitte wähle zuerst einen Benutzer
            aus</div>;
    }

    const translateFrequency = (frequency: string) => {
        switch (frequency) {
            case 'weekly':
                return 'Wöchentlich';
            case 'bi-weekly':
                return 'Alle zwei Wochen';
            case 'monthly':
                return 'Monatlich';
            default:
                return frequency;
        }
    };

    const containerVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: {y: 20, opacity: 0},
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
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
            <motion.div
                initial={{y: -50, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{duration: 0.5}}
                className="text-center mb-8"
            >
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                    Putz-Quests für Woche {weekNumber}
                </h1>
                <p className="text-xl text-gray-600">Lass uns deine Wohnung zum Strahlen bringen!</p>
            </motion.div>

            <div className="mb-6 flex justify-center">
                <button
                    onClick={() => setViewMode('full')}
                    className={`mr-2 px-6 py-2 rounded-full text-lg font-semibold transition-colors duration-300 ${viewMode === 'full' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-purple-200'}`}
                >
                    Volle Quests
                </button>
                <button
                    onClick={() => setViewMode('subtasks')}
                    className={`px-6 py-2 rounded-full text-lg font-semibold transition-colors duration-300 ${viewMode === 'subtasks' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-purple-200'}`}
                >
                    Unter-Quests
                </button>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
            >
                {tasks.map((task) => (
                    <motion.div
                        key={task.id}
                        variants={itemVariants}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden"
                    >
                        <Link to={`/task/${task.id}`}>
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 cursor-pointer">
                                <h2 className="text-2xl font-bold text-white mb-2">{task.name}</h2>
                                <div className="flex items-center text-indigo-100">
                                    <FaClock className="mr-2"/>
                                    <span>{task.estimatedTime} Minuten</span>
                                    <FaRedo className="ml-4 mr-2"/>
                                    <span>{translateFrequency(task.frequency)}</span>
                                </div>
                            </div>
                        </Link>

                        {viewMode === 'full' ? (
                            <div></div>
                        ) : (
                            <AnimatePresence>
                                {expandedTask === task.id && (
                                    <motion.div
                                        initial={{height: 0, opacity: 0}}
                                        animate={{height: 'auto', opacity: 1}}
                                        exit={{height: 0, opacity: 0}}
                                        transition={{duration: 0.3}}
                                        className="p-6"
                                    >
                                        <ul className="space-y-4">
                                            {task.subtasks.map((subtask, index) => (
                                                <li key={subtask.id} className="bg-gray-100 p-4 rounded-xl shadow-md">
                                                    <Link to={`/task/${task.id}?subtask=${index}`} className="block">
                                                        <h3 className="text-lg font-bold text-gray-800 hover:text-purple-600 transition-colors duration-200">
                                                            {subtask.name}
                                                        </h3>
                                                        <p className="text-gray-600">{subtask.description}</p>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                                <div
                                    className="p-4 flex justify-center text-purple-500 cursor-pointer"
                                    onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                                >
                                    {expandedTask === task.id ? <FaChevronUp/> : <FaChevronDown/>}
                                </div>
                            </AnimatePresence>
                        )}
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default TaskList;