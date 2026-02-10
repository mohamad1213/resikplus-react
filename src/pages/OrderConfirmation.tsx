import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { CheckCircle, Printer, MessageCircle, ArrowLeft, Package, User, Phone, MapPin, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderData {
  orderId: string;
  orderDate: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNotes: string;
  items: OrderItem[];
  total: number;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const orderData = location.state as OrderData | null;

  useEffect(() => {
    if (!orderData) {
      navigate("/products");
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const orderDetails = orderData.items
      .map((item) => `• ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`)
      .join("\n");
    
    const message = encodeURIComponent(
      `🛒 *KONFIRMASI PESANAN - RESIKPLUS*\n\n` +
      `📋 *No. Invoice: ${orderData.orderId}*\n` +
      `📅 Tanggal: ${orderData.orderDate}\n\n` +
      `👤 *Data Pembeli:*\n` +
      `Nama: ${orderData.customerName}\n` +
      `Telepon: ${orderData.customerPhone}\n` +
      `Alamat: ${orderData.customerAddress}\n` +
      `${orderData.customerNotes ? `Catatan: ${orderData.customerNotes}\n` : ""}` +
      `\n📦 *Detail Pesanan:*\n${orderDetails}\n\n` +
      `💰 *Total: ${formatPrice(orderData.total)}*\n\n` +
      `Mohon konfirmasi pesanan saya. Terima kasih!`
    );
    
    window.open(`https://wa.me/6281288866107?text=${message}`, "_blank");
  };

  return (
    <Layout>
      <section className="section-padding bg-gradient-to-b from-primary/5 to-background min-h-screen">
        <div className="container-wide max-w-4xl">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Pesanan Berhasil Dibuat!
            </h1>
            <p className="text-muted-foreground">
              Terima kasih! Silakan lanjutkan konfirmasi via WhatsApp.
            </p>
          </div>

          {/* Invoice Card */}
          <div 
            ref={invoiceRef}
            className="bg-background rounded-2xl shadow-lg border border-border overflow-hidden print:shadow-none print:border-0"
          >
            {/* Invoice Header */}
            <div className="bg-primary text-primary-foreground p-6 print:bg-primary">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold">INVOICE</h2>
                  <p className="text-primary-foreground/80">ResikPlus Indonesia</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <FileText className="w-4 h-4" />
                    <span className="font-semibold">{orderData.orderId}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-end text-sm text-primary-foreground/80">
                    <Calendar className="w-4 h-4" />
                    <span>{orderData.orderDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Informasi Pembeli
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Nama</p>
                      <p className="text-foreground font-medium">{orderData.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Telepon</p>
                      <p className="text-foreground font-medium">{orderData.customerPhone}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Alamat Pengiriman</p>
                      <p className="text-foreground font-medium">{orderData.customerAddress}</p>
                    </div>
                  </div>
                  {orderData.customerNotes && (
                    <div className="flex items-start gap-3">
                      <FileText className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Catatan</p>
                        <p className="text-foreground font-medium">{orderData.customerNotes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Detail Pesanan
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 text-sm font-semibold text-foreground">Produk</th>
                      <th className="text-center py-3 text-sm font-semibold text-foreground">Qty</th>
                      <th className="text-right py-3 text-sm font-semibold text-foreground">Harga</th>
                      <th className="text-right py-3 text-sm font-semibold text-foreground">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData.items.map((item, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-4 text-foreground">{item.name}</td>
                        <td className="py-4 text-center text-muted-foreground">{item.quantity}</td>
                        <td className="py-4 text-right text-muted-foreground">{formatPrice(item.price)}</td>
                        <td className="py-4 text-right text-foreground font-medium">{formatPrice(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="pt-6 text-right font-semibold text-foreground">Total Pembayaran</td>
                      <td className="pt-6 text-right text-xl font-bold text-primary">{formatPrice(orderData.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Footer Note */}
            <div className="bg-secondary/30 p-6 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                Silakan konfirmasi pesanan Anda melalui WhatsApp untuk proses pembayaran dan pengiriman.
                <br />
                Hubungi kami: <span className="font-medium text-foreground">+62 812 8886 6107</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 print:hidden">
            <Button variant="outline" size="lg" className="flex-1" onClick={() => navigate("/products")}>
              <ArrowLeft className="w-5 h-5" />
              Kembali ke Produk
            </Button>
            <Button variant="outline" size="lg" className="flex-1" onClick={handlePrint}>
              <Printer className="w-5 h-5" />
              Cetak Invoice
            </Button>
            <Button variant="whatsapp" size="lg" className="flex-1" onClick={handleWhatsApp}>
              <MessageCircle className="w-5 h-5" />
              Konfirmasi via WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:shadow-none,
          .print\\:shadow-none * {
            visibility: visible;
          }
          .print\\:hidden {
            display: none !important;
          }
          header, footer, .fixed {
            display: none !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default OrderConfirmation;
