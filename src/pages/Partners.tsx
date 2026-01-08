import { useState } from "react";
import { Users, Building2, User, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone || !formData.partnerType) {
      toast({
        title: "Mohon lengkapi semua kolom yang diperlukan",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast({
      title: "Pendaftaran Berhasil!",
      description: "Terima kasih atas minat Anda. Tim kami akan menghubungi Anda dalam 2 hari kerja.",
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
      {/* Hero */}
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Keuntungan Mitra</h2>
              <p className="text-muted-foreground mb-8">
                Sebagai mitra ResikPlus, Anda akan mendapatkan akses ke sumber daya eksklusif, 
                pelatihan, dan peluang networking yang akan membantu Anda mengembangkan 
                inisiatif keberlanjutan.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid gap-4">
              {partnerTypes.map((type) => (
                <div key={type.id} className="card-eco p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-leaf-light flex items-center justify-center shrink-0">
                    <type.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{type.label}</h3>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </div>
              ))}
            </div>
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
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        formData.partnerType === type.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <type.icon className={`w-6 h-6 mx-auto mb-2 ${
                        formData.partnerType === type.id ? "text-primary" : "text-muted-foreground"
                      }`} />
                      <span className={`text-sm font-medium ${
                        formData.partnerType === type.id ? "text-primary" : "text-foreground"
                      }`}>
                        {type.label}
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

              <Button type="submit" size="xl" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Mengirim..." : "Kirim Pendaftaran"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Partners;