import { BookOpen, Clock, PlayCircle, CheckCircle, Award, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";

const MyLearning = () => {
  const navigate = useNavigate();
  const { purchasedCourses } = useCustomerAuth();

  const activeCourses = purchasedCourses.filter(c => c.status === "active");
  const completedCourses = purchasedCourses.filter(c => c.status === "completed");

  if (purchasedCourses.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <BookOpen className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Belum Ada Kursus</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Anda belum memiliki kursus yang aktif. Jelajahi katalog kursus kami dan mulai perjalanan belajar Anda!
        </p>
        <Button onClick={() => navigate("/courses")} size="lg">
          Jelajahi Kursus
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-xl">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeCourses.length}</p>
                <p className="text-sm text-muted-foreground">Kursus Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCourses.length}</p>
                <p className="text-sm text-muted-foreground">Selesai</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-xl">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCourses.length}</p>
                <p className="text-sm text-muted-foreground">Sertifikat</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Jam Belajar</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Courses */}
      {activeCourses.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-primary" />
            Lanjutkan Belajar
          </h2>
          <div className="grid gap-4">
            {activeCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Course Image */}
                    <div className="lg:w-64 h-48 lg:h-auto bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-primary/60" />
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <Badge variant="secondary" className="mb-2">
                            {course.level}
                          </Badge>
                          <h3 className="text-lg font-bold">{course.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Instruktur: {course.instructor}
                          </p>
                        </div>
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                          Akses Aktif
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Akses hingga {new Date(course.accessUntil).toLocaleDateString("id-ID")}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress: {course.completedModules}/{course.totalModules} Modul</span>
                          <span className="font-semibold">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>

                      <Button className="gap-2">
                        <PlayCircle className="w-4 h-4" />
                        Lanjutkan Belajar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Completed Courses */}
      {completedCourses.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Kursus Selesai
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {completedCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                      <Award className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mb-2">
                        Selesai
                      </Badge>
                      <h3 className="font-semibold truncate">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Diselesaikan pada {new Date(course.purchasedAt).toLocaleDateString("id-ID")}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" onClick={() => navigate("/customer/certificates")}>
                          Lihat Sertifikat
                        </Button>
                        <Button size="sm" variant="ghost">
                          Ulang Kursus
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-1">Tingkatkan Keahlian Anda!</h3>
              <p className="text-primary-foreground/80">
                Jelajahi kursus baru dan kembangkan kemampuan Anda
              </p>
            </div>
            <Button variant="secondary" onClick={() => navigate("/courses")}>
              Jelajahi Kursus
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyLearning;
