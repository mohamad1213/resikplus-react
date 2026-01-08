import { useState } from "react";
import { Search, Plus, MoreHorizontal, Edit, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const dummyProducts = [
  { id: 1, name: "Mesin Pencacah Plastik", category: "Mesin", price: "Rp 15.000.000", stock: 5, status: "Tersedia" },
  { id: 2, name: "Komposter Organik", category: "Alat", price: "Rp 500.000", stock: 20, status: "Tersedia" },
  { id: 3, name: "Tas Daur Ulang", category: "Produk", price: "Rp 50.000", stock: 0, status: "Habis" },
  { id: 4, name: "Pupuk Kompos", category: "Produk", price: "Rp 25.000", stock: 100, status: "Tersedia" },
  { id: 5, name: "Mesin Press Kardus", category: "Mesin", price: "Rp 8.000.000", stock: 3, status: "Tersedia" },
  { id: 6, name: "Tempat Sampah Pilah", category: "Alat", price: "Rp 150.000", stock: 50, status: "Tersedia" },
];

const AdminProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = dummyProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari produk..."
            className="pl-9 w-full sm:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Tambah Produk
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-destructive">
                      <Trash2 className="w-4 h-4" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="font-semibold">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{product.category}</Badge>
                  <Badge variant={product.status === "Tersedia" ? "default" : "destructive"}>
                    {product.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-bold text-primary">{product.price}</span>
                  <span className="text-sm text-muted-foreground">Stok: {product.stock}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
