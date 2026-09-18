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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Contact Us Email Feature: Prepare and open the user's email client with the submitted form details
    if (!formData.firstName.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill out your name, email, and message.",
        variant: "destructive",
      });
      return;
    }

    const recipientEmail = "primecontact@primetalker.com";

    const emailSubject =
      formData.subject.trim() || "PrimeTalker Contact Us Enquiry";

    const emailBody = `
Hello Prime Talker Team,

I would like to report an issue / make an enquiry through the Contact Us form.

First Name: ${formData.firstName.trim()}
Last Name: ${formData.lastName.trim() || "N/A"}
Email Address: ${formData.email.trim()}
Phone Number: ${formData.phone.trim() || "N/A"}

Message:
${formData.message.trim()}

Thank you.
    `.trim();

    const mailtoLink =
      `mailto:${recipientEmail}` +
      `?subject=${encodeURIComponent(emailSubject)}` +
      `&body=${encodeURIComponent(emailBody)}`;

    // Open the user's configured email application with the form details pre-filled
    window.location.href = mailtoLink;
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
            Have questions or need assistance? Reach out to Catalina Business Solutions Inc (CBS Inc) and our team will get back to you promptly.
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
                    placeholder="manjunadh"
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
                    placeholder="Doe"
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
                    placeholder="manjunadhbhavaraju@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
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
                    placeholder="+1 (317) 000-0000"
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
