import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phoneNumber = "6281234567890";
  const message = encodeURIComponent("Halo ResikPlus! Saya tertarik untuk mengetahui lebih lanjut tentang layanan Anda.");

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat on WhatsApp"
    >
      <div className="relative">
        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full bg-[hsl(142_70%_45%)] animate-ping opacity-25" />
        
        {/* Button */}
        <div className="relative w-14 h-14 rounded-full bg-[hsl(142_70%_45%)] flex items-center justify-center shadow-eco-xl hover:shadow-eco-glow transition-all duration-300 group-hover:scale-110">
          <MessageCircle className="w-7 h-7 text-primary-foreground" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-foreground text-background text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Hubungi Kami!
        </div>
      </div>
    </a>
  );
};

export default WhatsAppButton;
