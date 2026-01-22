import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Camera } from "lucide-react";

export default function UserAvatar({ size = 32 }) {
  const { user, updateUserPhoto } = useAuth();
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleClick = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      await updateUserPhoto(file);
    } catch (err) {
      // noop
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const dimension = `${size}px`;
  const borderClasses = "border border-zinc-700";

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`rounded-lg overflow-hidden ${borderClasses} bg-yellow-400 text-black flex items-center justify-center`}
        style={{ width: dimension, height: dimension }}
        title={isUploading ? "Enviando..." : "Alterar foto"}
        disabled={isUploading}
      >
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-bold text-lg">$</span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {isUploading && (
        <div className="absolute -bottom-2 -right-2 bg-black rounded-full p-1">
          <Camera size={14} className="text-yellow-400 animate-pulse" />
        </div>
      )}
    </div>
  );
}
