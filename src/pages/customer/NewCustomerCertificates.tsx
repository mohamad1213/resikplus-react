import { useState } from "react";
import {
  Award,
  Download,
  Share2,
  ExternalLink,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";

const NewCustomerCertificates = () => {
  const { toast } = useToast();
  const { purchasedCourses, user } = useCustomerAuth();

  const completedCourses = purchasedCourses.filter(c => c.status === "completed");
  const activeCourses = purchasedCourses.filter(c => c.status === "active");

  const handleDownload = (courseName: string) => {
    toast({
      title: "Mengunduh Sertifikat",
      description: `Sertifikat untuk "${courseName}" sedang diunduh...`,
    });
  };

  const handleShare = (courseName: string) => {
    const shareUrl = `${window.location.origin}/verify/CERT-${Date.now()}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Disalin!",
      description: "Link verifikasi sertifikat telah disalin ke clipboard.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Sertifikat Saya</h1>
        <p className="text-muted-foreground">
          Kelola dan bagikan sertifikat yang telah Anda peroleh
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-xl">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCourses.length}</p>
                <p className="text-sm text-muted-foreground">Sertifikat Diperoleh</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeCourses.length}</p>
                <p className="text-sm text-muted-foreground">Dalam Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {completedCourses.length > 0 
                    ? new Date().toLocaleDateString("id-ID", { month: "short", year: "numeric" })
                    : "-"
                  }
                </p>
                <p className="text-sm text-muted-foreground">Sertifikat Terakhir</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates Grid */}
      <section className="space-y-4">
        <h2 className="font-semibold text-lg">Sertifikat yang Diperoleh</h2>
        
        {completedCourses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Award className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Belum ada sertifikat
              </h3>
              <p className="text-muted-foreground">
                Selesaikan kursus untuk mendapatkan sertifikat
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {completedCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Certificate Preview */}
                <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-6 border-b relative">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-4 border-2 border-amber-400 rounded-lg" />
                    <div className="absolute inset-6 border border-amber-300 rounded-lg" />
                  </div>
                  <div className="relative text-center">
                    <Award className="w-12 h-12 mx-auto text-amber-500 mb-3" />
                    <h4 className="font-bold text-lg text-amber-900">
                      Sertifikat Kelulusan
                    </h4>
                    <p className="text-amber-700 mt-1 font-medium line-clamp-2">
                      {course.title}
                    </p>
                    <Badge className="mt-3 bg-amber-100 text-amber-800 hover:bg-amber-100">
                      Nilai: A
                    </Badge>
                  </div>
                </div>

                {/* Certificate Details */}
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Nomor Sertifikat</span>
                    <span className="font-mono font-medium">CERT-{course.id}-2024</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tanggal Terbit</span>
                    <span>{new Date(course.purchasedAt).toLocaleDateString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Instruktur</span>
                    <span>{course.instructor}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Lihat
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Sertifikat</DialogTitle>
                        </DialogHeader>
                        <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-8 rounded-lg border relative">
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-4 border-2 border-amber-400 rounded-lg" />
                          </div>
                          <div className="relative text-center space-y-4">
                            <Award className="w-16 h-16 mx-auto text-amber-500" />
                            <div>
                              <p className="text-sm text-amber-600">Sertifikat Ini Diberikan Kepada</p>
                              <h3 className="text-2xl font-bold text-amber-900 mt-2">
                                {user?.name || "Peserta"}
                              </h3>
                            </div>
                            <p className="text-amber-700">
                              Telah berhasil menyelesaikan kursus
                            </p>
                            <h4 className="text-xl font-bold text-amber-900">
                              "{course.title}"
                            </h4>
                            <div className="flex justify-center gap-8 mt-6 text-sm text-amber-700">
                              <div>
                                <p className="font-semibold">Tanggal</p>
                                <p>{new Date(course.purchasedAt).toLocaleDateString("id-ID")}</p>
                              </div>
                              <div>
                                <p className="font-semibold">No. Sertifikat</p>
                                <p className="font-mono">CERT-{course.id}-2024</p>
                              </div>
                              <div>
                                <p className="font-semibold">Nilai</p>
                                <p>A</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(course.title)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(course.title)}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Pending Certificates */}
      {activeCourses.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-semibold text-lg">Sertifikat Dalam Progress</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {activeCourses.map((course) => (
              <Card key={course.id} className="border-dashed">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-muted rounded-xl">
                      <Award className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{course.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {course.totalModules - course.completedModules} modul lagi
                      </p>
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default NewCustomerCertificates;
