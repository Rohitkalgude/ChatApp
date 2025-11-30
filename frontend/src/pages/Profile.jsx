import React, { useContext, useState } from "react";
import { User, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

function Profile() {
  const { updateProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    profilePicData: null,
  });

  const navigate = useNavigate();

  const [currentProfile, setCurrentProfile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, profilePicData: e.target.files[0] });
    }
  };
  
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    let base64Image = null;

    if (formData.profilePicData) {
      base64Image = await convertToBase64(formData.profilePicData);
    }

    const res = await updateProfile(
      formData.fullName,
      formData.bio,
      base64Image
    );

    if (res?.success) {
      setCurrentProfile({
        fullName: formData.fullName,
        bio: formData.bio,
        profilePic: formData.profilePicData || currentProfile.profilePic,
      });

      navigate("/homepage");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] text-white px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="bg-[#181818] p-6 sm:p-8 md:p-10 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] w-full max-w-md sm:max-w-md md:max-w-md border border-[#2a2a2a] text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-500 mb-8 text-center">
            Profile Details
          </h1>

          <div className="relative flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-3xl overflow-hidden">
              {formData.profilePicData ? (
                <img
                  src={URL.createObjectURL(formData.profilePicData)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : currentProfile?.profilePic ? (
                <img
                  src={currentProfile.profilePic}
                  alt={currentProfile.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={40} />
              )}
            </div>

            <label className="absolute bottom-0 right-[40%] bg-green-600 p-2 rounded-full cursor-pointer hover:bg-green-500 transition">
              <Camera size={18} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
            <div className="flex items-center bg-[#242424] rounded-lg px-3 h-12 mb-4">
              <User className="w-5 h-5 text-green-500" />
              <input
                type="text"
                name="fullName"
                placeholder="Enter the username"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full h-full pl-3 bg-[#242424] outline-none placeholder-gray-400 text-white text-base"
              />
            </div>

            <div className="flex items-start bg-[#242424] rounded-lg px-3 py-2">
              <User className="w-5 h-5 text-green-500 mt-1" />
              <textarea
                name="bio"
                placeholder="Write a short bio (optional)"
                value={formData.bio}
                onChange={handleChange}
                className="w-full bg-[#242424] text-white placeholder-gray-400 pl-3 outline-none resize-none"
                rows="3"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-lg font-semibold bg-green-600 hover:bg-green-500 active:scale-[0.98] transition-transform duration-200 shadow-md"
            >
              {currentProfile ? "Update Profile" : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Profile;
