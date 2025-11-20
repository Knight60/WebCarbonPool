// VertexAiTaxonomy.js (ฉบับ Vertex AI)
import express from 'express';
import multer from 'multer';
import { VertexAI } from '@google-cloud/vertexai';
import cors from 'cors'; // ❗️ Import cors

// --- 1. การตั้งค่า Express และ Multer ---
const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ storage: multer.memoryStorage() });

// --- ❗️❗️ เปิดใช้งาน CORS ---
// This is critical so your React app (running on a different port) 
// can call this server.
app.use(cors());
// -----------------------------

// --- 2. การตั้งค่า Vertex AI Client ---
const PROJECT_ID = 'dcce-carbon'; // 👈 ❗️❗️ ใส่ ID โปรเจกต์ที่ถูกต้อง
const LOCATION = 'us-central1';
const model = 'gemini-2.5-flash'; // 👈 เปลี่ยนแค่บรรทัดนี้

// --- ❗️❗️ ส่วนที่แก้ไข ❗️❗️ ---
// บอกให้โค้ดหาไฟล์ Key จาก Path ที่เรากำหนดโดยตรง
const KEY_FILE_PATH = 'dcce-carbon-credential.json'; // 👈 ❗️❗️ ชื่อไฟล์ Key
// ------------------------------------

// Initialize VertexAI
const vertex_ai = new VertexAI({
    project: PROJECT_ID,
    location: LOCATION,
    // ❗️❗️ เพิ่มส่วนนี้เข้าไป ❗️❗️
    googleAuthOptions: {
        keyFile: KEY_FILE_PATH
            // ถ้าคุณไม่ได้ย้ายไฟล์มา ให้ใส่ Path เต็ม เช่น
            // keyFile: 'D:/Keys/dcce-carbon-00bd6aa74b85.json' (ใช้ / หรือ \\)
    }
});

// --- 3. สร้าง API Route (/predict-gemini) ---
app.post('/predict-gemini', upload.single('image'), async(req, res) => {
    if (!req.file) {
        return res.status(400).send('No image file uploaded.');
    }

    try {
        const imageBuffer = req.file.buffer;
        const imageBase64 = imageBuffer.toString('base64');
        const imagePart = {
            inlineData: {
                mimeType: req.file.mimetype,
                data: imageBase64,
            },
        };
        const textPart = {
            text: 'นี่คือต้นไม้อะไร? กรุณาระบุชื่อสายพันธุ์ (species) ถ้าเป็นไปได้',
        };
        const request = {
            contents: [{
                role: 'user',
                parts: [textPart, imagePart]
            }],
        };

        // 4. เรียกใช้ Gemini Model
        console.log('Sending request to Vertex AI...');
        const generativeModel = vertex_ai.getGenerativeModel({
            model: model,
        });

        const result = await generativeModel.generateContent(request);

        // 5. ดึงคำตอบที่เป็น Text ออกมา
        const responseText = result.response.candidates[0].content.parts[0].text;
        console.log('Got response from Gemini:', responseText);

        res.json({
            message: 'Prediction successful',
            treeName: responseText,
        });

    } catch (error) {
        console.error('Error calling Gemini:', error);
        res.status(500).send('Error during prediction');
    }
});

// --- 4. สตาร์ทเซิร์ฟเวอร์ ---
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});