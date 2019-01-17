### ขั้นตอนการทำงานฝัง server side

> วิธีนำ access token จาก gmail มาใช้งาน

- เข้าไปที่ไฟล์ index.js เพื่อเปิด comment code 

```
 _gmail.run();
```

- เข้าไปที่ไฟล์ index.js เพื่อ comment code

```
 if (req.body.code) {
        const gr = new gmail();
        gr.then(detail => {
            new work(req, res, detail);
        }).catch(err => {
            res.json({
                success: false,
                msg: 'can not get gmail ! : ' + err
            });
        });
    } else {
        res.json({
            success: false,
            msg: 'no code!'
        });
    }
```

- จากนั้นก็รัน serve แล้วนำ url ที่ได้จาก console ไปเปิดในเบราเซอร์ แล้ว copy ข้อมูลในฟิลด์ code มาใส่ใน console แล้วกด enter เพื่อรับ token มาใส่ในไฟล์ access_token.json (*ถ้า token expire ให้ลบไฟล์นี้ออกก่อน)

- หลังจากนั้นก็ปรับโค๊ดที่เรา comment ไปให้กลับมาเป็นปกติเพื่อทดสอบการรับ email ล่าสุดจาก gmail แล้วส่งต่อไปยัง LINE


