import axios from 'axios';

const AI_SERVICE_URL = 'http://localhost:5000/api/ai'; // Update with your actual AI service URL

export const getTaskSuggestions = async (userId) => {
    try {
        const response = await axios.get(`${AI_SERVICE_URL}/task-suggestions`, {
            params: { userId }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching task suggestions:', error);
        throw error;
    }
};

export const automateTaskAssignment = async (taskId, userId) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/automate-task`, {
            taskId,
            userId
        });
        return response.data;
    } catch (error) {
        console.error('Error automating task assignment:', error);
        throw error;
    }
};

export const getUserAssistance = async (query) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/user-assistance`, {
            query
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user assistance:', error);
        throw error;
    }
};