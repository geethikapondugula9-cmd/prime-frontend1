import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileDrawer from "@/components/ProfileDrawer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Camera,
  Globe,
  Mic,
  ShieldCheck,
  Lock,
  Save,
  CheckCircle2,
  Trash2,
  Sparkles,
  ArrowLeft,
  KeyRound,
  SlidersHorizontal
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/default-avatar.svg");

  // Store the selected image file for uploading when the profile is saved.
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Track whether the user wants to permanently remove the saved profile picture.
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [nativeLanguage, setNativeLanguage] = useState("English (US)");
  const [targetLanguage, setTargetLanguage] = useState("Spanish");
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [showCaptions, setShowCaptions] = useState(true);

  // Password fields state (UI only)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        const u = data.user;
        setUser(u);
        setEmail(u.email || "");
        setFullName(u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split("@")[0] || "");
        setUsername(u.user_metadata?.username || u.email?.split("@")[0] || "");
        setPhone(u.user_metadata?.phone || "");
        setBio(u.user_metadata?.bio || "Global communicator & PrimeTalker user.");
        setAvatarPreview(u.user_metadata?.avatar_url || "/default-avatar.svg");
      }
    });
  }, []);


  // Handle profile picture selection and validate the image before previewing it.
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Allow only supported image formats.
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WEBP image.");
      e.target.value = "";
      return;
    }

    // Keep the existing 2MB file-size limit.
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Avatar image must be under 2MB.");
      e.target.value = "";
      return;
    }

    // Store the image file for uploading when Save Changes is clicked.
    setAvatarFile(file);

    // Display a preview of the selected image.
    setAvatarPreview(URL.createObjectURL(file));

    toast.success("Avatar preview updated. Save your profile to apply it.");
  };
  const handleRemoveAvatar = () => {
    // Mark the existing profile picture for removal when changes are saved.
    setRemoveAvatar(true);

    // Clear any newly selected image file.
    setAvatarFile(null);

    // Restore the default avatar preview.
    setAvatarPreview("/default-avatar.svg");

    toast.info("Profile picture marked for removal. Click Save Changes to apply it.");
  };



  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent saving if no authenticated user is available.
    if (!user) {
      toast.error("Please sign in to update your profile.");
      return;
    }

    // Validate required profile fields.
    if (!fullName.trim() || !username.trim()) {
      toast.error("Full name and username are required.");
      return;
    }

    try {
      setLoading(true);

      // Keep the existing avatar URL unless a new image is selected.
      // Clear the saved avatar URL when removal is requested.
      let updatedAvatarUrl = removeAvatar
        ? null
        : user.user_metadata?.avatar_url || null;

      // Upload a newly selected profile picture.
      if (avatarFile) {
        const fileExtension =
          avatarFile.name.split(".").pop()?.toLowerCase() || "jpg";

        const filePath = `${user.id}/avatar-${Date.now()}.${fileExtension}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, {
            upsert: true,
            contentType: avatarFile.type,
          });

        if (uploadError) throw uploadError;

        // Get the public URL of the uploaded image.
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        updatedAvatarUrl = publicUrlData.publicUrl;
      }

      // Save the profile fields and avatar URL to Supabase Auth metadata.
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName.trim(),
          username: username.trim(),
          phone: phone.trim(),
          bio: bio.trim(),
          avatar_url: updatedAvatarUrl,
        },
      });

      if (error) throw error;
      // Refresh the user state and avatar preview after saving.
      if (data.user) {
        setUser(data.user);
        setAvatarPreview(
          data.user.user_metadata?.avatar_url || "/default-avatar.svg"
        );
        setAvatarFile(null);
        setRemoveAvatar(false);
      }

      toast.success("Profile details updated successfully!");
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(error.message || "Failed to update profile details.");
    } finally {
      setLoading(false);
    }
  };

  // Handle password changes separately from profile details.
  const handleChangePassword = async () => {
    if (!user?.email) {
      toast.error("Please sign in again to change your password.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Your new password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("Your new password must be different from your current password.");
      return;
    }

    try {
      setLoading(true);

      // Verify the current password.
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (verifyError) {
        toast.error("Your current password is incorrect.");
        return;
      }

      // Update the password in Supabase Auth.
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordSection(false);

      toast.success("Password changed successfully!");
    } catch (error: any) {
      console.error("Failed to change password:", error);
      toast.error(error.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen dark:bg-[#0B0F17] bg-slate-50 dark:text-white text-slate-900 flex flex-col font-sans selection:bg-indigo-600 selection:text-white transition-colors">
      {/* Navigation Bar */}
      <Navbar user={user} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm dark:text-slate-400 text-slate-600 dark:hover:text-white hover:text-slate-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight dark:text-white text-slate-900">
                Profile Details
              </h1>
              <p className="text-sm dark:text-slate-400 text-slate-600">
                Manage your personal information.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveChanges} className="space-y-8">
          {/* CARD 1: AVATAR & BASIC IDENTIFICATION */}
          <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b dark:border-slate-800 border-slate-200">
              {/* Avatar Preview */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-full ring-4 ring-indigo-500/20 overflow-hidden bg-slate-800 flex items-center justify-center shadow-2xl">
                  <img
                    src={avatarPreview}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                      e.target.src = "/default-avatar.svg";
                    }}
                  />
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-lg transition-transform hover:scale-110"
                  title="Change Profile Photo"
                >
                  <Camera className="w-4 h-4" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Avatar Controls */}
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-base font-semibold dark:text-white text-slate-900">Profile Photo</h3>
                <p className="text-xs dark:text-slate-400 text-slate-600">
                  Recommended size 400x400px. JPG, PNG or WEBP up to 2MB.
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
                  <label
                    htmlFor="avatar-upload"
                    className="px-3.5 py-1.5 rounded-xl dark:bg-slate-800 bg-slate-100 dark:hover:bg-slate-700 hover:bg-slate-200 dark:text-slate-200 text-slate-700 text-xs font-medium cursor-pointer transition-colors border dark:border-slate-700 border-slate-300 inline-flex items-center gap-1.5"
                  >
                    <UploadIcon className="w-3.5 h-3.5" />
                    Upload New
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 text-xs font-medium transition-colors border border-red-500/20 inline-flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 uppercase tracking-wider">
                  Username
                </label>
                <div className="relative">
                  <span className="text-slate-400 dark:text-slate-500 text-sm font-semibold absolute left-3.5 top-1/2 -translate-y-1/2">
                    @
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe"
                    className="w-full bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Email (Read only) */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-slate-100 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 rounded-xl pl-10 pr-24 py-2.5 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Bio / About */}
              <div className="sm:col-span-2 space-y-2">
                <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 uppercase tracking-wider">
                  Bio / Tagline
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell others a bit about yourself..."
                  className="w-full bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* CARD 2: TRANSLATION & MEETING PREFERENCES */}
          {/* <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b dark:border-slate-800 border-slate-200">
              <Globe className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              <div>
                <h3 className="text-base font-semibold dark:text-white text-slate-900">
                  Translation & Audio Preferences
                </h3>
                <p className="text-xs dark:text-slate-400 text-slate-600">
                  Configure default spoken and translation languages for your calls.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <div className="space-y-2">
                <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 uppercase tracking-wider">
                  Primary Spoken Language
                </label>
                <select
                  value={nativeLanguage}
                  onChange={(e) => setNativeLanguage(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                >
                  <option value="English (US)" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">English (US)</option>
                  <option value="Spanish" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Spanish (Español)</option>
                  <option value="French" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">French (Français)</option>
                  <option value="German" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">German (Deutsch)</option>
                  <option value="Mandarin" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Mandarin (中文)</option>
                  <option value="Japanese" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Japanese (日本語)</option>
                  <option value="Hindi" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Hindi (हिंदी)</option>
                </select>
              </div>


              <div className="space-y-2">
                <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 uppercase tracking-wider">
                  Default Target Translation Language
                </label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                >
                  <option value="Spanish" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Spanish (Español)</option>
                  <option value="English (US)" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">English (US)</option>
                  <option value="French" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">French (Français)</option>
                  <option value="German" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">German (Deutsch)</option>
                  <option value="Japanese" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Japanese (日本語)</option>
                  <option value="Italian" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Italian (Italiano)</option>
                </select>
              </div>


              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl">
                <div>
                  <p className="text-sm font-medium dark:text-white text-slate-900">Auto-Translate Audio</p>
                  <p className="text-xs dark:text-slate-400 text-slate-600">
                    Automatically translate incoming partner speech in real time.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoTranslate(!autoTranslate)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${autoTranslate ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-800"
                    }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${autoTranslate ? "translate-x-6" : "translate-x-0"
                      }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl">
                <div>
                  <p className="text-sm font-medium dark:text-white text-slate-900">Display Live Captions</p>
                  <p className="text-xs dark:text-slate-400 text-slate-600">
                    Show real-time transcript subtitles on meeting video screen.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCaptions(!showCaptions)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${showCaptions ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-800"
                    }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${showCaptions ? "translate-x-6" : "translate-x-0"
                      }`}
                  />
                </button>
              </div>
            </div>
          </div> */}

          {/* CARD 3: SECURITY & PASSWORD UI SECTION */}
          <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b dark:border-slate-800 border-slate-200">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                <div>
                  <h3 className="text-base font-semibold dark:text-white text-slate-900">Security & Login</h3>
                  <p className="text-xs dark:text-slate-400 text-slate-600">
                    Manage your account credentials and password settings.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                className="px-3.5 py-1.5 rounded-xl dark:bg-slate-800 bg-slate-100 dark:hover:bg-slate-700 hover:bg-slate-200 text-xs font-medium dark:text-slate-300 text-slate-700 border dark:border-slate-700 border-slate-300 transition-colors"
              >
                {showPasswordSection ? "Hide Password Form" : "Change Password"}
              </button>
            </div>

            {showPasswordSection && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 animate-fade-in">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 uppercase tracking-wider">
                    Current Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}
            {/* Button to submit the password change. */}
            {showPasswordSection && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                >
                  {loading ? "Updating Password..." : "Update Password"}
                </button>
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl dark:bg-slate-800 bg-slate-100 dark:hover:bg-slate-700 hover:bg-slate-200 dark:text-slate-200 text-slate-700 text-sm font-medium transition-colors border dark:border-slate-700 border-slate-300"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 border-0 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving Changes..." : "Save Profile Details"}
            </Button>
          </div>
        </form>
      </main>

      {/* Footer */}
      <Footer />

      {/* Profile Drawer */}
      {user && (
        <ProfileDrawer
          user={user}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </div>
  );
};

const UploadIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
    />
  </svg>
);

export default Profile;
