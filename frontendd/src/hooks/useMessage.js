import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageInstance } from '../axiosInstance/messageInstance';


export const useMessages = (chatId) => {
    return useQuery({
        queryKey: ['messages', chatId],
        queryFn: async() => {
            const { data } = await messageInstance.get(`/message/${chatId}`);
            return data.messages;
        },
        enabled: !!chatId, // Only fetch if chatId exists -> yeh same cheej apun protectedRoutes mein bhi use krte hai 
    });
};



// Send a new message
export const useSendMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async({ chatId, content, file }) => {
            const formData = new FormData();
            formData.append('content', content);
            if (file) formData.append('file', file);

            const { data } = await messageInstance.post(`chat/${chatId}/message`, formData);
            return data.data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['messages', variables.chatId] });
        },
    });
};