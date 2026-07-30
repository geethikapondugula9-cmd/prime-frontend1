import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuth = async () => {
            console.log("Current URL:", window.location.href);

            // Get the current auth session after email verification
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (error) {
                console.error(error);
                navigate("/auth");
                return;
            }

            if (session) {
                console.log("✅ User logged in:", session.user.email);

                localStorage.setItem(
                    "prime_user",
                    JSON.stringify(session.user)
                );

                navigate("/", {replace:true});
            } else {
                console.log("❌ No session found");
                navigate("/auth");
            }
        };

        handleAuth();
    }, [navigate]);

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            Verifying your account...
        </div>
    );
};

export default AuthCallback;