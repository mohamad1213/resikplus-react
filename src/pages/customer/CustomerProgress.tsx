import {
  TrendingUp,
  BookOpen,
  Clock,
  Target,
  Calendar,
  Award,
  Flame,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Demo data
const weeklyProgress = [
  { day: "Sen", hours: 2 },
  { day: "Sel", hours: 1.5 },
  { day: "Rab", hours: 3 },
  { day: "Kam", hours: 0.5 },
  { day: "Jum", hours: 2 },
  { day: "Sab", hours: 4 },
  { day: "Min", hours: 1 },
];

const courseProgress = [
  {
    title: "Dasar-Dasar Pengelolaan Sampah",
    progress: 75,
    modules: [
      { name: "Pengenalan Sampah", completed: true },
      { name: "Metode Pengumpulan", completed: true },
      { name: "Pengolahan Dasar", completed: true },
      { name: "Praktik & Sertifikasi", completed: false },
    ],
  },
  {
    title: "Teknik Daur Ulang Industri",
    progress: 30,
    modules: [
      { name: "Material Recovery", completed: true },
      { name: "Teknologi Pemrosesan", completed: false },
      { name: "Kontrol Kualitas", completed: false },
      { name: "Keselamatan & Praktik", completed: false },
    ],
  },
];

const achievements = [
  { name: "First Step", description: "Menyelesaikan modul pertama", earned: true, icon: "🎯" },
  { name: "Dedicated Learner", description: "Belajar 7 hari berturut-turut", earned: true, icon: "🔥" },
  { name: "Quick Learner", description: "Selesaikan kursus dalam 2 minggu", earned: true, icon: "⚡" },
  { name: "Master", description: "Selesaikan 5 kursus", earned: false, icon: "👑" },
];

const CustomerProgress = () => {
  const maxHours = Math.max(...weeklyProgress.map((d) => d.hours));
  const totalHoursThisWeek = weeklyProgress.reduce((sum, d) => sum + d.hours, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Progress Belajar</h2>
        <p className="text-muted-foreground">
          Pantau kemajuan dan pencapaian Anda
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalHoursThisWeek}h</p>
                <p className="text-sm text-muted-foreground">Minggu ini</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">7</p>
                <p className="text-sm text-muted-foreground">Hari Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Modul Selesai</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Achievement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Aktivitas Mingguan
            </CardTitle>
            <CardDescription>Jam belajar per hari</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-48">
              {weeklyProgress.map((day, index) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center">
                    <span className="text-sm font-medium mb-1">{day.hours}h</span>
                    <div
                      className="w-full bg-primary/20 rounded-t-lg transition-all duration-500"
                      style={{
                        height: `${(day.hours / maxHours) * 120}px`,
                        minHeight: "10px",
                      }}
                    >
                      <div
                        className="w-full bg-primary rounded-t-lg transition-all duration-500"
                        style={{
                          height: `${(day.hours / maxHours) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Pencapaian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.name}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  achievement.earned
                    ? "bg-primary/5 border-primary/20"
                    : "bg-muted/30 border-muted opacity-60"
                }`}
              >
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {achievement.description}
                  </p>
                </div>
                {achievement.earned && (
                  <Badge variant="default" className="shrink-0">
                    ✓
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Course Progress Detail */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Detail Progress Kursus
          </CardTitle>
          <CardDescription>
            Lihat kemajuan setiap modul dalam kursus Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {courseProgress.map((course, courseIndex) => (
            <div key={courseIndex} className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{course.title}</h4>
                <Badge variant="secondary">{course.progress}%</Badge>
              </div>

              <Progress value={course.progress} className="h-2" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {course.modules.map((module, moduleIndex) => (
                  <div
                    key={moduleIndex}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      module.completed
                        ? "bg-green-50 border-green-200"
                        : "bg-muted/30 border-muted"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                        module.completed ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {module.completed ? "✓" : moduleIndex + 1}
                    </div>
                    <p className="text-xs font-medium line-clamp-2">{module.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Learning Goals */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary rounded-xl">
                <Target className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Target Mingguan</h3>
                <p className="text-muted-foreground">
                  Selesaikan 2 modul per minggu untuk mencapai target
                </p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-3xl font-bold text-primary">1/2</p>
              <p className="text-sm text-muted-foreground">Modul minggu ini</p>
            </div>
          </div>
          <Progress value={50} className="mt-4 h-3" />
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerProgress;
