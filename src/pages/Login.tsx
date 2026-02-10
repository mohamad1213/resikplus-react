import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import logoResikplus from "@/assets/logo-resikplus.jpg";
import { useEffect } from "react";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast({
        title: "Login Berhasil",
        description: "Selamat datang di ResikPlus!",
      });
      // Allow a brief moment for state to update, or better yet, rely on AuthContext user state change in a useEffect if not available immediately. 
      // However, AuthContext.login sets state. 
      // Since we can't synchronously check 'user' here easily without waiting, 
      // and checking result.success is just a boolean.
      // Let's defer navigation to a useEffect listening to 'user'. 
      // OR, we can assume if login success, the useEffect below (which I will add) handles it.
    } else {
      toast({
        title: "Login Gagal",
        description: result.error,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  // Add useEffect for redirection
  const { user } = useAuth(); // Destructure user

  useEffect(() => {
    if (user) {
      if (user.is_staff || user.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/customer");
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center gap-3">
              <img
                src={logoResikplus}
                alt="ResikPlus Logo"
                className="h-16 w-auto object-contain"
              />
              <span className="text-2xl font-bold text-primary">RESIKPLUS</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Masuk ke Akun</CardTitle>
          <CardDescription>
            Masukkan email dan password untuk melanjutkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@resikplus.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Memproses..." : "Masuk"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
