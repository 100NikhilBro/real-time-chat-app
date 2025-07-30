// hooks/useAccessChat.js
import { useMutation } from '@tanstack/react-query';
import { chatInstance } from '../axiosInstance/chatInstance';

const accessChatApi = async(userId) => {
    const response = await chatInstance.post('/access', { userId });
    return response.data.chat;
};

export const useAccessChat = () => {
    return useMutation({
        mutationFn: accessChatApi,
    });
};