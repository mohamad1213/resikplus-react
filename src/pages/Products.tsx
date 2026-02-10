import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Star, MessageCircle, X, CreditCard, User, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import equipmentImage from "@/assets/grinding-equipment.jpg";
import React from "react";
import api from "@/lib/api";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  specs: string[];
  rating: number;
  reviews_count: number;
  in_stock: boolean;
  image: string;
}

const categories = ["Semua", "Penggiling", "Pencacah", "Daur Ulang", "Penghancur", "Pelletizer", "Kompak"];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

interface CheckoutForm {
  name: string;
  phone: string;
  address: string;
  notes: string;
}

const Products = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/");
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
      toast({
        title: "Error",
        description: "Gagal memuat produk",
        variant: "destructive"
      });
    }
  };

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

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkoutForm.name.trim() || !checkoutForm.phone.trim() || !checkoutForm.address.trim()) {
      toast({
        title: "Mohon lengkapi data",
        description: "Nama, nomor telepon, dan alamat wajib diisi.",
        variant: "destructive",
      });
      return;
    }

    // Generate order ID
    const orderId = `INV-${Date.now().toString(36).toUpperCase()}`;
    const orderDate = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Prepare order data for confirmation page
    const orderData = {
      orderId,
      orderDate,
      customerName: checkoutForm.name.trim(),
      customerPhone: checkoutForm.phone.trim(),
      customerAddress: checkoutForm.address.trim(),
      customerNotes: checkoutForm.notes.trim(),
      items: cart.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total: cartTotal,
    };

    // Reset state
    setCart([]);
    setCheckoutForm({ name: "", phone: "", address: "", notes: "" });
    setShowCheckout(false);
    setShowCart(false);

    // Navigate to confirmation page
    navigate("/order-confirmation", { state: orderData });
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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
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
                  {!product.in_stock && (
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
                      <span className="text-muted-foreground">({product.reviews_count})</span>
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
                      disabled={!product.in_stock}
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
                    size="xl"
                    className="w-full"
                    onClick={() => setShowCheckout(true)}
                  >
                    <CreditCard className="w-5 h-5" />
                    Lanjutkan Checkout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setShowCheckout(false)} />
          <div className="relative w-full max-w-lg bg-background rounded-2xl shadow-xl animate-fade-in max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Checkout Pesanan</h2>
              <button onClick={() => setShowCheckout(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-5">
              {/* Order Summary */}
              <div className="p-4 rounded-xl bg-secondary/30 space-y-2">
                <h3 className="font-semibold text-foreground mb-3">Ringkasan Pesanan</h3>
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.product.name} x{item.quantity}</span>
                    <span className="text-foreground">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="pt-2 mt-2 border-t border-border flex justify-between font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              {/* Buyer Info */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <User className="w-4 h-4" />
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={checkoutForm.name}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Phone className="w-4 h-4" />
                  Nomor Telepon *
                </label>
                <input
                  type="tel"
                  value={checkoutForm.phone}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+62 812 3456 7890"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  Alamat Pengiriman *
                </label>
                <textarea
                  value={checkoutForm.address}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Alamat lengkap untuk pengiriman"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  value={checkoutForm.notes}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Catatan untuk pesanan..."
                />
              </div>

              <Button type="submit" variant="whatsapp" size="xl" className="w-full">
                <MessageCircle className="w-5 h-5" />
                Kirim Pesanan via WhatsApp
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Data pesanan Anda akan dikirim ke WhatsApp untuk konfirmasi
              </p>
            </form>
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
            <a href="https://wa.me/6281288866107" target="_blank" rel="noopener noreferrer">
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