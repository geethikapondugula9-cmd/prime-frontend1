import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Video,
    Pencil,
    Camera,
    Settings,
    BookOpen,
    LogOut,
    X,
    Save,
    Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
/* PREMIUM PROFILE DRAWER */
const ProfileDrawer = ({ user, open, onClose }: any) => {
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(
        user.user_metadata?.full_name || user.user_metadata?.username || user.email.split("@")[0]
    );
    const [avatarPreview, setAvatarPreview] = useState(
        user.user_metadata?.avatar_url || "/default-avatar.svg"
    );
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const logout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem("prime_user");
        localStorage.removeItem("username");
        window.location.href = "/landing";
    };

    /* Handle Avatar Upload */
    const handleAvatarChange = (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setError("Image must be less than 2MB");
            return;
        }

        setError(null);
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    /* Save Profile Changes */
    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            setError(null);

            let uploadedAvatarUrl = user.user_metadata?.avatar_url;

            // Upload avatar if selected
            if (avatarFile) {
                const fileExt = avatarFile.name.split('.').pop();
                const filePath = `${user.id}/${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from("avatars")
                    .upload(filePath, avatarFile, { upsert: true });

                if (uploadError) {
                    if (uploadError.message.includes("bucket") || uploadError.message.includes("not found")) {
                        throw new Error("Storage bucket not configured. Please create 'avatars' bucket in Supabase.");
                    }
                    throw uploadError;
                }

                // Get public URL
                const { data: publicUrlData } = supabase.storage
                    .from("avatars")
                    .getPublicUrl(filePath);

                uploadedAvatarUrl = publicUrlData.publicUrl;
            }

            // Update user metadata
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: name,
                    username: name,
                    avatar_url: uploadedAvatarUrl,
                },
            });

            if (error) throw error;

            // Username is now fetched from Supabase session via useUsername hook

            // Reset editing state and refresh
            setEditing(false);
            setAvatarFile(null);
            window.location.reload();
        } catch (err: any) {
            setError(err.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const cancelEditing = () => {
        setEditing(false);
        setAvatarFile(null);
        setAvatarPreview(user.user_metadata?.avatar_url || "/default-avatar.svg");
        setName(user.user_metadata?.full_name || user.user_metadata?.username || user.email.split("@")[0]);
        setError(null);
    };

    return (
        <>
            {/* Overlay */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9998
                }}
                className={`
          bg-black/40 transition-opacity duration-200
          ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
                onClick={onClose}
            />

            {/* Profile Panel - appears at top right below navbar */}
            <div
                style={{
                    position: 'fixed',
                    top: '56px',
                    right: '16px',
                    zIndex: 9999
                }}
                className={`
          w-[320px] max-h-[80vh] overflow-y-auto
          bg-white dark:bg-slate-900 
          shadow-2xl rounded-2xl border border-gray-200 dark:border-slate-700
          transition-all duration-200 ease-out flex flex-col origin-top-right
          ${open ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}
        `}
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                        {editing ? "Edit Profile" : "Account"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Profile Header */}
                <div className="px-6 py-8 flex flex-col items-center text-center bg-gradient-to-b from-gray-50 to-white dark:from-slate-800/50 dark:to-slate-900">
                    {/* Avatar with edit overlay */}
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full ring-4 ring-white dark:ring-slate-800 shadow-xl overflow-hidden">
                            <img
                                src={avatarPreview}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                onError={(e: any) => { e.target.src = "/default-avatar.svg"; }}
                            />
                        </div>
                        {editing && (
                            <label className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center cursor-pointer shadow-lg transition-colors">
                                <Camera className="w-4 h-4 text-white" />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={handleAvatarChange}
                                />
                            </label>
                        )}
                    </div>

                    {/* Name & Email */}
                    {!editing ? (
                        <div className="mt-4">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                {user.user_metadata?.full_name || user.user_metadata?.username || user.email.split("@")[0]}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{user.email}</p>
                        </div>
                    ) : (
                        <div className="mt-5 w-full">
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 text-left uppercase tracking-wider">
                                Display Name
                            </label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Enter your name"
                            />
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mx-6 mt-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                {/* Menu Section */}
                <div className="flex-1 px-4 py-4 overflow-y-auto">
                    {!editing ? (
                        <div className="space-y-1">
                            {/* Edit Profile */}
                            <button
                                className="w-full px-4 py-3.5 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors text-left group"
                                onClick={() => setEditing(true)}
                            >
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                                    <Pencil className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Edit Profile</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Update name and photo</p>
                                </div>
                            </button>

                            {/* My Rooms */}
                            <button
                                className="w-full px-4 py-3.5 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors text-left group"
                                onClick={() => { onClose(); navigate("/rooms"); }}
                            >
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                                    <Video className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">My Rooms</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Create or join meetings</p>
                                </div>
                            </button>

                            {/* User Guide */}
                            <a
                                href="/PrimeTalker-User-Guide.html"
                                target="_blank"
                                className="w-full px-4 py-3.5 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors text-left group block"
                            >
                                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 transition-colors">
                                    <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">User Guide</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Learn how to use the app</p>
                                </div>
                            </a>

                            {/* Settings */}
                            <button
                                className="w-full px-4 py-3.5 flex items-center gap-4 rounded-xl text-left opacity-50 cursor-not-allowed"
                                disabled
                            >
                                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                                    <Settings className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Settings</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">Coming soon</p>
                                </div>
                            </button>
                        </div>
                    ) : (
                        /* Edit Mode Buttons */
                        <div className="space-y-3 pt-2">
                            <button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>

                            <button
                                onClick={cancelEditing}
                                disabled={saving}
                                className="w-full py-3.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                {/* Sign Out - Fixed at bottom */}
                {!editing && (
                    <div className="px-4 py-4 border-t border-gray-100 dark:border-slate-800">
                        <button
                            onClick={logout}
                            className="w-full py-3 flex items-center justify-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium text-sm transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};
export default ProfileDrawer;