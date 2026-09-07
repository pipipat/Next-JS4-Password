import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyJWT(request) {
  try {
    // ดึงค่า token จาก HTTP-only Cookie
    const token = request.cookies.get("token")?.value;
    if (!token) return null;
    
    // ถอดรหัสและตรวจสอบความถูกต้องของ token
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null; // ถ้า token หมดอายุหรือไม่ถูกต้อง จะคืนค่า null
  }
}