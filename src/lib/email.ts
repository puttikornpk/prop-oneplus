import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendVerificationEmail(email: string, username: string, code: string) {
    const activationLink = `https://www.propertyplus.co.th/activate?user=${username}&code=${code}`;

    const mailOptions = {
        from: process.env.SMTP_FROM || '"PropertyPlus" <noreply@property-plus.com>',
        to: email,
        subject: 'ยินดีต้อนรับสู่ PropertyPlus - กรุณายืนยันบัญชีเพื่อเริ่มต้นใช้งาน (Welcome to PropertyPlus - Please verify your account)',
        text: `Welcome to PropertyPlus! Your verification code is: ${code}`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <h2 style="color: #20B486;">ยินดีต้อนรับสู่ PropertyPlus - กรุณายืนยันบัญชีเพื่อเริ่มต้นใช้งาน</h2>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                
                <p><strong>เนื้อหาอีเมล:</strong></p>
                <p>สวัสดีคุณ <strong>${username}</strong>,</p>
                
                <p>ยินดีต้อนรับสู่ครอบครัว PropertyPlus! การลงทะเบียนบัญชีสมาชิกของคุณเสร็จสมบูรณ์แล้ว คุณสามารถเข้าสู่ระบบเพื่อใช้งานฟีเจอร์ต่างๆ ได้ทันทีด้วยข้อมูลด้านล่างนี้</p>
                <p><em>Welcome to the PropertyPlus family! Your registration is now complete. You can log in and access our features immediately using the credentials below.</em></p>
                
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #20B486; margin-top: 0;">ข้อมูลบัญชีของคุณ (Your Account Details)</h3>
                    <p><strong>Username:</strong> ${username}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>รหัสยืนยันตัวตน (Activation Code):</strong> <span style="font-size: 18px; font-weight: bold; color: #20B486;">${code}</span></p>
                </div>

                <p>▼ <strong>คลิกที่ลิงก์ด้านล่างเพื่อเปิดใช้งานบัญชี (Click link below to activate)</strong><br>
                <a href="${activationLink}" style="color: #20B486; text-decoration: none;">${activationLink}</a></p>
                
                <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">

                <h3 style="color: #444;">เกี่ยวกับ PropertyPlus</h3>
                <p>PropertyPlus เป็นแพลตฟอร์มอสังหาริมทรัพย์ยุคใหม่ที่รวบรวมข้อมูลเชิงลึกและเทรนด์ตลาดที่น่าสนใจ เรามุ่งเน้นการนำเสนอรีวิวโครงการที่ตรงไปตรงมา พร้อมบทความวิเคราะห์การลงทุนที่เข้าใจง่าย เพื่อให้คุณตัดสินใจได้อย่างมั่นใจที่สุด นี่คือคอมมูนิตี้คุณภาพสำหรับคนรักอสังหาฯ อย่างแท้จริง</p>
                <p><em>PropertyPlus is a modern real estate platform that gathers deep insights and market trends. We focus on providing honest property reviews and easy-to-understand investment analyses to help you make decisions with confidence. This is the quality community for real estate enthusiasts.</em></p>

                <h3 style="color: #444;">โอกาสทางการขายที่มากกว่า</h3>
                <p>เราเป็นศูนย์กลางในการเชื่อมต่อ ประกาศขาย-เช่า บ้าน คอนโด และที่ดิน ที่มีระบบการค้นหาแม่นยำ ดึงดูดกลุ่มลูกค้าเป้าหมายที่มีคุณภาพ ช่วยให้ เจ้าของทรัพย์และเอเจนต์ สามารถปิดการขายได้รวดเร็วและมีประสิทธิภาพยิ่งขึ้น</p>
                <p><em>More Sales Opportunities: We are the hub connecting listings for Sale and Rent—Houses, Condos, and Land—with a precise search system. We attract quality target audiences, helping owners and agents close deals faster and more effectively.</em></p>

                <div style="background-color: #eefbf6; padding: 20px; border-radius: 8px; border-left: 5px solid #20B486; margin: 20px 0;">
                    <h3 style="color: #20B486; margin-top: 0;">อัตราค่าบริการและเครดิต (Service Rates & Credits)</h3>
                    <p>เพื่อให้การใช้งานเกิดประสิทธิภาพสูงสุด เรามีเงื่อนไขการใช้เครดิตดังนี้:</p>
                    <p><em>To ensure maximum efficiency, our credit usage terms are as follows:</em></p>
                    <ul style="list-style-type: none; padding: 0;">
                        <li>🔹 <strong>สร้างประกาศใหม่ (Create new listing):</strong> 50 เครดิต/ครั้ง</li>
                        <li>🔹 <strong>เลื่อนประกาศขึ้นอันดับแรก (Boost/Push listing):</strong> 10 เครดิต/ครั้ง</li>
                        <li>🔹 <strong>ต่ออายุประกาศ (Renew expired listing):</strong> 50 เครดิต/ครั้ง</li>
                    </ul>
                </div>

                <p><strong>บริการพิเศษ!</strong> หากคุณซื้อแพ็กเกจเครดิตกับเรา เรามีทีมงานมืออาชีพพร้อมดูแลและช่วยลงประกาศให้คุณถึง 3 รายการ เพียงส่งข้อมูลผ่าน LINE Official ของเรา เราจัดการให้พร้อมส่งให้คุณตรวจสอบก่อนออนไลน์เสมอ</p>
                <p><em>Exclusive Service! If you purchase a credit package, our professional team is ready to assist by posting up to 3 listings for you. Simply send the details via our LINE Official, and we will handle the rest, ensuring you review everything before it goes live.</em></p>

                 <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; border: 1px solid #ffeeba; margin: 20px 0;">
                    <h2 style="color: #856404; margin-top: 0;">🎉 รับฟรีทันที 50 เครดิต! (Get 50 Free Credits)</h2>
                    <p>เพียงคุณยืนยันตัวตนให้ครบ 3 ขั้นตอนง่ายๆ เพื่อสร้างความน่าเชื่อถือให้กับบัญชีของคุณ</p>
                    <p><em>Simply complete these 3 easy verification steps to build trust for your account.</em></p>
                    <ol>
                        <li><strong>ยืนยันอีเมล (Verify Email):</strong> คลิกปุ่มยืนยันในหน้ารายละเอียดส่วนตัว หรือใช้โค้ดด้านบน</li>
                        <li><strong>ยืนยันเบอร์โทรศัพท์ (Verify Phone Number):</strong> กดปุ่มยืนยันเบอร์โทรศัพท์ในระบบ <a href="https://www.propertyplus.co.th/member/edit_profile">https://www.propertyplus.co.th/member/edit_profile</a></li>
                        <li><strong>ยืนยันบัตรประชาชน/พาสปอร์ต (Verify ID Card/Passport):</strong> เพื่อยกระดับความปลอดภัย <a href="https://www.propertyplus.co.th/member/edit_profile">https://www.propertyplus.co.th/member/edit_profile</a></li>
                    </ol>
                </div>

                <p style="font-size: 0.9em; color: #666; border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px;">
                    หากมีข้อสงสัยหรือต้องการความช่วยเหลือ ติดต่อเราได้ที่:<br>
                    <strong>Tel:</strong> 02-XXX-XXXX<br>
                    <strong>Line ID:</strong> @propertyplus<br>
                    ทีมงานแอดมินยินดีให้บริการและให้คำปรึกษาตลอดเวลาทำการครับ<br><br>
                    <em>If you have any questions or need assistance, please contact us at:<br>
                    Tel: (+66) 02-XXX-XXXX<br>
                    Line ID: @propertyplus<br>
                    Our admin team is ready to assist and consult you during business hours.</em>
                </p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}
