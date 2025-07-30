import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userInstance from '../axiosInstance/userInstance';
import {
  Loader,
  AlertCircle,
  Upload,
  Save,
  UserCircle,
  Trash2,
  LogOut,
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';


const getMyProfile = async () => {
  const { data } = await userInstance.get('/myprofile');
  return data;
};




const updateProfile = async (updatedData) => {
  const { data } = await userInstance.put('/updateprofile', updatedData);
  return data;
};

const uploadAvatar = async (formData) => {
  const { data } = await userInstance.post('/uploadprofilepic', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};


const deleteAccount = async () => {
  const { data } = await userInstance.delete('/deletemyaccount');
  return data;
};


const logoutUser = async () => {
  const { data } = await userInstance.post('/logout');
  return data;
};





// ========================Profile-Page================================ 

const ProfilePage = () => {
  const queryClient = useQueryClient();


  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['myprofile'],
    queryFn: getMyProfile,
  });



  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });


  useEffect(() => {
    if (data?.user) {
      setFormData({
        name: data.user.name,
        email: data.user.email,
        password: '',
      });
    }
  }, [data]);

  


  const { mutate: updateUser, isPending: updating } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries(['myprofile']);
      setFormData(prev => ({ ...prev, password: '' }));
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Update failed!');
    }
  });




  const { mutate: uploadImage } = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: () => {
      toast.success('Avatar updated!');
      queryClient.invalidateQueries(['myprofile']);
    },
    onError: () => toast.error('Avatar upload failed!')
  });




  const { mutate: deleteUser } = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      toast.success('Account deleted');
      localStorage.removeItem('zapchat_token');
      window.location.href = '/';
    },
    onError: () => toast.error('Failed to delete account')
  });




  const { mutate: logout } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      toast.success('Logged out');
      localStorage.removeItem('zapchat_token');
      window.location.href = '/';
    },
    onError: () => toast.error('Logout failed')
  });


 
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1117] text-white">
        <Loader className="animate-spin mr-2 text-cyan-400" size={24} />
        Loading...
      </div>
    );
  }

  

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1117] text-red-400">
        <AlertCircle size={24} className="mr-2" />
        {error?.response?.data?.message || 'Failed to fetch user data'}
      </div>
    );
  }

  const { avatar, createdAt } = data.user;




  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };




  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(formData);
  };



  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    uploadImage(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117] text-white px-4">
      <div className="w-full max-w-md bg-[#1c1f35] p-6 rounded-2xl shadow-2xl space-y-6">

        {/* Avatar & Details */}
        <div className="text-center space-y-3">
          {avatar?.url ? (
            <img
              src={avatar.url}
              alt="avatar"
              className="w-24 h-24 mx-auto rounded-full border-4 border-[#7cff8e] object-cover"
            />
          ) : (
            <UserCircle size={96} className="mx-auto text-[#7cff8e]" />
          )}

          <label className="block text-sm mt-2 cursor-pointer text-[#7cff8e] hover:underline">
            <Upload size={16} className="inline-block mr-1" />
            Upload Image
            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
          </label>

          <h2 className="text-2xl font-bold">{formData.name}</h2>
          <p className="text-gray-400 text-sm">{formData.email}</p>
          <p className="text-gray-500 text-xs">
            Joined: {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Update name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-[#272b45] text-white"
          />
          <input
            type="email"
            name="email"
            placeholder="Update email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-[#272b45] text-white"
          />
          <input
            type="password"
            name="password"
            placeholder="New password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-[#272b45] text-white"
          />
          <button
            type="submit"
            disabled={updating}
            className="w-full py-2 rounded-full bg-gradient-to-r from-[#7cff8e] to-[#00e3e3] text-[#0a0f1c] font-semibold hover:scale-105 transition"
          >
            <Save size={16} className="inline mr-1" />
            {updating ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

    
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 text-sm">
          <button
            onClick={deleteUser}
            className="flex items-center text-red-400 hover:text-red-500"
          >
            <Trash2 size={16} className="mr-1" />
            Delete Account
          </button>
          <button
            onClick={logout}
            className="flex items-center text-gray-400 hover:text-white"
          >
            <LogOut size={16} className="mr-1" />
            Logout
          </button>
          <button
            onClick={() => window.location.href = "/chat"}
            className="flex items-center text-[#7cff8e] hover:text-[#00e3e3] font-semibold transition"
          >
            <MessageCircle size={16} className="mr-1" />
            Go to Chat Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
