import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send, Loader2, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import PremiumBackground from "@/components/PremiumBackground";
import ProfileDrawer from "@/components/ProfileDrawer";
import Navbar from "@/components/Navbar";

// Backend URL configuration
const BASE_URL = import.meta.env.DEV
  ? "https://matrimony-unguarded-felt-tip.ngrok-free.dev"
  : "https://live-translation-backend.azurewebsites.net";

const Contact = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [user, setUser] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch logged in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
      if (data?.user?.email) {
        setFormData((prev) => ({
          ...prev,
          email: prev.email || data.user.email || "",
          firstName: prev.firstName || data.user.user_metadata?.full_name?.split(" ")[0] || "",
          lastName: prev.lastName || data.user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "",
        }));
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.firstName.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill out your name, email, and message.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);


      // Get the current Supabase session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Prepare request headers
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Attach authentication token for logged-in users
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      // Send contact form details to the backend
      const response = await fetch(`${BASE_URL}/api/contact`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }),
      });


      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to send your message.");
      }

      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for contacting Prime Talker. We will get back to you soon.",
      });

      // Clear the form after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

    } catch (error) {
      console.error("Contact form submission error:", error);

      toast({
        title: "Unable to Send Message",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <PremiumBackground />

      {/* HEADER / NAVIGATION */}
      <Navbar user={user} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />

      {/* PAGE CONTENT CONTAINER */}
      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        {/* PAGE TITLE */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Contact Us
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Have questions or need assistance? Reach out to PrimeTalker team and our team will get back to you promptly.
          </p>
        </div>

        {/* MAIN CONTACT FORM CARD */}
        <Card className="shadow-lg border border-border/60 bg-card/95 backdrop-blur-sm rounded-2xl">
          <CardHeader className="space-y-1.5 pb-6">
            <CardTitle className="text-2xl font-bold flex items-center gap-2 text-foreground">
              <MessageSquare className="w-6 h-6 text-primary" />
              Send Us a Message
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Fill in the form below and we will reach out to you as soon as possible.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* FIRST & LAST NAME */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="font-semibold text-sm">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="bg-background/50 border-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-semibold text-sm">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="bg-background/50 border-input"
                  />
                </div>
              </div>

              {/* EMAIL & PHONE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold text-sm">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!!user}
                    required
                    className="bg-background/50 border-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-semibold text-sm">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number with country code"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-background/50 border-input"
                  />
                </div>
              </div>

              {/* SUBJECT */}
              <div className="space-y-2">
                <Label htmlFor="subject" className="font-semibold text-sm">
                  Subject
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Inquiry about PrimeTalker services"
                  value={formData.subject}
                  onChange={handleChange}
                  className="bg-background/50 border-input"
                />
              </div>

              {/* MESSAGE */}
              <div className="space-y-2">
                <Label htmlFor="message" className="font-semibold text-sm">
                  Message <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="bg-background/50 border-input resize-y"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="shadow-primary font-medium text-base px-6 py-2.5 rounded-xl bg-gradient-primary hover:opacity-95 transition-all gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* FOOTER */}
      <Footer />

      {/* PROFILE DRAWER */}
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

export default Contact;
