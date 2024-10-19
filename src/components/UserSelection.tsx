import React from 'react';
import {useNavigate} from 'react-router-dom';
import {useLocalStorage} from "../utils/localstorage.ts";
import {getUsers} from "../utils/taskAssigner.ts";
import {motion} from 'framer-motion';
import {FaUser} from 'react-icons/fa';

const UserSelection: React.FC = () => {
    const navigate = useNavigate();
    const [, setCurrentUser] = useLocalStorage<string | null>('currentUser', null);

    const users = getUsers()

    const handleUserSelect = (user: string) => {
        setCurrentUser(user);
        navigate(0);
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

    const getRandomColor = () => {
        const colors = ['bg-pink-400', 'bg-purple-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-red-400'];
        return colors[Math.floor(Math.random() * colors.length)];
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
                    Wer ist motiviert, sauber zu machen?
                </h1>
                <p className="text-xl text-gray-600">Klick auf deinen Namen.</p>
            </motion.div>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-6"
            >
                {users.map(u => u.name).map((user) => (
                    <motion.button
                        key={user}
                        variants={itemVariants}
                        onClick={() => handleUserSelect(user)}
                        className={`${getRandomColor()} p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-blue-300`}
                    >
                        <div className="flex flex-col items-center">
                            <FaUser className="text-white text-4xl mb-3"/>
                            <span className="text-white font-bold text-lg">{user}</span>
                        </div>
                    </motion.button>
                ))}
            </motion.div>
            <div className="flex justify-center mt-10">
                <p className="text-xs text-gray-500 text-center">Deine Einstellungen werden auf dem Gerät gespeichert.</p>
            </div>

        </div>
    );
};

export default UserSelection;