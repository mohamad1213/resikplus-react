import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Filter, Star, MessageCircle, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import equipmentImage from "@/assets/grinding-equipment.jpg";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  specs: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Plastic Grinder Pro X500",
    category: "Penggiling",
    price: 45000000,
    specs: ["Kapasitas 500kg/jam", "Motor industri", "Sistem auto-feed"],
    rating: 4.8,
    reviews: 124,
    inStock: true,
    image: equipmentImage,
  },
  {
    id: 2,
    name: "Industrial Shredder S300",
    category: "Pencacah",
    price: 75000000,
    specs: ["Pisau tugas berat", "300kg/jam", "Operasi rendah suara"],
    rating: 4.9,
    reviews: 89,
    inStock: true,
    image: equipmentImage,
  },
  {
    id: 3,
    name: "Compact Recycler Mini",
    category: "Daur Ulang",
    price: 25000000,
    specs: ["Sempurna untuk UMKM", "Pengoperasian mudah", "Desain kompak"],
    rating: 4.7,
    reviews: 215,
    inStock: true,
    image: equipmentImage,
  },
  {
    id: 4,
    name: "Multi-Material Crusher MC200",
    category: "Penghancur",
    price: 55000000,
    specs: ["Menangani berbagai material", "200kg/jam", "Fitur keselamatan"],
    rating: 4.6,
    reviews: 67,
    inStock: false,
    image: equipmentImage,
  },
  {
    id: 5,
    name: "Pelletizer Pro P100",
    category: "Pelletizer",
    price: 85000000,
    specs: ["Output 100kg/jam", "Ukuran pelet dapat diatur", "Hemat energi"],
    rating: 4.9,
    reviews: 43,
    inStock: true,
    image: equipmentImage,
  },
  {
    id: 6,
    name: "Waste Compactor WC400",
    category: "Kompak",
    price: 35000000,
    specs: ["Rasio kompresi 4:1", "Sistem hidrolik", "Unit mobile"],
    rating: 4.5,
    reviews: 98,
    inStock: true,
    image: equipmentImage,
  },
];

const categories = ["Semua", "Penggiling", "Pencacah", "Daur Ulang", "Penghancur", "Pelletizer", "Kompak"];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const Products = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [showCart, setShowCart] = useState(false);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "Semua" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      setCart(cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    toast({
      title: "Ditambahkan ke Keranjang",
      description: `${product.name} telah ditambahkan ke keranjang Anda.`,
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleWhatsAppOrder = () => {
    const orderDetails = cart
      .map((item) => `- ${item.product.name} x${item.quantity}`)
      .join("\n");
    const message = encodeURIComponent(
      `Halo ResikPlus! Saya ingin memesan:\n\n${orderDetails}\n\nTotal: ${formatPrice(cartTotal)}`
    );
    window.open(`https://wa.me/6281234567890?text=${message}`, "_blank");
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-accent/10 to-background">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Peralatan Daur Ulang Profesional
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Temukan berbagai peralatan penggiling, pencacah, dan daur ulang kelas industri 
              yang dirancang untuk efisiensi dan ketahanan maksimal.
            </p>
            
            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Cart Button */}
      <section className="py-4 border-b border-border sticky top-[72px] bg-background z-40">
        <div className="container-wide">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2 flex-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              className="relative"
              onClick={() => setShowCart(true)}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="card-eco overflow-hidden group">
                <div className="aspect-square bg-secondary overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                      <span className="px-4 py-2 rounded-full bg-background text-foreground font-medium">
                        Stok Habis
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="text-foreground">{product.rating}</span>
                      <span className="text-muted-foreground">({product.reviews})</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-2">{product.name}</h3>
                  
                  <ul className="space-y-1 mb-4">
                    {product.specs.map((spec, index) => (
                      <li key={index} className="text-sm text-muted-foreground">• {spec}</li>
                    ))}
                  </ul>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xl font-bold text-primary">{formatPrice(product.price)}</span>
                    <Button
                      size="sm"
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                    >
                      Tambah
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Tidak ada produk yang sesuai dengan kriteria Anda.</p>
            </div>
          )}
        </div>
      </section>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setShowCart(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-background shadow-xl animate-slide-in-right">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">Keranjang Anda ({cartCount})</h2>
                <button onClick={() => setShowCart(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Keranjang Anda kosong</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex gap-4 p-4 rounded-xl bg-secondary/30">
                        <div className="w-20 h-20 rounded-lg bg-secondary overflow-hidden shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">{item.product.name}</h3>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="text-primary font-semibold">{formatPrice(item.product.price)}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-border space-y-4">
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-medium text-foreground">Total</span>
                    <span className="font-bold text-primary">{formatPrice(cartTotal)}</span>
                  </div>
                  <Button
                    variant="whatsapp"
                    size="xl"
                    className="w-full"
                    onClick={handleWhatsAppOrder}
                  >
                    <MessageCircle className="w-5 h-5" />
                    Pesan via WhatsApp
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Klik untuk mengirim pesanan langsung ke WhatsApp kami
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-bold mb-4">Butuh Peralatan Khusus?</h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-xl mx-auto">
            Kami menawarkan solusi khusus untuk kebutuhan daur ulang spesifik Anda. Hubungi tim sales kami.
          </p>
          <Button variant="heroOutline" size="xl" asChild>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5" />
              Chat dengan Sales
            </a>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Products;