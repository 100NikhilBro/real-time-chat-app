import userInstannce from "../axiosInstance/userInstance";
import { useQuery } from '@tanstack/react-query';

const fetchCurrentUser = async() => {
    const res = await userInstannce.get('/myprofile');
    return res.data.user;
};



export const useCurrentUser = () => {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: fetchCurrentUser,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
};