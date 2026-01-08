import {
  Users,
  Package,
  Building2,
  TrendingUp,
  Recycle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const stats = [
  {
    title: "Total Pengguna",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Total Produk",
    value: "456",
    change: "+8%",
    trend: "up",
    icon: Package,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Total Mitra",
    value: "89",
    change: "+5%",
    trend: "up",
    icon: Building2,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Sampah Terdaur",
    value: "12.5 Ton",
    change: "-3%",
    trend: "down",
    icon: Recycle,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
];

const recentActivities = [
  { id: 1, action: "Pengguna baru mendaftar", user: "Budi Santoso", time: "5 menit lalu" },
  { id: 2, action: "Mitra baru bergabung", user: "PT Daur Ulang Jaya", time: "1 jam lalu" },
  { id: 3, action: "Produk baru ditambahkan", user: "Admin", time: "2 jam lalu" },
  { id: 4, action: "Kursus selesai", user: "Siti Nurhaliza", time: "3 jam lalu" },
  { id: 5, action: "Laporan dikirim", user: "CV Hijau Lestari", time: "5 jam lalu" },
];

const topPartners = [
  { name: "PT Daur Ulang Jaya", recycled: "2.5 Ton", percentage: 85 },
  { name: "CV Hijau Lestari", recycled: "1.8 Ton", percentage: 72 },
  { name: "UD Bersih Sejahtera", recycled: "1.2 Ton", percentage: 60 },
  { name: "PT Eco Indonesia", recycled: "0.9 Ton", percentage: 45 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={cn("p-3 rounded-xl", stat.bgColor)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
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
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>Aktivitas terbaru di platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Partners */}
        <Card>
          <CardHeader>
            <CardTitle>Top Mitra</CardTitle>
            <CardDescription>Mitra dengan kontribusi tertinggi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPartners.map((partner, index) => (
                <div key={partner.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium">{partner.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {partner.recycled}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${partner.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary rounded-xl">
                <TrendingUp className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold">85%</p>
                <p className="text-sm text-muted-foreground">Tingkat Daur Ulang</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-500 rounded-xl">
                <Recycle className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold">45.2 Ton</p>
                <p className="text-sm text-muted-foreground">Total Daur Ulang</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-500 rounded-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold">256</p>
                <p className="text-sm text-muted-foreground">Pengguna Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
