
import React, { useState } from 'react';
import userInstance from '../axiosInstance/userInstance';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { LoaderCircle, User } from 'lucide-react';
import SearchUser from './SearchUser';
import '../css/scroll.css'

const fetchAllUsers = async () => {
  const { data } = await userInstance.get('/allusers');
  return data;
};

const fetchMyProfile = async () => {
  const { data } = await userInstance.get('/myprofile');
  return data;
};

const UserList = ({ onUserSelect }) => {
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const { data: usersData, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
  });

  const { data: myProfile, isLoading: isLoadingProfile, isError: isErrorProfile } = useQuery({
    queryKey: ['myProfile'],
    queryFn: fetchMyProfile,
  });

  if (isLoading || isLoadingProfile) {
    return (
      <div className="h-screen bg-[#0D1117] flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-800">
        <LoaderCircle className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (isError || isErrorProfile) {
    return (
      <div className="h-screen bg-[#0D1117] flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-800 text-red-500">
        Error loading data
      </div>
    );
  }

  const usersToShow = searchResults.length > 0 ? searchResults : usersData?.users;

  return (
    <div className="user-List h-screen bg-[#0D1117] text-white p-4 overflow-y-auto hide-scrollbar border-b md:border-b-0 md:border-r border-gray-800 shadow-md">

      {/* Logged-in User */}
      <div
        className="flex items-center gap-4 bg-[#1E293B] rounded-xl p-3 mb-6 hover:bg-[#293241] border border-cyan-400 shadow-md cursor-pointer"
        onClick={() => navigate('/profile')}
      >
        {myProfile?.user?.avatar?.url ? (
          <img
            src={myProfile.user.avatar.url}
            alt="avatar"
            className="h-12 w-12 rounded-full object-cover border border-cyan-400"
          />
        ) : (
          <User className="w-10 h-10 text-gray-700 rounded-full border p-1" />
        )}
        <div>
          <p className="text-lg font-semibold">{myProfile?.user?.name}</p>
          <p className="text-xs text-gray-400">Your Profile</p>
        </div>
      </div>

      {/* Search */}
      <SearchUser onUserSelect={onUserSelect} setSearchResults={setSearchResults} />

      {/*  All Users */}
      <div>
        {usersToShow?.map((u) => (
          <div
            key={u._id}
            onClick={() => onUserSelect(u)}
            className="flex items-center gap-4 bg-[#161B22] rounded-xl p-3 mb-3 hover:bg-[#1f2630] transition duration-300 border border-transparent hover:border-cyan-400 cursor-pointer"
          >
            {u?.avatar?.url ? (
              <img
                src={u.avatar.url}
                alt="avatar"
                className="h-12 w-12 rounded-full object-cover border border-cyan-400"
              />
            ) : (
              <User className="w-10 h-10 text-gray-700 rounded-full border p-1" />
            )}
            <p className="text-lg font-medium">{u.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;






