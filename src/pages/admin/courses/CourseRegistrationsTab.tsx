import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

interface Registration {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  notes: string;
  status: string;
  created_at: string;
  course: number;
}

const CourseRegistrationsTab = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await api.get("/course-registrations/");
      const data = response.data.results || response.data;
      if (Array.isArray(data)) {
        setRegistrations(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat peserta kursus.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reg: Registration) => {
    try {
      const res = await api.post(`/course-registrations/${reg.id}/approve/`);
      toast.success(res.data.detail);
      
      const email = res.data.email;
      const passwd = res.data.password;
      const course = res.data.course;

      // Construct WA Message
      const waMsg = `Halo ${reg.full_name}, selamat pembayaran Anda untuk kursus ${course} telah disetujui!
      
Akses akun Anda:
Username/Email: ${email}
Password: ${passwd}

Silahkan login di website ResikPlus.`;

      const waUrl = `https://wa.me/${reg.phone}?text=${encodeURIComponent(waMsg)}`;
      window.open(waUrl, "_blank");

      // Refresh data
      fetchRegistrations();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Gagal menyetujui pendaftaran.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Peserta Kursus</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Memuat...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Peserta</TableHead>
                <TableHead>Email / No HP</TableHead>
                <TableHead>Kursus (ID)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground p-4">
                    Belum ada yang mendaftar kursus.
                  </TableCell>
                </TableRow>
              ) : (
                registrations.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell className="font-medium">{reg.full_name}</TableCell>
                    <TableCell>
                      <div className="text-sm">{reg.email}</div>
                      <div className="text-xs text-muted-foreground">{reg.phone}</div>
                    </TableCell>
                    <TableCell>{reg.course}</TableCell>
                    <TableCell>
                      <Badge variant={reg.status === "berhasil" ? "secondary" : "outline"} className={
                        reg.status === "berhasil" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }>
                        {reg.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(reg.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {reg.status === "process" ? (
                        <Button size="sm" onClick={() => handleApprove(reg)} className="bg-green-600 hover:bg-green-700">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => {
                          const waUrl = `https://wa.me/${reg.phone}`;
                          window.open(waUrl, "_blank");
                        }}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Chat WA
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseRegistrationsTab;
