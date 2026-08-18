import React from "react";

interface ProfileMenuProps {
    user: any;
    drawerOpen: boolean;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileMenu = ({
    user,
    drawerOpen,
    setDrawerOpen,
}: ProfileMenuProps) => {
    const name =
        user?.user_metadata?.username ||
        user?.user_metadata?.first_name ||
        user?.user_metadata?.name ||
        user?.email ||
        "User";

    const initial = name.trim().charAt(0).toUpperCase();
    const avatarUrl = user?.user_metadata?.avatar_url;

    return (
        <div
            className="w-10 h-10 rounded-full border cursor-pointer hover:scale-105 transition overflow-hidden flex items-center justify-center bg-blue-600 text-white font-semibold"
            onClick={() => setDrawerOpen(!drawerOpen)}
        >
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                />
            ) : (
                <span>{initial}</span>
            )}
        </div>
    );
};

export default ProfileMenu;