import React from 'react';
import defaultProfileImage from '/assets/images/user.svg';

const ProfileImageUpload = ({ selectedImage, setSelectedImage, setSelectedImageFile }) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setSelectedImageFile(file);
    }
  };

  const handleProfileClick = () => {
    document.getElementById('profileImageUpload').click();
  };

  return (
    <div className="relative w-20 h-20 ml-2 overflow-hidden cursor-pointer" onClick={handleProfileClick}>
      {selectedImage ? (
        <img src={selectedImage} alt="프로필 이미지" className="w-full h-full object-cover rounded-full" />
      ) : (
        <img src={defaultProfileImage} alt="기본 프로필 이미지" className="w-full h-full object-contain" />
      )}
      <input type="file" id="profileImageUpload" accept="image/*" className="hidden" onChange={handleImageChange} />
    </div>
  );
};

export default ProfileImageUpload;
