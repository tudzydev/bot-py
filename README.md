# W3Schools Python Auto-Learner Bot (บอทเรียน Python อัตโนมัติใน W3Schools)

English version below.

---

## ภาษาไทย 🇹🇭

บอทนี้สร้างขึ้นด้วยภาษา Python และไลบรารี Playwright เพื่อทำการเปิดอ่านหน้าบทเรียน Python ทั้งหมดใน W3Schools แบบอัตโนมัติ ซึ่งจะช่วยให้เปอร์เซ็นต์ความคืบหน้าการเรียน (Progress Percentage) ของบัญชีคุณเต็ม 100%

### วิธีการใช้งาน
1. **ติดตั้งสิทธิ์การใช้งาน (ถ้ายังไม่มี)**:
   เปิด Terminal ในโฟลเดอร์นี้ แล้วรันคำสั่ง:
   ```bash
   pip3 install playwright
   playwright install chromium
   ```
   *(ขณะนี้กำลังทำการติดตั้งในระบบให้คุณโดยอัตโนมัติ)*

2. **เริ่มรันบอท**:
   รันคำสั่งนี้ใน Terminal เพื่อเริ่มทำงาน:
   ```bash
   python3 w3_auto_learner.py
   ```

3. **ขั้นตอนการทำงานของบอท**:
   - บอทจะเปิดหน้าต่างเบราว์เซอร์ Brave ขึ้นมาที่หน้า Login ของ W3Schools (และจะใช้ Chromium เป็นตัวสำรองหากหาไม่พบ)
   - **กรุณาเข้าสู่ระบบบัญชีของคุณ** (ผ่าน Google, GitHub หรือ อีเมล) ในเบราว์เซอร์ที่เปิดขึ้นมานั้น
   - เมื่อเข้าสู่ระบบเรียบร้อยและอยู่ในหน้า Dashboard แล้ว ให้กลับมาที่หน้าต่าง Terminal/Command Prompt
   - **กดปุ่ม [ENTER]** ใน Terminal เพื่อให้บอทเริ่มทำการเลื่อนอ่านหน้าบทเรียน
   - บอทจะทำการวิ่งเปิดหน้าถัดไปเรื่อยๆ โดยจะจำลองการเลื่อนลงไปอ่านด้านล่างเพื่ออัปเดตสถิติการอ่าน และคลิก "Next" ไปเรื่อยๆ จนจบหลักสูตร Python

---

## English 🇺🇸

This bot is written in Python using Playwright. It automates browsing the entire Python tutorial track on W3Schools to mark all pages as read, achieving a 100% course completion percentage on your account.

### How to Use
1. **Install Dependencies**:
   Open a terminal in this workspace and run:
   ```bash
   pip3 install playwright
   python3 -m playwright install chromium
   ```

2. **Execute the Bot**:
   Run the automation script:
   ```bash
   python3 w3_auto_learner.py
   ```

3. **Automation Workflow**:
   - A Brave browser window will open at the W3Schools Login page (falling back to Chromium if Brave is not installed).
   - **Log in to your W3Schools account** in the opened browser window (via Google, GitHub, or Email).
   - Once logged in, go back to your terminal window.
   - **Press [ENTER]** in the terminal to start the automated learning sequence.
   - The bot will visit each Python topic, simulate human reading by scrolling, and click the "Next" button until the course is fully completed.
