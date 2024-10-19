import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserSelection from './components/UserSelection';
import WeekOverview from './components/WeekOverview';
import TaskList from './components/TaskList';
import TaskDetail from './components/TaskDetail';
import {useLocalStorage} from "./utils/localstorage.ts";


const App: React.FC = () => {
    const [user] = useLocalStorage<string | null>('currentUser', null);


    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <Routes>
                    <Route path="/" element={user ? <WeekOverview /> : <UserSelection />} />
                    <Route path="/tasks" element={<TaskList />} />
                    <Route path="/task/:id" element={<TaskDetail />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;