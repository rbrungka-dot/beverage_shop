import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  FlaskConical,
  PackageCheck,
  Truck,
  BadgeCheck,
  ChevronRight,
  Leaf,
  Droplets,
  Sparkles,
} from "lucide-react";

const inquirySchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อ"),
  company: z.string().optional(),
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  phone: z.string().optional(),
  productType: z.string().optional(),
  moq: z.string().optional(),
  message: z.string().min(10, "กรุณาอธิบายรายละเอียดอย่างน้อย 10 ตัวอักษร"),
});

type InquiryForm = z.infer<typeof inquirySchema>;

const steps = [
  {
    icon: FlaskConical,
    title: "R&D & สูตร",
    desc: "ทีมนักวิทยาศาสตร์พัฒนาสูตรตามความต้องการของคุณ ทดสอบความปลอดภัยและประสิทธิภาพ",
  },
  {
    icon: PackageCheck,
    title: "ผลิตและบรรจุ",
    desc: "ผลิตในโรงงานมาตรฐาน GMP พร้อมออกแบบบรรจุภัณฑ์ที่สะท้อนแบรนด์ของคุณ",
  },
  {
    icon: BadgeCheck,
    title: "QC & ขึ้นทะเบียน",
    desc: "ตรวจสอบคุณภาพทุกล็อต พร้อมดูแลการขึ้นทะเบียน อย. และเอกสารที่เกี่ยวข้อง",
  },
  {
    icon: Truck,
    title: "จัดส่ง",
    desc: "จัดส่งตรงถึงคลังสินค้าของคุณ พร้อม Certificate of Analysis ทุกล็อต",
  },
];

const productTypes = [
  { icon: Droplets, label: "เครื่องดื่มสมุนไพร", desc: "สูตรเฉพาะตัว ผสมสมุนไพรไทยและต่างประเทศ" },
  { icon: Sparkles, label: "Sparkling Beverage", desc: "เครื่องดื่มอัดแก๊ส 0% แอลกอฮอล์ รสชาติหลากหลาย" },
  { icon: Leaf, label: "Wellness Drink", desc: "เครื่องดื่มเพื่อสุขภาพ Functional Beverage" },
  { icon: FlaskConical, label: "สูตรพิเศษ", desc: "พัฒนาสูตรใหม่ตามความต้องการเฉพาะ" },
];

export default function Custom() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryForm>({ resolver: zodResolver(inquirySchema) });

  const submitMutation = trpc.inquiry.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      reset();
    },
    onError: (err) => {
      toast.error("เกิดข้อผิดพลาด: " + err.message);
    },
  });

  const onSubmit = (data: InquiryForm) => {
    submitMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Hero */}
      <section className="relative bg-[#1a1a1a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #c8a96e 0%, transparent 60%), radial-gradient(circle at 80% 20%, #8b6914 0%, transparent 50%)" }} />
        <div className="relative max-w-5xl mx-auto px-6 py-24">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            <FlaskConical className="w-4 h-4 text-[#c8a96e]" />
            <span className="text-[#c8a96e] font-medium">OEM / ODM Manufacturing</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            รับจ้างผลิต<br />
            <span className="text-[#c8a96e]">เครื่องดื่มแบรนด์ของคุณ</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mb-8">
            ผลิตเครื่องดื่มสุขภาพตามสูตรที่คุณต้องการ หรือให้ทีมของเราพัฒนาสูตรใหม่
            พร้อมบรรจุภัณฑ์ที่สะท้อนแบรนด์ของคุณอย่างครบวงจร
          </p>
          <div className="flex flex-wrap gap-6 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-[#c8a96e]" />
              <span>โรงงาน GMP มาตรฐาน</span>
            </div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-[#c8a96e]" />
              <span>MOQ ต่ำ เริ่มต้นได้ง่าย</span>
            </div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-[#c8a96e]" />
              <span>ดูแลครบจบในที่เดียว</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Types */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">ประเภทสินค้าที่รับผลิต</h2>
        <p className="text-[#666] mb-8">เลือกประเภทสินค้าที่ตรงกับแนวคิดของคุณ หรือแจ้งความต้องการพิเศษในฟอร์มด้านล่าง</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {productTypes.map(({ icon: Icon, label, desc }) => (
            <Card key={label} className="border border-[#e8e0d0] bg-white hover:border-[#c8a96e] transition-colors">
              <CardContent className="p-5">
                <div className="w-10 h-10 rounded-full bg-[#faf3e8] flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-[#c8a96e]" />
                </div>
                <h3 className="font-semibold text-[#1a1a1a] mb-1">{label}</h3>
                <p className="text-sm text-[#888]">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Process Steps */}
      <section className="bg-white border-y border-[#e8e0d0]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">ขั้นตอนการผลิต</h2>
          <p className="text-[#666] mb-10">กระบวนการที่โปร่งใสและมีมาตรฐาน ตั้งแต่ต้นจนจบ</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="relative">
                <div className="flex items-start gap-4 md:flex-col md:gap-3">
                  <div className="flex items-center gap-3 md:gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {i + 1}
                    </div>
                    {i < steps.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-[#c8a96e] hidden md:block" />
                    )}
                  </div>
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-[#faf3e8] flex items-center justify-center mb-2 hidden md:flex">
                      <Icon className="w-4 h-4 text-[#c8a96e]" />
                    </div>
                    <h3 className="font-semibold text-[#1a1a1a] mb-1">{title}</h3>
                    <p className="text-sm text-[#888] leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">ขอใบเสนอราคา</h2>
          <p className="text-[#666]">กรอกข้อมูลเบื้องต้น ทีมงานจะติดต่อกลับภายใน 1-2 วันทำการ</p>
        </div>

        {submitted ? (
          <Card className="border border-[#c8a96e] bg-[#faf3e8]">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#c8a96e] flex items-center justify-center mx-auto mb-4">
                <BadgeCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">ส่งข้อมูลสำเร็จ!</h3>
              <p className="text-[#666] mb-6">ทีมงานได้รับข้อมูลของคุณแล้ว จะติดต่อกลับภายใน 1-2 วันทำการ</p>
              <Button
                variant="outline"
                className="border-[#c8a96e] text-[#c8a96e] hover:bg-[#c8a96e] hover:text-white"
                onClick={() => setSubmitted(false)}
              >
                ส่งใบสอบถามใหม่
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-[#e8e0d0] bg-white shadow-sm">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">ชื่อ-นามสกุล <span className="text-red-500">*</span></Label>
                    <Input id="name" placeholder="กรอกชื่อของคุณ" {...register("name")} />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="company">ชื่อบริษัท / แบรนด์</Label>
                    <Input id="company" placeholder="ชื่อบริษัทหรือแบรนด์ (ถ้ามี)" {...register("company")} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">อีเมล <span className="text-red-500">*</span></Label>
                    <Input id="email" type="email" placeholder="your@email.com" {...register("email")} />
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                    <Input id="phone" placeholder="08x-xxx-xxxx" {...register("phone")} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="productType">ประเภทสินค้าที่ต้องการ</Label>
                    <Input id="productType" placeholder="เช่น เครื่องดื่มสมุนไพร, Sparkling" {...register("productType")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="moq">ปริมาณที่ต้องการ (MOQ)</Label>
                    <Input id="moq" placeholder="เช่น 500 ขวด, 1,000 กล่อง" {...register("moq")} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message">รายละเอียดเพิ่มเติม <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="message"
                    placeholder="อธิบายสินค้าที่ต้องการ เช่น รสชาติ ส่วนผสม บรรจุภัณฑ์ หรือความต้องการพิเศษอื่นๆ"
                    rows={4}
                    {...register("message")}
                  />
                  {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#1a1a1a] hover:bg-[#333] text-white py-3"
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? "กำลังส่ง..." : "ส่งใบสอบถาม"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
