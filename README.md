# ปฏิทินเข้างาน

แอปปฏิทินเข้างานปั๊มน้ำมัน อ่านไฟล์ Google Timeline ในเครื่อง

หน้านี้เป็นคำอธิบายใน GitHub เท่านั้น ไม่ใช่ตัวแอป ตัวแอปอยู่ที่ไฟล์ `index.html`

## เปิดเป็นเว็บสาธารณะ

1. อัปโหลดโปรเจกต์นี้ขึ้น GitHub แบบ public ให้ครบทั้งโฟลเดอร์ `docs` และไฟล์ `index.html`
2. ไปที่ Settings → Pages
3. ที่ Build and deployment เลือก **Deploy from a branch**
4. Branch เป็น `main` และ Folder เป็น **`/ (root)`**
5. กด Save แล้วรอสักครู่
6. เปิดลิงก์แบบนี้ `https://<ชื่อผู้ใช้>.github.io/<ชื่อคลัง>/`  
   อย่าเปิดหน้า `github.com/...` เพราะหน้านั้นคือ README

`index.html` จะพาไปที่แอปในโฟลเดอร์ `docs` ซึ่งมีไฟล์พร้อมใช้งานอยู่แล้ว ไม่ต้องรอ GitHub Actions
