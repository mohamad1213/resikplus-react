import { useState, useEffect } from "react";
import {
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  ArrowRight,
  PlayCircle,
  CheckCircle,
  Star,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";

import api from "@/lib/api";

const recentActivities = [
  { id: 1, action: "Menyelesaikan modul", course: "Pengelolaan Sampah", time: "2 jam lalu" },
  { id: 2, action: "Memulai kursus baru", course: "Daur Ulang Industri", time: "1 hari lalu" },
  { id: 3, action: "Mendapat sertifikat", course: "Workshop Komunitas", time: "3 hari lalu" },
];

const recommendedCourses = [
  {
    id: 3,
    title: "Strategi Ekonomi Sirkular",
    level: "Lanjutan",
    duration: "8 minggu",
    students: 428,
    rating: 4.9,
  },
  {
    id: 4,
    title: "Program Keberlanjutan UMKM",
    level: "Pemula",
    duration: "5 minggu",
    students: 672,
    rating: 4.7,
  },
];

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUserRole();
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Learner";

  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const res = await api.get("/courses/my_courses/");
      // Grab top 3 courses for dashboard
      setEnrolledCourses(res.data.slice(0, 3));
    } catch (error) {
      console.error(error);
    }
  };

  const stats = [
    {
      title: "Kursus Aktif",
      value: "2",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Sedang berjalan",
    },
    {
      title: "Progress Keseluruhan",
      value: "52%",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Rata-rata progress",
    },
    {
      title: "Sertifikat",
      value: "1",
      icon: Award,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      description: "Telah diperoleh",
    },
    {
      title: "Waktu Belajar",
      value: "24 jam",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: "Bulan ini",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden relative">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Selamat Datang, {userName}! 🎓
              </h2>
              <p className="text-primary-foreground/80 max-w-lg">
                Lanjutkan perjalanan belajar Anda. Anda telah menyelesaikan 52% dari kursus aktif.
                Tetap semangat!
              </p>
            </div>
            <Button
              variant="secondary"
              className="shrink-0"
              onClick={() => navigate("/customer/courses")}
            >
              Lanjutkan Belajar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -right-5 -bottom-20 w-32 h-32 bg-white/5 rounded-full" />
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Courses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Kursus Aktif</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate("/customer/courses")}>
              Lihat Semua
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid gap-4">
            {enrolledCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-32 h-24 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {course.image ? (
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="w-10 h-10 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold">{course.title}</h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </p>
                        </div>
                        <Badge
                          variant={course.progress === 100 ? "default" : "secondary"}
                        >
                          {course.progress === 100 ? "Selesai" : "Berlangsung"}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Selanjutnya: {course.next_lesson}
                        </p>
                        <Button size="sm" className="gap-2" onClick={() => navigate(`/course/${course.id}/modules`)}>
                          <PlayCircle className="w-4 h-4" />
                          Lanjutkan
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Aktivitas Terbaru</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.course}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recommended Courses */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Rekomendasi Kursus</CardTitle>
              <CardDescription>Berdasarkan minat Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendedCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-3 rounded-lg border hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer"
                  onClick={() => navigate(`/course/${course.id}`)}
                >
                  <h4 className="font-medium text-sm mb-2">{course.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {course.level}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {course.rating}
                    </span>
                    <span>{course.students} siswa</span>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => navigate("/courses")}
              >
                Jelajahi Semua Kursus
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Schedule */}
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900">Webinar Mendatang</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    "Inovasi Daur Ulang 2024"
                  </p>
                  <p className="text-xs text-amber-600 mt-2">
                    15 Januari 2024, 14:00 WIB
                  </p>
                  <Button size="sm" variant="outline" className="mt-3 border-amber-300">
                    Daftar Sekarang
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
