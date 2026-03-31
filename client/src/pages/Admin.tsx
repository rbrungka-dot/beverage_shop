import { useState } from "react";
import { Plus, Pencil, Trash2, Package, ShoppingBag, Tag, BarChart3, ChevronDown, ChevronUp, Mail, MapPin, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";

const STATUS_LABELS: Record<string, string> = {
  pending: "รอชำระเงิน", paid: "ชำระแล้ว", processing: "เตรียมสินค้า",
  shipped: "จัดส่งแล้ว", delivered: "ได้รับแล้ว", cancelled: "ยกเลิก",
};

interface ProductFormData {
  name: string; description: string; price: string;
  categoryId: string; imageUrl: string; stock: string;
  isActive: boolean; isFeatured: boolean;
}

const defaultForm: ProductFormData = {
  name: "", description: "", price: "", categoryId: "", imageUrl: "",
  stock: "0", isActive: true, isFeatured: false,
};

function ProductsTab() {
  const utils = trpc.useUtils();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductFormData>(defaultForm);

  const { data: products, isLoading } = trpc.products.list.useQuery({ adminView: true });
  const { data: categories } = trpc.categories.list.useQuery();

  const createProduct = trpc.products.create.useMutation({
    onSuccess: () => { utils.products.list.invalidate(); setOpen(false); toast.success("เพิ่มสินค้าสำเร็จ"); },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });
  const updateProduct = trpc.products.update.useMutation({
    onSuccess: () => { utils.products.list.invalidate(); setOpen(false); toast.success("แก้ไขสินค้าสำเร็จ"); },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });
  const deleteProduct = trpc.products.delete.useMutation({
    onSuccess: () => { utils.products.list.invalidate(); toast.success("ลบสินค้าสำเร็จ"); },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });

  const openCreate = () => { setEditId(null); setForm(defaultForm); setOpen(true); };
  const openEdit = (p: any) => {
    setEditId(p.id);
    setForm({ name: p.name, description: p.description || "", price: p.price, categoryId: p.categoryId?.toString() || "", imageUrl: p.imageUrl || "", stock: p.stock.toString(), isActive: p.isActive, isFeatured: p.isFeatured });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name || !form.price) { toast.error("กรุณากรอกชื่อและราคา"); return; }
    const data = {
      name: form.name, description: form.description || undefined,
      price: form.price, categoryId: form.categoryId ? parseInt(form.categoryId) : undefined,
      imageUrl: form.imageUrl || undefined, stock: parseInt(form.stock) || 0,
      isActive: form.isActive, isFeatured: form.isFeatured,
    };
    if (editId) updateProduct.mutate({ id: editId, ...data });
    else createProduct.mutate(data);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl font-semibold text-foreground">จัดการสินค้า</h2>
        <Button onClick={openCreate} className="bg-primary text-primary-foreground gap-2">
          <Plus className="h-4 w-4" /> เพิ่มสินค้า
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
      ) : (
        <div className="space-y-3">
          {products?.map((p) => (
            <div key={p.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" /> : <Package className="h-6 w-6 text-muted-foreground/30 m-3" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-foreground truncate">{p.name}</span>
                  {!p.isActive && <Badge variant="secondary" className="text-xs">ซ่อน</Badge>}
                  {p.isFeatured && <Badge className="bg-accent text-accent-foreground text-xs">แนะนำ</Badge>}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                  <span>฿{parseFloat(p.price).toLocaleString("th-TH")}</span>
                  <span>คงเหลือ: {p.stock}</span>
                  {p.categoryName && <span>{p.categoryName}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => { if (confirm("ลบสินค้านี้?")) deleteProduct.mutate({ id: p.id }); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">{editId ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>ชื่อสินค้า *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" /></div>
            <div><Label>รายละเอียด</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 resize-none" rows={3} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>ราคา (บาท) *</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1" /></div>
              <div><Label>จำนวนสต็อก</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="mt-1" /></div>
            </div>
            <div>
              <Label>หมวดหมู่</Label>
              <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="เลือกหมวดหมู่" /></SelectTrigger>
                <SelectContent>
                  {categories?.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>URL รูปภาพ</Label><Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." className="mt-1" /></div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} id="isActive" />
                <Label htmlFor="isActive">แสดงสินค้า</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.isFeatured} onCheckedChange={(v) => setForm({ ...form, isFeatured: v })} id="isFeatured" />
                <Label htmlFor="isFeatured">สินค้าแนะนำ</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSubmit} disabled={createProduct.isPending || updateProduct.isPending} className="bg-primary text-primary-foreground">
              {editId ? "บันทึก" : "เพิ่มสินค้า"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CategoriesTab() {
  const utils = trpc.useUtils();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const { data: categories, isLoading } = trpc.categories.list.useQuery();
  const createCat = trpc.categories.create.useMutation({
    onSuccess: () => { utils.categories.list.invalidate(); setOpen(false); toast.success("เพิ่มหมวดหมู่สำเร็จ"); },
  });
  const updateCat = trpc.categories.update.useMutation({
    onSuccess: () => { utils.categories.list.invalidate(); setOpen(false); toast.success("แก้ไขสำเร็จ"); },
  });
  const deleteCat = trpc.categories.delete.useMutation({
    onSuccess: () => { utils.categories.list.invalidate(); toast.success("ลบสำเร็จ"); },
  });

  const openCreate = () => { setEditId(null); setName(""); setSlug(""); setDescription(""); setOpen(true); };
  const openEdit = (c: any) => { setEditId(c.id); setName(c.name); setSlug(c.slug); setDescription(c.description || ""); setOpen(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl font-semibold text-foreground">จัดการหมวดหมู่</h2>
        <Button onClick={openCreate} className="bg-primary text-primary-foreground gap-2">
          <Plus className="h-4 w-4" /> เพิ่มหมวดหมู่
        </Button>
      </div>
      {isLoading ? <Skeleton className="h-32 w-full rounded-xl" /> : (
        <div className="space-y-3">
          {categories?.map((c) => (
            <div key={c.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{c.name}</p>
                <p className="text-sm text-muted-foreground">{c.slug}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => { if (confirm("ลบหมวดหมู่นี้?")) deleteCat.mutate({ id: c.id }); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif">{editId ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>ชื่อหมวดหมู่ *</Label><Input value={name} onChange={(e) => { setName(e.target.value); if (!editId) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-")); }} className="mt-1" /></div>
            <div><Label>Slug *</Label><Input value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1" /></div>
            <div><Label>รายละเอียด</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>ยกเลิก</Button>
            <Button onClick={() => { if (!name || !slug) { toast.error("กรุณากรอกข้อมูล"); return; } if (editId) updateCat.mutate({ id: editId, name, slug, description }); else createCat.mutate({ name, slug, description }); }} className="bg-primary text-primary-foreground">
              {editId ? "บันทึก" : "เพิ่ม"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function OrderRow({ order, onUpdateStatus }: { order: any; onUpdateStatus: (id: number, status: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const { data: items } = trpc.orders.adminGetItems.useQuery({ id: order.id }, { enabled: expanded });

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground">คำสั่งซื้อ #{order.id}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"}`}>
                {STATUS_LABELS[order.status] || order.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(order.createdAt).toLocaleString("th-TH")} · <span className="font-semibold text-foreground">฿{parseFloat(order.totalAmount).toLocaleString("th-TH", { minimumFractionDigits: 2 })}</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {order.userName && <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{order.userName}</span>}
              {order.userEmail && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{order.userEmail}</span>}
              {order.shippingName && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{order.shippingName} — {order.shippingAddress}</span>}
              {order.shippingPhone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{order.shippingPhone}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={order.status} onValueChange={(v) => onUpdateStatus(order.id, v)}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="text-muted-foreground">
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-border bg-muted/30 px-4 py-3">
          {!items ? (
            <div className="space-y-2">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">ไม่มีรายการสินค้า</p>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">รายการสินค้า</p>
              {items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-foreground">{item.productName} <span className="text-muted-foreground">× {item.quantity}</span></span>
                  <span className="font-medium text-foreground">฿{(parseFloat(item.priceAtTime) * item.quantity).toLocaleString("th-TH")}</span>
                </div>
              ))}
              {order.notes && <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">หมายเหตุ: {order.notes}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OrdersTab() {
  const utils = trpc.useUtils();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: orders, isLoading } = trpc.orders.adminList.useQuery();
  const updateStatus = trpc.orders.updateStatus.useMutation({
    onSuccess: () => { utils.orders.adminList.invalidate(); toast.success("อัปเดตสถานะสำเร็จ"); },
  });

  const filtered = statusFilter === "all" ? orders : orders?.filter((o) => o.status === statusFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-serif text-xl font-semibold text-foreground">จัดการคำสั่งซื้อ</h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">กรอง:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทั้งหมด ({orders?.length ?? 0})</SelectItem>
              {Object.entries(STATUS_LABELS).map(([v, l]) => (
                <SelectItem key={v} value={v}>{l} ({orders?.filter((o) => o.status === v).length ?? 0})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}</div>
      ) : (
        <div className="space-y-3">
          {(!filtered || filtered.length === 0) && <p className="text-muted-foreground text-center py-8">ไม่มีคำสั่งซื้อ</p>}
          {filtered?.map((order) => (
            <OrderRow key={order.id} order={order} onUpdateStatus={(id, status) => updateStatus.mutate({ id, status: status as any })} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
          <Link href="/"><Button variant="outline">กลับหน้าแรก</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-semibold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">จัดการร้านค้าของคุณ</p>
        </div>
        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products" className="gap-2"><Package className="h-4 w-4" />สินค้า</TabsTrigger>
            <TabsTrigger value="categories" className="gap-2"><Tag className="h-4 w-4" />หมวดหมู่</TabsTrigger>
            <TabsTrigger value="orders" className="gap-2"><ShoppingBag className="h-4 w-4" />คำสั่งซื้อ</TabsTrigger>
          </TabsList>
          <TabsContent value="products"><ProductsTab /></TabsContent>
          <TabsContent value="categories"><CategoriesTab /></TabsContent>
          <TabsContent value="orders"><OrdersTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
