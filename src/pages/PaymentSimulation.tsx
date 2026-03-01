import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Building2,
  Wallet,
  QrCode,
  CheckCircle,
  Clock,
  ArrowLeft,
  Shield,
  Copy,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import logoResikplus from "@/assets/logo-resikplus.jpg";
import React from "react";
type PaymentMethod = "bank" | "ewallet" | "qris";
type PaymentStatus = "pending" | "processing" | "success";

interface CourseData {
  id: number;
  title: string;
  price: string;
  priceNumber: number;
  duration: string;
  level: string;
  totalModules: number;
  instructor: string;
  description: string;
}

const PaymentSimulation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addPurchasedCourse } = useCustomerAuth();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("bank");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending");
  const [countdown, setCountdown] = useState(300); // 5 minutes

  const course: CourseData | undefined = location.state?.course;

  useEffect(() => {
    if (!course) {
      navigate("/courses");
    }
  }, [course, navigate]);

  useEffect(() => {
    if (paymentStatus === "pending" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, paymentStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Disalin!",
      description: "Nomor berhasil disalin ke clipboard",
    });
  };

  const simulatePayment = () => {
    setPaymentStatus("processing");

    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus("success");

      if (course) {
        addPurchasedCourse({
          id: course.id,
          title: course.title,
          description: course.description,
          duration: course.duration,
          level: course.level,
          price: course.price,
          totalModules: course.totalModules,
          instructor: course.instructor,
        });
      }
    }, 2000);
  };

  const handleWhatsAppConfirmation = () => {
    if (!course) return;

    const message = `Halo ResikPlus! 👋

Saya telah menyelesaikan pembayaran untuk kursus:

📚 *${course.title}*
💰 Total: ${course.price}

Mohon konfirmasi untuk aktivasi akses kursus saya. Terima kasih!`;

    window.open(`https://wa.me/6285156803370?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (!course) {
    return null;
  }

  const paymentMethods = [
    { id: "bank" as const, name: "Transfer Bank", icon: Building2, description: "BCA, Mandiri, BNI, BRI" },
    { id: "ewallet" as const, name: "E-Wallet", icon: Wallet, description: "GoPay, OVO, DANA" },
    { id: "qris" as const, name: "QRIS", icon: QrCode, description: "Scan & Pay" },
  ];

  // Success state
  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg text-center">
          <CardContent className="pt-10 pb-8 space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-2">Pembayaran Berhasil!</h2>
              <p className="text-muted-foreground">
                Terima kasih! Pembayaran Anda telah diterima.
              </p>
            </div>

            <Card className="bg-muted/50">
              <CardContent className="p-4 text-left">
                <p className="text-sm text-muted-foreground mb-1">Kursus yang dibeli:</p>
                <p className="font-semibold">{course.title}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Kursus sudah ditambahkan ke My Learning
                </p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button
                onClick={handleWhatsAppConfirmation}
                className="w-full bg-green-600 hover:bg-green-700 gap-2"
                size="lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Konfirmasi via WhatsApp
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/customer")}
                className="w-full"
                size="lg"
              >
                Buka My Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Processing state
  if (paymentStatus === "processing") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg text-center">
          <CardContent className="pt-10 pb-8 space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <RefreshCw className="w-10 h-10 text-primary animate-spin" />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">Memproses Pembayaran...</h2>
              <p className="text-muted-foreground">
                Mohon tunggu, pembayaran Anda sedang diverifikasi
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <img src={logoResikplus} alt="ResikPlus" className="w-10 h-10 rounded-lg object-cover" />
            <div>
              <p className="font-bold">Pembayaran</p>
              <p className="text-xs text-muted-foreground">ResikPlus Learning</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timer */}
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-700">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Selesaikan pembayaran dalam</span>
                  </div>
                  <Badge variant="outline" className="text-amber-700 border-amber-300 text-lg font-mono">
                    {formatTime(countdown)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pilih Metode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${selectedMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                      }`}
                  >
                    <div className={`p-3 rounded-lg ${selectedMethod === method.id ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}>
                      <method.icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">{method.name}</p>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                    {selectedMethod === method.id && (
                      <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                    )}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Payment Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instruksi Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedMethod === "bank" && (
                  <>
                    <div className="p-4 bg-muted rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Bank BCA</span>
                        <Badge>Virtual Account</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-mono font-bold">8810 8123 4567 8901</span>
                        <Button size="sm" variant="ghost" onClick={() => handleCopy("8810812345678901")}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>1. Login ke BCA Mobile atau iBanking</p>
                      <p>2. Pilih menu Transfer &gt; Virtual Account</p>
                      <p>3. Masukkan nomor VA di atas</p>
                      <p>4. Konfirmasi pembayaran</p>
                    </div>
                  </>
                )}

                {selectedMethod === "ewallet" && (
                  <>
                    <div className="p-4 bg-muted rounded-xl text-center">
                      <p className="text-sm text-muted-foreground mb-2">Nomor Pembayaran</p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xl font-mono font-bold">081234567890</span>
                        <Button size="sm" variant="ghost" onClick={() => handleCopy("081234567890")}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>1. Buka aplikasi GoPay/OVO/DANA</p>
                      <p>2. Pilih menu Bayar atau Transfer</p>
                      <p>3. Masukkan nomor di atas</p>
                      <p>4. Konfirmasi pembayaran</p>
                    </div>
                  </>
                )}

                {selectedMethod === "qris" && (
                  <div className="text-center space-y-4">
                    <div className="w-48 h-48 mx-auto bg-muted rounded-xl flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Scan QR code di atas menggunakan aplikasi e-wallet atau mobile banking Anda
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Simulate Payment Button (Demo) */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-primary">Mode Demo</p>
                    <p className="text-sm text-muted-foreground">Klik untuk simulasi pembayaran berhasil</p>
                  </div>
                  <Button onClick={simulatePayment}>
                    Simulasi Bayar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm line-clamp-2">{course.title}</p>
                      <p className="text-xs text-muted-foreground">{course.duration} • {course.level}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Harga Kursus</span>
                    <span>{course.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Biaya Admin</span>
                    <span>Rp 0</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{course.price}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                  <Shield className="w-4 h-4" />
                  <span>Transaksi aman & terenkripsi</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentSimulation;
