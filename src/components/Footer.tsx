import { useNavigate } from "react-router-dom";
const Footer = () => {
    const navigate = useNavigate();

    return (

        <footer className="border-t border-border bg-card/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-8 sm:py-12">

                {/* Centered Logo & Tagline */}
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div
                        onClick={() => navigate("/landing")}
                        className="w-fit cursor-pointer"
                    >
                        <img
                            src="/logo.png"
                            alt="PrimeTalker Logo"
                            className="h-auto w-36 object-contain"
                        />
                    </div>

                    <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                        Break language barriers in real-time. Connect with anyone, anywhere
                        with instant voice translation during calls.
                    </p>
                </div>

                {/* Copyright */}
                <div className="mt-8 border-t border-border/80 pt-4 text-center text-xs text-muted-foreground sm:text-sm">
                    © {new Date().getFullYear()} PrimeTalker. All rights reserved.
                </div>

            </div>
        </footer>

    );
};

export default Footer;

