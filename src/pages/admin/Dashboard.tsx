import { useEffect, useState } from "react";
import {
  Users,
  Package,
  TrendingUp,
  Recycle,
  ArrowUpRight,
  ArrowDownRight,
  Newspaper,
  GraduationCap,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import {
  getDashboardStats,
  getRecentActivities,
  getTopPartners,
  type DashboardStats,
  type RecentActivity,
  type TopPartner,
} from "@/lib/dashboard-api";

/* ================= TYPES ================= */
type StatCard = {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  change: string;
  trend: "up" | "down" | "";
};

/* ================= COMPONENT ================= */
const Dashboard = () => {
  const [stats, setStats] = useState<StatCard[]>([
    {
      title: "Total Pengguna",
      value: "...",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "",
      trend: "",
    },
    {
      title: "Total Produk",
      value: "...",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "",
      trend: "",
    },
    {
      title: "Total Kursus",
      value: "...",
      icon: GraduationCap,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "",
      trend: "",
    },
    {
      title: "Total Berita",
      value: "...",
      icon: Newspaper,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: "",
      trend: "",
    },
  ]);

  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [partners, setPartners] = useState<TopPartner[]>([]);
  const [rawStats, setRawStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, activitiesData, partnersData] = await Promise.all([
          getDashboardStats(),
          getRecentActivities(),
          getTopPartners(),
        ]);

        setRawStats(statsData);

        setStats([
          {
            title: "Total Pengguna",
            value: statsData.total_users.toLocaleString(),
            change: "+12%",
            trend: "up",
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
          },
          {
            title: "Total Produk",
            value: statsData.total_products.toLocaleString(),
            change: "+5%",
            trend: "up",
            icon: Package,
            color: "text-green-600",
            bgColor: "bg-green-100",
          },
          {
            title: "Total Kursus",
            value: statsData.total_courses.toLocaleString(),
            change: "+2%",
            trend: "up",
            icon: GraduationCap,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
          },
          {
            title: "Total Berita",
            value: statsData.total_articles.toLocaleString(),
            change: "+8%",
            trend: "up",
            icon: Newspaper,
            color: "text-orange-600",
            bgColor: "bg-orange-100",
          },
        ]);

        setActivities(activitiesData);
        setPartners(partnersData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-muted-foreground">Loading dashboard...</div>;
  }

  /* ================= RENDER ================= */
  return (
    <div className="space-y-6">
      {/* ===== STATS GRID ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={cn("p-3 rounded-xl", stat.bgColor)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>

                {stat.change && (
                  <div
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium",
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {stat.change}
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ===== ACTIVITIES & PARTNERS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>Aktivitas terbaru di platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Belum ada aktivitas
              </p>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition"
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Top Partners */}
        <Card>
          <CardHeader>
            <CardTitle>Top Mitra</CardTitle>
            <CardDescription>Mitra dengan kontribusi tertinggi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {partners.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Belum ada data mitra
              </p>
            ) : (
              partners.map((partner, index) => (
                <div key={partner.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      {index + 1}. {partner.name}
                    </span>
                    <span className="text-muted-foreground">{partner.recycled}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${partner.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* ===== QUICK STATS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-primary rounded-xl">
              <TrendingUp className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <p className="text-3xl font-bold">85%</p>
              <p className="text-sm text-muted-foreground">Tingkat Daur Ulang</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-green-500 rounded-xl">
              <Recycle className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold">
                {rawStats?.total_recycled
                  ? `${(rawStats.total_recycled / 1000).toFixed(1)} Ton`
                  : "0 Ton"}
              </p>
              <p className="text-sm text-muted-foreground">Total Daur Ulang</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-purple-500 rounded-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold">{rawStats?.total_users ?? 0}</p>
              <p className="text-sm text-muted-foreground">Pengguna Aktif</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
