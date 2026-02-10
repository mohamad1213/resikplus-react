import { useState } from "react";
import { Users, Building2, User, CheckCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import React from "react";
const partnerTypes = [
  { id: "individual", label: "Individu", icon: User, description: "Freelancer dan profesional" },
  { id: "sme", label: "UMKM", icon: Building2, description: "Usaha kecil dan menengah" },
  { id: "organization", label: "Organisasi", icon: Users, description: "Institusi besar dan NGO" },
];

const benefits = [
  "Akses ke program pelatihan eksklusif",
  "Dukungan prioritas dari tim kami",
  "Harga peralatan diskon",
  "Jaringan dengan mitra eco lainnya",
  "Peluang co-branding",
  "Akses awal ke produk baru",
];

const Partners = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    partnerType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.partnerType) {
      toast({
        title: "Mohon lengkapi semua kolom yang diperlukan",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Get partner type label
    const partnerTypeLabel = partnerTypes.find(t => t.id === formData.partnerType)?.label || formData.partnerType;

    // Create WhatsApp message
    const message = encodeURIComponent(
      `🤝 *PENDAFTARAN MITRA BARU - RESIKPLUS*\n\n` +
      `👤 *Data Calon Mitra:*\n` +
      `Nama: ${formData.fullName.trim()}\n` +
      `Email: ${formData.email.trim()}\n` +
      `Telepon: ${formData.phone.trim()}\n` +
      `Jenis Mitra: ${partnerTypeLabel}\n` +
      `${formData.message.trim() ? `\n💬 *Pesan:*\n${formData.message.trim()}\n` : ""}` +
      `\nSaya tertarik untuk bergabung sebagai mitra ResikPlus. Mohon informasi lebih lanjut. Terima kasih!`
    );

    window.open(`https://wa.me/6281288866107?text=${message}`, "_blank");

    toast({
      title: "Dialihkan ke WhatsApp",
      description: "Silakan lanjutkan pendaftaran melalui WhatsApp.",
    });

    setFormData({
      fullName: "",
      email: "",
      phone: "",
      partnerType: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <section className="section-padding bg-gradient-to-b from-earth-light/50 to-background">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-earth/10 text-earth text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              Program Kemitraan
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Bergabung dengan Jaringan Mitra Kami
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Jadilah bagian dari komunitas bisnis dan individu yang peduli lingkungan
              di Indonesia yang berkomitmen pada keberlanjutan lingkungan.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Keuntungan Mitra</h2>
            <p className="text-muted-foreground mb-8">
              Sebagai mitra ResikPlus, Anda akan mendapatkan akses ke sumber daya eksklusif,
              pelatihan, dan peluang networking yang akan membantu Anda mengembangkan
              inisiatif keberlanjutan.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="card-eco p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground font-medium pt-2">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Pendaftaran Mitra</h2>
              <p className="text-muted-foreground">
                Lengkapi formulir di bawah ini untuk mendaftar program kemitraan kami.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="card-eco p-8 space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Masukkan nama lengkap Anda"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="anda@contoh.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Nomor Telepon *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+62 812 3456 7890"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Jenis Mitra *
                </label>
                <div className="grid sm:grid-cols-3 gap-3">
                  {partnerTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, partnerType: type.id })}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${formData.partnerType === type.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                        }`}
                    >
                      <type.icon className={`w-6 h-6 mx-auto mb-2 ${formData.partnerType === type.id ? "text-primary" : "text-muted-foreground"
                        }`} />
                      <span className={`text-sm font-medium ${formData.partnerType === type.id ? "text-primary" : "text-foreground"
                        }`}>
                        {type.label}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1 block">
                        {type.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Pesan (Opsional)
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Ceritakan tentang tujuan keberlanjutan Anda..."
                />
              </div>

              <Button type="submit" variant="whatsapp" size="xl" className="w-full" disabled={isSubmitting}>
                <MessageCircle className="w-5 h-5" />
                {isSubmitting ? "Mengirim..." : "Daftar via WhatsApp"}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Data pendaftaran akan dikirim ke WhatsApp untuk proses selanjutnya
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Partners;