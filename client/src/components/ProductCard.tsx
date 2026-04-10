import { Link } from "wouter";
import { ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  stock: number;
  categoryName: string | null;
  isFeatured: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const addToCart = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      utils.cart.get.invalidate();
      toast.success(`เพิ่ม "${product.name}" ลงตะกร้าแล้ว`);
    },
    onError: () => {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    addToCart.mutate({ productId: product.id, quantity: 1 });
  };

  const isOutOfStock = product.stock === 0;

  return (
    <Link href={`/products/${product.id}`} className="no-underline group">
      <div className="bg-card rounded-2xl overflow-hidden border border-border/60 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square bg-secondary overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
          {product.isFeatured && (
            <span className="badge-gold absolute top-3 left-3 text-xs font-medium rounded-full px-2.5 py-0.5">
              แนะนำ
            </span>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground">สินค้าหมด</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {product.categoryName && (
            <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {product.categoryName}
            </span>
          )}
          <h3 className="font-serif font-medium text-foreground mb-1 line-clamp-2 leading-snug">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between mt-auto pt-2">
            <span className="text-lg font-semibold text-foreground">
              ฿{parseFloat(product.price).toLocaleString("th-TH", { minimumFractionDigits: 0 })}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={handleAddToCart}
              disabled={isOutOfStock || addToCart.isPending}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {addToCart.isPending ? "..." : "เพิ่ม"}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
