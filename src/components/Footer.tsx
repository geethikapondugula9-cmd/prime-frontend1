import { useNavigate } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="border-t border-border bg-card/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-8 sm:py-12">
                <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2">
                    {/* Left Column - Logo & Tagline */}
                    <div className="space-y-4">
                        <div
                            onClick={() => navigate("/landing")}
                            className="flex w-fit cursor-pointer items-center gap-2"
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

                    {/* Right Column - Contact Info */}
                    <div className="space-y-4">
                        <h4
                            onClick={() => navigate("/contact")}
                            className="inline-block cursor-pointer text-lg font-semibold text-foreground transition-colors hover:text-primary"
                        >
                            Contact Us
                        </h4>

                        <div className="space-y-3">
                            <div className="group flex items-start gap-3">
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                                    <MapPin className="h-4 w-4 text-primary" />
                                </div>
                                <div className="text-sm leading-relaxed text-muted-foreground">
                                    <p className="font-medium text-foreground">Catalina Business Solutions Inc (CBS Inc)</p>
                                    <p>8888 Keystone Crossing, Suite 1373</p>
                                    <p>Indianapolis, IN 46240</p>
                                </div>
                            </div>

                            <a
                                href="tel:+13175754181"
                                className="group flex items-center gap-3 transition-transform hover:translate-x-1"
                            >
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                                    <Phone className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                                    +1-317-575-4181
                                </span>
                            </a>

                            <a
                                href="mailto:info@cbs-corp.com"
                                className="group flex items-center gap-3 transition-transform hover:translate-x-1"
                            >
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                                    <Mail className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                                    info@cbs-corp.com
                                </span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-border/80 pt-4 text-center text-xs text-muted-foreground sm:text-sm">
                    © {new Date().getFullYear()} PrimeTalker. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;

