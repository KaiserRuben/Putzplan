import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocalStorage } from "../utils/localstorage.ts";
import { getCurrentWeekNumber } from "../utils/date.ts";
import { motion } from 'framer-motion';
import { FaBroom, FaSprayCan, FaTrashAlt } from 'react-icons/fa';
import Confetti from "./helper/Confetti.tsx";

const WeekOverview: React.FC = () => {
    const [currentUser] = useLocalStorage<string | null>('currentUser', null);
    const weekNumber = getCurrentWeekNumber();
    const [showConfetti, setShowConfetti] = useState(false);
    const [randomGreeting, setRandomGreeting] = useState('');

    const greetings = [
        "Bist du bereit, dein Zuhause zum Strahlen zu bringen? Lass uns die Putzaufgaben dieser Woche in Angriff nehmen!",
        "Bereit für glänzende Räume? Tauchen wir ein in die Reinigungsmissionen dieser Woche!",
        "Zeit, deinen Wohnraum zum Funkeln zu bringen! Stürzen wir uns in die Putzabenteuer der Woche!",
        "Lust auf ein strahlendes Zuhause? Lass uns die Reinigungsherausforderungen dieser Woche meistern!",
        "Auf geht's zum Frühjahrsputz! Entdecke die Freude an einem makellosen Zuhause!",
        "Dein Putzplan wartet auf dich! Gemeinsam machen wir dein Heim blitzeblank!",
        "Bereit für Operation Sauberkeit? Lass uns deine Wohnung in einen Palast verwandeln!",
        "Es ist Putztag! Mach dich bereit für eine Verwandlung deines Zuhauses!",
        "Heute heißt es: Staub ade! Zusammen bringen wir dein Heim zum Glänzen!",
        "Bist du bereit für die Reinigungsrevolution? Lass uns deine Räume neu erstrahlen lassen!",
        "Zeit für frischen Wind in deinen vier Wänden! Starte mit uns in die Putzwoche!",
        "Dein Zuhause verdient Spitzenglanz! Lass uns gemeinsam loslegen!",
        "Putzpartytime! Gemeinsam machen wir Sauberkeit zum Vergnügen!",
        "Bereit für die Reinigungsrallye? Auf die Plätze, fertig, putzen!",
        "Mach dich bereit für strahlende Momente! Wir nehmen uns jeden Raum vor!",
        "Es ist Zeit für Ordnung und Glanz! Lass uns dein Zuhause verwöhnen!",
        "Die Putzchallenge ruft! Zeig deinem Zuhause, wie sehr du es schätzt!",
        "Sauberkeit steht an erster Stelle! Lass uns deine Wohnung in Topform bringen!",
        "Heute ist Putztag - mach mit und erlebe, wie schön Sauberkeit sein kann!",
        "Bereit für ein Reinigungsabenteuer? Lass uns dein Zuhause zum Juwel machen!"
    ];

    useEffect(() => {
        setShowConfetti(true);
        const timer = setTimeout(() => setShowConfetti(false), 1000);
        setRandomGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
        return () => clearTimeout(timer);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 120,
                damping: 20,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 24
            }
        }
    };

    const cleaningIcons = [FaBroom, FaSprayCan, FaTrashAlt];

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-orange-300 p-8">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-2xl mx-auto"
            >
                <motion.h1
                    variants={itemVariants}
                    className="text-4xl font-extrabold text-purple-600 mb-6 text-center"
                >
                    Woche {weekNumber} Putzabenteuer!
                </motion.h1>

                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-lg p-6 mb-8"
                >
                    <p className="text-2xl font-bold text-gray-800 mb-2">
                        Willkommen, <span className="text-indigo-600">{currentUser}</span>!
                    </p>
                    <p className="text-lg text-gray-600">
                        {randomGreeting}
                    </p>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-3 gap-4 mb-8"
                >
                    {cleaningIcons.map((Icon, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center"
                        >
                            <Icon className="text-4xl text-indigo-500" />
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Link
                        to="/tasks"
                        className="block w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-center text-xl font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Deine Aufgaben anzeigen
                    </Link>
                </motion.div>
            </motion.div>


            <Confetti show={showConfetti} /> {/* Fügen Sie die Konfetti-Komponente hier ein */}

        </div>
    );
};

export default WeekOverview;