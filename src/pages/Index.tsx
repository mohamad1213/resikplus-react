import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, BookOpen, Users, Recycle, ShoppingBag, Newspaper, Star, CheckCircle, TrendingUp, Globe } from "lucide-react";
import Layout from "@/components/layout/Layout";
import heroImage from "@/assets/hero-environment.jpg";
import recyclingImage from "@/assets/recycling-process.jpg";
import educationImage from "@/assets/education-training.jpg";
import equipmentImage from "@/assets/grinding-equipment.jpg";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Keberlanjutan lingkungan"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest/90 via-forest/70 to-forest/40" />
        </div>

        <div className="container-wide section-padding relative z-10">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground text-sm mb-6">
              <Leaf className="w-4 h-4" />
              <span>Membangun Masa Depan Berkelanjutan</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Lingkungan Bersih,{" "}
              <span className="text-leaf-light">Masa Depan Hijau</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              ResikPlus adalah platform terdepan di Indonesia untuk edukasi lingkungan, 
              solusi pengelolaan sampah, dan peralatan daur ulang. Bergabunglah bersama kami 
              menciptakan dunia yang lebih bersih dan hijau.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/education">
                  Pelajari Lebih Lanjut <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/partners">Gabung Mitra</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-primary-foreground/20">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary-foreground">50K+</div>
                <div className="text-sm text-primary-foreground/70">Peserta Teredukasi</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary-foreground">200+</div>
                <div className="text-sm text-primary-foreground/70">Perusahaan Mitra</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary-foreground">1M+</div>
                <div className="text-sm text-primary-foreground/70">kg Sampah Didaur Ulang</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leaf-light text-primary text-sm font-medium">
                <Globe className="w-4 h-4" />
                Tentang ResikPlus
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Memimpin Jalan Menuju Keberlanjutan Lingkungan
              </h2>
              
              <p className="text-muted-foreground text-lg leading-relaxed">
                ResikPlus.id berdedikasi untuk menciptakan Indonesia yang lebih bersih melalui edukasi, 
                inovasi, dan kemitraan komunitas. Kami percaya bahwa keberlanjutan lingkungan 
                dimulai dari pengetahuan dan aksi nyata.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Program edukasi lingkungan yang komprehensif",
                  "Pelatihan pengelolaan sampah profesional",
                  "Peralatan daur ulang terdepan di industri",
                  "Jaringan mitra yang peduli lingkungan",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Button size="lg" asChild>
                <Link to="/education">Jelajahi Misi Kami</Link>
              </Button>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-eco-xl">
                <img
                  src={recyclingImage}
                  alt="Proses daur ulang di fasilitas ResikPlus"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-eco-lg border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-leaf-light flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">98%</div>
                    <div className="text-sm text-muted-foreground">Tingkat Kepuasan</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leaf-light text-primary text-sm font-medium mb-4">
              <Recycle className="w-4 h-4" />
              Layanan Kami
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Solusi Lingkungan Komprehensif
            </h2>
            <p className="text-muted-foreground text-lg">
              Dari edukasi hingga peralatan, kami menyediakan semua yang Anda butuhkan untuk 
              pengelolaan sampah dan keberlanjutan lingkungan yang efektif.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Edukasi Lingkungan",
                description: "Pelajari tentang pengelolaan sampah, proses daur ulang, dan praktik berkelanjutan melalui sumber daya edukasi kami yang komprehensif.",
                link: "/education",
                color: "bg-leaf-light text-primary",
              },
              {
                icon: Users,
                title: "Kursus Profesional",
                description: "Ikuti program pelatihan bersertifikat kami yang dirancang untuk individu dan organisasi yang ingin ahli dalam manajemen lingkungan.",
                link: "/courses",
                color: "bg-sky-light text-sky",
              },
              {
                icon: Recycle,
                title: "Program Kemitraan",
                description: "Bergabunglah dengan jaringan mitra kami yang peduli lingkungan dan berkontribusi membangun masa depan berkelanjutan untuk Indonesia.",
                link: "/partners",
                color: "bg-earth-light text-earth",
              },
              {
                icon: Newspaper,
                title: "Berita & Artikel",
                description: "Dapatkan informasi terkini tentang berita lingkungan, tips, dan wawasan dari tim ahli kami.",
                link: "/news",
                color: "bg-accent/20 text-accent",
              },
              {
                icon: ShoppingBag,
                title: "Toko Peralatan",
                description: "Belanja berbagai peralatan penggiling dan daur ulang profesional untuk penggunaan industri dan komersial.",
                link: "/products",
                color: "bg-secondary text-secondary-foreground",
              },
              {
                icon: Leaf,
                title: "Konsultasi",
                description: "Dapatkan saran ahli tentang penerapan praktik berkelanjutan dan sistem pengelolaan sampah untuk organisasi Anda.",
                link: "/partners",
                color: "bg-leaf-light text-primary",
              },
            ].map((service, index) => (
              <Link
                key={index}
                to={service.link}
                className="group card-eco p-6 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-4`}>
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Highlight */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-eco-xl">
                <img
                  src={educationImage}
                  alt="Sesi pelatihan lingkungan"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-light text-sky text-sm font-medium">
                <BookOpen className="w-4 h-4" />
                Kursus Unggulan
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Kuasai Keterampilan Manajemen Lingkungan
              </h2>
              
              <p className="text-muted-foreground text-lg leading-relaxed">
                Kursus profesional kami dirancang oleh para ahli industri untuk memberikan Anda 
                pengetahuan dan keterampilan yang dibutuhkan untuk memberikan dampak nyata pada 
                keberlanjutan lingkungan.
              </p>
              
              <div className="space-y-4">
                {[
                  { title: "Dasar-Dasar Pengelolaan Sampah", duration: "4 minggu", level: "Pemula" },
                  { title: "Teknik Daur Ulang Industri", duration: "6 minggu", level: "Menengah" },
                  { title: "Strategi Ekonomi Sirkular", duration: "8 minggu", level: "Lanjutan" },
                ].map((course, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
                    <div>
                      <h4 className="font-medium text-foreground">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">{course.duration} • {course.level}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
                ))}
              </div>
              
              <Button size="lg" asChild>
                <Link to="/courses">Lihat Semua Kursus</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Highlight */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
              <ShoppingBag className="w-4 h-4" />
              Produk Unggulan
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Peralatan Daur Ulang Profesional
            </h2>
            <p className="text-muted-foreground text-lg">
              Temukan berbagai mesin penggiling dan daur ulang kelas industri 
              yang dirancang untuk efisiensi dan ketahanan maksimal.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Plastic Grinder Pro X500",
                price: "Rp 45.000.000",
                specs: "Kapasitas 500kg/jam",
                image: equipmentImage,
              },
              {
                name: "Industrial Shredder S300",
                price: "Rp 75.000.000",
                specs: "Konstruksi tugas berat",
                image: equipmentImage,
              },
              {
                name: "Compact Recycler Mini",
                price: "Rp 25.000.000",
                specs: "Sempurna untuk UMKM",
                image: equipmentImage,
              },
            ].map((product, index) => (
              <div key={index} className="card-eco overflow-hidden group">
                <div className="aspect-square bg-secondary overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{product.specs}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">{product.price}</span>
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/products">Detail</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link to="/products">
                Lihat Semua Produk <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leaf-light text-primary text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Testimoni
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Apa Kata Mitra Kami
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Ahmad Susanto",
                role: "CEO, EcoTech Industries",
                content: "ResikPlus telah mengubah cara kami menangani pengelolaan sampah. Program pelatihan mereka berkelas dunia dan kualitas peralatannya luar biasa.",
              },
              {
                name: "Siti Rahayu",
                role: "Direktur Keberlanjutan, PT Green Solutions",
                content: "Kemitraan dengan ResikPlus telah membantu kami mencapai target keberlanjutan. Keahlian mereka dalam daur ulang tidak tertandingi di Indonesia.",
              },
              {
                name: "Budi Hartono",
                role: "Pemilik, UMKM Bersih Jaya",
                content: "Sebagai pemilik usaha kecil, ResikPlus memudahkan kami memulai daur ulang. Dukungan dan peralatan mereka sangat berharga untuk pertumbuhan kami.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="card-eco p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Siap Membuat Perubahan?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan individu dan organisasi yang berkomitmen membangun 
            Indonesia yang lebih bersih dan berkelanjutan.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/partners">Menjadi Mitra</Link>
            </Button>
            <Button variant="accent" size="xl" asChild>
              <Link to="/products">Belanja Peralatan</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Tetap Terinformasi
            </h2>
            <p className="text-muted-foreground mb-6">
              Berlangganan newsletter kami untuk berita lingkungan terbaru, tips, dan penawaran eksklusif.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit">Berlangganan</Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;