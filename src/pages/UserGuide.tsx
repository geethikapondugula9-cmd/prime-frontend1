
import { useEffect } from "react";

// User Guide page - loads the HTML guide directly inside Prime Talker.
const UserGuide = () => {
    useEffect(() => {
        // Keep the page positioned at the top when the User Guide opens.
        window.scrollTo(0, 0);
    }, []);

    return (
        // Load the actual HTML file so its Table of Contents links work normally.
        <iframe
            title="Prime Talker User Guide"
            src="/PrimeTalker-User-Guide.html"
            className="h-screen w-full border-0"
        />
    );
};

export default UserGuide;
