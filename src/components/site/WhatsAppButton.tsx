import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919999999999"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-accent text-background flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
    >
      <MessageCircle size={24} />
    </a>
  );
}
