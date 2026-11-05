export interface Product {
  id: number;
  name: string;
  price: number;
  // และคุณสมบัติอื่นๆ ของสินค้าตามโปรเจกต์ของคุณ
}

export async function fetchProducts(): Promise<Product[]> {
  // ตัวอย่างโค้ดดึงข้อมูลสินค้า (หรือ return ข้อมูลจำลอง array ของสินค้า)
  return [];
}