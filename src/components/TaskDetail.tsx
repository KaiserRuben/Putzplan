import React, { useState, useEffect } from 'react';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {getTasksForWeek, Subtask, Task} from "../utils/taskAssigner";
import { useLocalStorage } from "../utils/localstorage.ts";
import { getCurrentWeekNumber } from "../utils/date.ts";
import confetti from 'canvas-confetti';
import {
    FaExclamationTriangle,
    FaSprayCan,
    FaLightbulb,
    FaChevronLeft,
    FaChevronRight,
    FaTimes,
    FaCheck,
    FaUndo,
    FaFire
} from 'react-icons/fa';

const TaskDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const weekNumber = getCurrentWeekNumber();
    const yearNumber = new Date().getFullYear();
    const [currentUser] = useLocalStorage<string | null>('currentUser', null);
    const [task, setTask] = useState<Task | null>(null);
    const [currentSubtaskIndex, setCurrentSubtaskIndex] = useState(0);
    const [completedSubtasks, setCompletedSubtasks] = useLocalStorage<number[]>(`completedSubtasks-${id}-${weekNumber}-${yearNumber}`, []);
    const [streak, setStreak] = useLocalStorage<number>('cleaningStreak', 0);

    useEffect(() => {
        if (currentUser && id) {
            const userTasks = getTasksForWeek(weekNumber)[currentUser] || [];
            const foundTask = userTasks.find((t) => t.id === parseInt(id));
            setTask(foundTask || null);

            // Parse the subtask index from the URL
            const searchParams = new URLSearchParams(location.search);
            const subtaskIndex = searchParams.get('subtask');
            if (subtaskIndex !== null) {
                setCurrentSubtaskIndex(parseInt(subtaskIndex));
            }
        }
    }, [currentUser, id, weekNumber, location]);


    const handlePrevSubtask = () => {
        setCurrentSubtaskIndex((prev) => (prev > 0 ? prev - 1 : task!.subtasks.length - 1));
    };

    const handleNextSubtask = () => {
        setCurrentSubtaskIndex((prev) => (prev < task!.subtasks.length - 1 ? prev + 1 : 0));
    };

    const handleExit = () => {
        navigate('/tasks');
    };

    const handleCompleteSubtask = () => {
        if (task) {
            if (completedSubtasks.includes(currentSubtaskIndex)) {
                // Uncomplete the subtask
                const newCompletedSubtasks = completedSubtasks.filter(index => index !== currentSubtaskIndex);
                setCompletedSubtasks(newCompletedSubtasks);
                if (newCompletedSubtasks.length < task.subtasks.length) {
                    setStreak(streak - 1);
                }
            } else {
                // Complete the subtask
                const newCompletedSubtasks = [...completedSubtasks, currentSubtaskIndex];
                setCompletedSubtasks(newCompletedSubtasks);
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                if (newCompletedSubtasks.length === task.subtasks.length) {
                    setStreak(streak + 1);
                }
            }
            handleNextSubtask();
        }
    };

    if (!task) return null;

    const currentSubtask = task.subtasks[currentSubtaskIndex];
    const progress = (completedSubtasks.length / task.subtasks.length) * 100;
    const isCurrentSubtaskCompleted = completedSubtasks.includes(currentSubtaskIndex);

    const renderEnhancedProgressBar = () => {
        return (
            <div className="bg-gray-100 rounded-full h-3 sm:h-4 mb-4 sm:mb-6 overflow-hidden flex">
                {task.subtasks.map((_, index) => {
                    const isCompleted = completedSubtasks.includes(index);
                    const isCurrent = index === currentSubtaskIndex;
                    let bgColor = 'bg-gray-300';

                    if (isCompleted) {
                        bgColor = 'bg-emerald-500';
                    } else if (isCurrent) {
                        bgColor = 'bg-indigo-500';
                    }

                    return (
                        <motion.div
                            key={index}
                            className={`${bgColor} h-full`}
                            style={{ width: `${100 / task.subtasks.length}%` }}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <div className="h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4 flex flex-col">
            {streak > 0 && (
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.3}}
                    className="bg-gradient-to-r from-orange-400 to-red-400 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FaFire className="text-yellow-300 text-xl sm:text-2xl mr-2 sm:mr-3 flex-shrink-0"/>
                            <div>
                                <p className="text-white text-sm sm:text-xl font-bold">
                                    {streak} Day{streak > 1 ? 's' : ''} Streak!
                                </p>
                                <p className="text-yellow-100 text-xs sm:text-sm">
                                    {streak > 1 ? 'Du bist in Topform! 🔥' : 'Toller Start! Weiter so!'}
                                </p>
                            </div>
                        </div>
                        <div className="text-2xl sm:text-4xl font-bold text-yellow-300">
                            {streak}
                        </div>
                    </div>
                    {streak > 1 && (
                        <motion.div
                            initial={{width: 0}}
                            animate={{width: '100%'}}
                            transition={{duration: 0.5, delay: 0.2}}
                            className="h-1 sm:h-2 bg-yellow-300 mt-2 sm:mt-3 rounded-full"
                        />
                    )}
                </motion.div>
            )}

            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.3}}
                className="bg-white rounded-lg shadow-lg p-4 sm:p-6 flex-grow flex flex-col overflow-hidden"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-purple-600">{currentSubtask.name}</h2>
                </div>

                {renderEnhancedProgressBar()}

                <div className="text-sm sm:text-lg text-gray-600 mb-2 sm:mb-4 flex justify-between items-center">
                    <span>{completedSubtasks.length}/{task.subtasks.length} subtasks completed</span>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 mr-1"></div>
                        <span className="text-xs mr-2">Completed</span>
                        <div className="w-3 h-3 rounded-full bg-indigo-500 mr-1"></div>
                        <span className="text-xs mr-2">Current</span>
                        <div className="w-3 h-3 rounded-full bg-gray-300 mr-1"></div>
                        <span className="text-xs">Pending</span>
                    </div>
                </div>


                <div className="flex-grow overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSubtaskIndex}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -20}}
                            transition={{duration: 0.3}}
                            className="flex flex-col"
                        >

                            <motion.div
                                className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg"
                                whileHover={{scale: 1.02}}
                                transition={{type: "spring", stiffness: 300}}
                            >
                                <p className="text-white text-lg sm:text-2xl font-semibold leading-relaxed">
                                    {currentSubtask.description}
                                </p>
                            </motion.div>

                            {currentSubtask.cautions && (
                                <div className="bg-red-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                                    <p className="text-red-600 flex items-center text-sm sm:text-xl">
                                        <FaExclamationTriangle
                                            className="mr-2 flex-shrink-0"/> {currentSubtask.cautions}
                                    </p>
                                </div>
                            )}

                            {currentSubtask.cleaningProducts && (
                                <div className="bg-green-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                                    <h4 className="text-lg sm:text-xl font-semibold text-green-600 flex items-center mb-2">
                                        <FaSprayCan className="mr-2 flex-shrink-0"/> Reinigungsprodukte
                                    </h4>
                                    <ul className="list-disc list-inside text-sm sm:text-lg text-gray-700">
                                        {currentSubtask.cleaningProducts.map((product: string, index: number) => (
                                            <li key={index} className="mb-1 sm:mb-2">{product}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {currentSubtask.tips && (
                                <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 mt-3 sm:mt-4">
                                    <div className="flex items-start">
                                        <FaLightbulb
                                            className="text-yellow-500 text-lg sm:text-xl mr-2 mt-1 flex-shrink-0"/>
                                        <p className="text-sm sm:text-lg text-gray-700">{currentSubtask.tips}</p>
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>

                <motion.button
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    onClick={handleCompleteSubtask}
                    className={`w-full ${isCurrentSubtaskCompleted ? 'bg-yellow-500' : 'bg-green-500'} text-white p-3 sm:p-4 rounded-full shadow-md text-xl sm:text-2xl font-semibold mt-4 sm:mt-6 flex items-center justify-center`}
                >
                    {isCurrentSubtaskCompleted ? (
                        <>
                            <FaUndo className="mr-2"/> Als unerledigt markieren
                        </>
                    ) : (
                        <>
                            <FaCheck className="mr-2"/> Als erledigt markieren
                        </>
                    )}
                </motion.button>
            </motion.div>

            <div className="flex justify-between items-center mt-4">
                <motion.button
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9}}
                    onClick={handlePrevSubtask}
                    className="bg-purple-600 text-white p-3 sm:p-4 rounded-full shadow-md text-xl sm:text-2xl"
                >
                    <FaChevronLeft/>
                </motion.button>
                <motion.button
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9}}
                    onClick={handleExit}
                    className="bg-red-500 text-white p-3 sm:p-4 rounded-full shadow-md text-xl sm:text-2xl"
                >
                    <FaTimes/>
                </motion.button>
                <motion.button
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9}}
                    onClick={handleNextSubtask}
                    className="bg-purple-600 text-white p-3 sm:p-4 rounded-full shadow-md text-xl sm:text-2xl"
                >
                    <FaChevronRight/>
                </motion.button>
            </div>
        </div>
    );
};

export default TaskDetail;