import { Link } from "react-router-dom";
import { Recycle, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-forest text-primary-foreground">
      <div className="container-wide section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <Recycle className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                resik<span className="text-leaf-light">plus</span>.id
              </span>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Berkomitmen untuk kebersihan lingkungan, keberlanjutan, dan solusi pengelolaan sampah demi masa depan yang lebih hijau.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Tautan Cepat</h4>
            <ul className="space-y-3">
              {[
                { name: "Edukasi", href: "/education" },
                { name: "Kursus", href: "/courses" },
                { name: "Mitra", href: "/partners" },
                { name: "Berita", href: "/news" },
                { name: "Produk", href: "/products" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Layanan Kami</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li>Edukasi Lingkungan</li>
              <li>Pelatihan Pengelolaan Sampah</li>
              <li>Solusi Daur Ulang</li>
              <li>Program Kemitraan</li>
              <li>Penjualan Peralatan</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-leaf-light shrink-0 mt-0.5" />
                <span className="text-sm text-primary-foreground/80">
                  Gang melati no.15/17. Gonjen RT05 Tamantirto Kasihan Bantul DIY 55183
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-leaf-light shrink-0" />
                <a href="tel:+6281288866107" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  +62 812 8886 6107
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-leaf-light shrink-0" />
                <a href="mailto:resikpluswahana@gmail.com" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  resikpluswahana@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            © 2025 resikplus.id. Hak cipta dilindungi.
          </p>
          <div className="flex gap-6 text-sm text-primary-foreground/60">
            <Link to="/privacy" className="hover:text-primary-foreground transition-colors">Kebijakan Privasi</Link>
            <Link to="/terms" className="hover:text-primary-foreground transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;