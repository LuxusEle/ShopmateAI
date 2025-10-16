import React from 'react';
import TaskBoard from '../components/tasks/TaskBoard';

const Tasks: React.FC = () => {
    return (
        <div className="tasks-page">
            <h1>Task Management</h1>
            <TaskBoard />
        </div>
    );
};

export default Tasks;