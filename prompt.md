
# Project Title

A brief description of what this project does and who it's for


## Acknowledgements

 - [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
 - [Awesome README](https://github.com/matiassingers/awesome-readme)
 - [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)


## Appendix

Any additional information goes here

## Color Reference

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Example Color | ![#0a192f](https://dummyimage.com/10/0a192f/white?text=+) #0a192f |
| Example Color | ![#f8f8f8](https://dummyimage.com/10/f8f8f8/white?text=+) #f8f8f8 |
| Example Color | ![#00b48a](https://dummyimage.com/10/00b48a/white?text=+) #00b48a |
| Example Color | ![#00d1a0](https://dummyimage.com/10/00d1a0/white?text=+)) #00d1a0 |


## FAQ

#### Question 1

Answer 1

#### Question 2

Answer 2


## Deployment

To deploy this project run

```bash
  npm run deploy
```


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://katherineoelsner.com/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/)


## Feedback

If you have any feedback, please reach out to us at fake@fake.com


## 🚀 About Me
I'm a full stack developer...


## Roadmap

- Additional browser support

- Add more integrations


## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Screenshots

![App Screenshot](https://dummyimage.com/468x300?text=App+Screenshot+Here)


## Usage/Examples

```javascript
import Component from 'my-project'

function App() {
  return <Component />
}
```


## Used By

This project is used by the following companies:

- Company 1
- Company 2


## Support

For support, email fake@fake.com or join our Slack channel.


## Running Tests

To run tests, run the following command

```bash
  npm run test
```


## Related

Here are some related projects

[Awesome README](https://github.com/matiassingers/awesome-readme)


## Installation

Install my-project with npm

```bash
  npm install my-project
  cd my-project
```
    
## Features

ในฐานะที่คุณเป็นนักออกแบบpromptมืออาชีพ คุณต้องเข้าใจงานดังนี้ก่อน ผมจะทำโครงงานในหัวข้อ Mission green plate โดยรายละเอียดของงานนี้คือ ทำตู้ไว้สแกนจานที่นักเรียนนำมาตรวจว่ากินหมดหรือไม่ จากนั้นตู้จะต้องส่งข้อมูลการบวกลบแต้มที่ได้จากการกินหมดและไม่หมดให้กับระบบบัญชีในเว็ปแอปของแต่ละบุคคลเก็บบันทึกไว้ และที่เว็บแอปของบัญชีนักเรียนจะสามารถเข้ามาดูประวัติส่วนตัวของตัวเองได้ มีleaderboard แบบรายบุคคล รายห้อง รายชั้น มีสถิติการเล่นเกมส่วนตัว มีประวัติการได้แต้มและรายละเอียดเพิ่มเติม มีกล่องแสดงความคิดเห็นไปหาครูได้ว่าชอบอะไร อยากเสนออะไรในเรื่องอาหาร  ## 1. System Logic & Hardware Integration (หน้าตู้และระบบเบื้องหลัง)

ระบบมีตรรกะการทำงานร่วมกับฮาร์ดแวร์ (IoT) ดังนี้:

1. นักเรียน/ครู สแกนการ์ดหรืออุปกรณ์ NFC ที่เครื่องสแกน RFID (MFRC522 หรือเทียบเท่า)

2. ข้อมูล UID จากการสแกนจะถูกส่งไปยัง Raspberry Pi

3. Raspberry Pi ค้นหาและระบุตัวตน (Authentication) จากนั้นส่งคำสั่งเปิดใช้งานกล้อง (Camera Module)

4. กล้องทำการบันทึกภาพ/วิดีโอและใช้ระบบ AI Object Detection/Image Processing เพื่อตรวจจับ "การกินเหลือ" (Food Waste Detection)

5. เมื่อกล้องประมวลผลเสร็จสิ้น จะส่งผลลัพธ์ (กินหมด = True / กินไม่หมด = False) กลับมายัง Raspberry Pi

6. Raspberry Pi ทำการอัปเดตสถานะขึ้นฐานข้อมูลหลักของ Web App ผ่าน API (POST /api/meal-records)

7. ระบบ Web App ฝั่งหน้าจอตู้จะแสดงผลทันที:

   - **กรณีที่ 1 (กินหมด):** แสดงหน้าจอเตือน "เก่งมาก เตรียมพร้อมสู้กับมอนสเตอร์ได้เลย" (พร้อมบวกคะแนนในระบบ)

   - **กรณีที่ 2 (กินไม่หมด):** แสดงหน้าจอเตือน "กินไม่หมด อดเล่นเกม" และจบบันทึกของวันนั้น(พร้อมลบคะแนนในระบบ)## 2. Web Application User Flows & UI Requirements



### [FLOW 1] IF: เป็นครู (Teacher Role)

1. **หน้าเข้าสู่ระบบ (Login Page):** ช่องสำหรับกรอก "รหัสประจำตัวครู" และ "password"

2. **หน้าประวัติส่วนบุคคล (Teacher Dashboard):**

   - แสดงข้อมูลส่วนตัว: ชื่อ-นามสกุล, รูปโปรไฟล์

   - แท็บเมนู (Tab): "ห้องเรียนที่ประจำชั้น"

3. **หน้ารายชื่อนักเรียน (Classroom Roster Page):** (เข้าถึงเมื่อคลิกแท็บห้องประจำชั้น)

   - แสดงผลในรูปแบบ "รายชื่อนักเรียน" (Table/List View)

   - มีช่อง Checkbox/Indicator แสดงสถานะรายวันแบบ Real-time ว่านักเรียนคนไหน "กินข้าวหมด" หรือ "กินไม่หมด"

4. **ฟังก์ชันการค้นหาแบบละเอียด (Search History Function):**

   - มีช่อง Search สามารถพิมพ์ค้นหาด้วย "เลขประจำตัวนักเรียน" หรือ "ชื่อนักเรียน"

   - ผลลัพธ์การค้นหาจะแสดงประวัติย้อนหลังของเด็กคนนั้นๆ เรียงลำดับตามวัน (Historical Timeline) โดยระบุข้อมูล: [วันที่] | [เมนูอาหารที่กิน] | [สถานะ: กินหมด หรือ กินไม่หมด]



### [FLOW 2] ELSEIF: เป็นนักเรียน (Student Role)

1. **หน้าเข้าสู่ระบบ (Login Page):** ช่องสำหรับกรอก "เลขประจำตัวนักเรียน" และ "password"

2. **หน้าหลักนักเรียน (Student Dashboard) ประกอบด้วย 4 ส่วนหลัก:**

   - ประวัติส่วนนักเรียนว่า ชื่อนามสกุล ชื่อเล่น ห้อง ครูประจำชั้น  

   - Leaderboard (ตารางอันดับ):** แสดงอันดับคะแนนรวมของรายบุคคล รายห้อง รายชั้นในเกม เรียงลำดับจากบนลงล่าง (คะแนนมากที่สุดอยู่บนสุด) แสดงชื่อและจำนวนที่ฆ่ามอนสเตอร์ และ แต้มที่เคยเก็บได้ทั้งหมดตั้งแต่มีบัญชี

   -  Gamification และ สถิติการเล่นเกมส่วนตัว (Game Progress):** เกมฆ่ามอนสเตอร์อิงรูปแบบตามรูปที่แนบให้ แนวเกมคือการนำแต้มมาแลกพลังไปต่อสู้กับมอนสเตอร์ 10แต้มเป็นพลังฟาดมอนสเตอร์ค่าพลัง500ดาเมจ 20แต้มเป็นพลังไฟฟ้าช็อตมอนสเตอร์ ค่าพลังสูงขึ้นเป็น1200ดาเมจ 40แต้มเป็นพลังติดพิษ10วิ ค่าพลังสูงขึ้นเป็นวิละ250ดาเมจ ศัตรูเป็นตัวละครขยะอาหารหน้าตาน่าเกลียดดูน่าหมั่นไส้ มีทั้งหมด10 แบบ เมื่อตัวละครแบบแรกตายต้องไปเจอตัวละครแบบ2ต่อ วนลูปไปจนครบ10ตัวจึงขึ้นตัวละครแบบ1ใหม่ ซึ่งHPของแต่ละด่านจะเพิ่มขึ้น HPเริ่มต้นคือ 2000ทีละ 1000 2000 3000 4000 สุ่มเพิ่มHPของแต่ละมอนสเตอร์ไป แสดงผลในรูปแบบแผนที่ด่านเกม (Level/Stage Map) ว่าปัจจุบันผู้เล่นเดินทางไปถึงด่านไหนแล้ว และมีแต้มเท่าไหร่แล้ว

   -  ประวัติการกินข้าว (Meal History):** ตารางหรือการ์ดแสดงรายการอาหารที่เคยรับประทานย้อนหลังในแต่ละวัน โดยระบุ: [วันที่] | [ชื่อเมนูอาหาร] | [สถานะ: กินหมด / กินไม่หมด]และมีกล่องแสดงความคิดเห็น (Daily Food Comment Form):** แบบฟอร์มสำหรับเสนอแนะอาหารรายวัน มีช่องสำหรับกรอกข้อมูล: "วันนี้อยากกินอะไรเป็นพิเศษไหม", "อยากได้อะไรเพิ่มหรือปรับปรุงตรงไหนบ้าง" และปุ่ม Submit บันทึกเข้าฐานข้อมูล

