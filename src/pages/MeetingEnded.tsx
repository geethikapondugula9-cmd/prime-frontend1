// Import useEffect for redirecting when no meeting summary exists.
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function MeetingEnded() {
    const navigate = useNavigate();

    // Read the meeting summary passed from Meeting.tsx when the call ends.
    const location = useLocation();
    // Read the summary passed from Meeting.tsx, if one exists.
    const meetingSummary = location.state?.meetingSummary;

    // Check whether the page was opened without a meeting summary.
    const hasMeetingSummary = Boolean(meetingSummary);

    // Redirect to Rooms if this page was opened without a completed meeting.
    useEffect(() => {
        if (!hasMeetingSummary) {
            navigate("/rooms", { replace: true });
        }
    }, [hasMeetingSummary, navigate]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
            <div className="w-full max-w-lg rounded-2xl border bg-card p-8 shadow-sm">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
                    ✓
                </div>

                <h1 className="mb-3 text-3xl font-bold text-foreground">
                    Meeting Ended
                </h1>

                {/* Show the meeting duration when a summary is available. */}
                <p className="mb-3 text-muted-foreground">
                    Your meeting has ended successfully.
                </p>

                {/* Show the meeting duration when a summary is available. */}
                {meetingSummary && (
                    <>
                        <p className="mb-6 text-lg font-medium text-foreground">
                            Meeting Duration: {Math.floor(meetingSummary.duration / 60)} min{" "}
                            {meetingSummary.duration % 60} sec
                        </p>

                        {/* Display the local participant's name and selected language. */}
                        <div className="mb-4 w-full rounded-lg border p-4 text-left">
                            <h2 className="mb-2 font-semibold text-foreground">You</h2>
                            <p className="text-sm text-muted-foreground">
                                Name: {meetingSummary.myName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Language: {meetingSummary.myLanguage}
                            </p>
                        </div>

                        {/* Display the other participant's name and selected language. */}
                        <div className="mb-6 w-full rounded-lg border p-4 text-left">
                            <h2 className="mb-2 font-semibold text-foreground">Other Participant</h2>
                            <p className="text-sm text-muted-foreground">
                                Name: {meetingSummary.partnerName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Language: {meetingSummary.partnerLanguage}
                            </p>
                        </div>
                    </>
                )}

                <button
                    onClick={() => navigate("/rooms")}
                    className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                    Back to Rooms
                </button>
            </div>
        </div>
    );
}