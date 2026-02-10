import { useState } from "react";
import {
  BookOpen,
  Clock,
  PlayCircle,
  CheckCircle,
  Filter,
  Search,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

// Demo data
const allCourses = [
  {
    id: 1,
    title: "Dasar-Dasar Pengelolaan Sampah",
    progress: 75,
    status: "in_progress",
    nextLesson: "Modul 3: Pengolahan Dasar",
    duration: "4 minggu",
    totalModules: 4,
    completedModules: 3,
    enrolledAt: "2024-01-01",
  },
  {
    id: 2,
    title: "Teknik Daur Ulang Industri",
    progress: 30,
    status: "in_progress",
    nextLesson: "Modul 2: Teknologi Pemrosesan",
    duration: "6 minggu",
    totalModules: 4,
    completedModules: 1,
    enrolledAt: "2024-01-05",
  },
  {
    id: 6,
    title: "Workshop Daur Ulang Komunitas",
    progress: 100,
    status: "completed",
    nextLesson: "-",
    duration: "2 minggu",
    totalModules: 4,
    completedModules: 4,
    enrolledAt: "2023-12-01",
    completedAt: "2023-12-14",
  },
];

const CustomerCourses = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "in_progress" && course.status === "in_progress") ||
      (activeTab === "completed" && course.status === "completed");
    return matchesSearch && matchesTab;
  });

  const inProgressCount = allCourses.filter((c) => c.status === "in_progress").length;
  const completedCount = allCourses.filter((c) => c.status === "completed").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Kursus Saya</h2>
          <p className="text-muted-foreground">
            Kelola dan lanjutkan kursus yang Anda ikuti
          </p>
        </div>
        <Button onClick={() => navigate("/courses")}>
          <BookOpen className="w-4 h-4 mr-2" />
          Jelajahi Kursus Baru
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari kursus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">
            Semua ({allCourses.length})
          </TabsTrigger>
          <TabsTrigger value="in_progress">
            Berlangsung ({inProgressCount})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Selesai ({completedCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredCourses.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Tidak ada kursus ditemukan
                </h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === "all"
                    ? "Anda belum mengikuti kursus apapun."
                    : activeTab === "in_progress"
                    ? "Tidak ada kursus yang sedang berlangsung."
                    : "Anda belum menyelesaikan kursus apapun."}
                </p>
                <Button onClick={() => navigate("/courses")}>
                  Mulai Belajar Sekarang
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Course Image */}
                      <div className="w-full lg:w-48 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-primary" />
                      </div>

                      {/* Course Info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-semibold">{course.title}</h3>
                            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {course.duration}
                              </span>
                              <span>•</span>
                              <span>
                                {course.completedModules}/{course.totalModules} Modul
                              </span>
                            </div>
                          </div>
                          <Badge
                            variant={course.status === "completed" ? "default" : "secondary"}
                            className={
                              course.status === "completed"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : ""
                            }
                          >
                            {course.status === "completed" ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Selesai
                              </>
                            ) : (
                              "Berlangsung"
                            )}
                          </Badge>
                        </div>

                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <Progress
                            value={course.progress}
                            className={`h-2 ${
                              course.status === "completed" ? "[&>div]:bg-green-500" : ""
                            }`}
                          />
                        </div>

                        {/* Next Lesson / Actions */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                          {course.status === "in_progress" ? (
                            <>
                              <p className="text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">Selanjutnya:</span>{" "}
                                {course.nextLesson}
                              </p>
                              <Button className="gap-2">
                                <PlayCircle className="w-4 h-4" />
                                Lanjutkan Belajar
                              </Button>
                            </>
                          ) : (
                            <>
                              <p className="text-sm text-muted-foreground">
                                Selesai pada {new Date(course.completedAt!).toLocaleDateString("id-ID")}
                              </p>
                              <div className="flex gap-2">
                                <Button variant="outline" onClick={() => navigate("/customer/certificates")}>
                                  Lihat Sertifikat
                                </Button>
                                <Button variant="ghost">
                                  Ulang Kursus
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerCourses;
