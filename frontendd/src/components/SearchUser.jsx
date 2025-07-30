import React, { useState, useEffect } from 'react';
import axios from '../axiosInstance/userInstance';
import { useQuery } from '@tanstack/react-query';
import useDebounce from '../hooks/useDebounce';
import { Search, Loader } from 'lucide-react'; 

const SearchUser = ({ setSearchResults }) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['search-users', debouncedSearch],
    queryFn: async () => {
      const res = await axios.get(`/search?search=${debouncedSearch}`);
      return res.data;
    },
    enabled: false,
  });

  useEffect(() => {
    if (debouncedSearch.trim()) {
      refetch();
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch, refetch, setSearchResults]);

  useEffect(() => {
    if (data) {
      setSearchResults(data);
    }
  }, [data, setSearchResults]);

  return (
    <div className="mb-6">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 pl-10 rounded-lg bg-[#161B22] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-md transition-all duration-200"
          placeholder="Search users by name or email..."
        />
        <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

     
      {isLoading && (
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
          <Loader className="animate-spin h-4 w-4 text-cyan-400" />
          Searching...
        </div>
      )}
    </div>
  );
};

export default SearchUser;
