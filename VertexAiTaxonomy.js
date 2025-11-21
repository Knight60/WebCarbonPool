// VertexAiTaxonomy.js (Fixed JSON Parsing & Error Handling)
import express from 'express';
import multer from 'multer';
import { VertexAI } from '@google-cloud/vertexai';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

// --- 1. Configuration ---
const app = express();
const port = process.env.PORT || 8888;

const UPLOAD_BASE_FOLDER = 'D:/AiGreenTaxonomy/Predicted/';
// const UPLOAD_BASE_FOLDER = './Predicted/'; // สำหรับเทสเครื่องที่ไม่มี Drive D

const PROJECT_ID = 'dcce-carbon';
const LOCATION = 'us-central1';
const MODEL_NAME = 'gemini-2.5-flash';
const KEY_FILE_PATH = 'dcce-carbon-credential.json';

const vertex_ai = new VertexAI({
    project: PROJECT_ID,
    location: LOCATION,
    googleAuthOptions: { keyFile: KEY_FILE_PATH }
});

const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json({ limit: '50mb' })); // เพิ่ม limit เผื่อรูปใหญ่
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// --- 2. Species Data ---
const supportedSpecies = [
    { common: "(1) แสมขาว", scientific: "Avicennia alba Blume" },
    { common: "(2) อโศกอินเดีย", scientific: "Monoon longifolium (Sonn.) B.Xue & R.M.K.Saunders" },
    // ... (ละไว้เพื่อให้โค้ดสั้นลง ใส่รายชื่อเดิม 60 ชนิดตรงนี้) ...
    { common: "(60) พิกุล", scientific: "Mimusops elengi L." },
];

// --- Prompt (ปรับให้กระชับขึ้น) ---
const getSpeciesPrompt = () => {
    const listText = supportedSpecies.map(s => `- ${s.scientific}`).join('\n');
    return `
    Role: Expert Botanist.
    Task: Identify the plant in the image.

    Rules:
    1. If the image is NOT a plant/tree/leaf/bark (e.g., car, person, building, blank), return exactly: [["NOT_A_PLANT", 1.0]]
    2. If it IS a plant, identify it from this list ONLY:
    ${listText}
    
    3. Output format: Strict JSON Array only. NO Markdown. NO code blocks.
    Example: [["Tectona grandis L.f.", 0.95], ["Xylia xylocarpa", 0.05]]
    `;
};

// --- 3. Helper Functions ---

function handleToken(token) {
    if (!token || token.toLowerCase() === 'new' || token.toLowerCase() === 'null' || token === '') {
        return new Date().toISOString().replace(/:/g, '.');
    }
    return token;
}

// ❗️ Helper ใหม่: ทำความสะอาด JSON จาก Gemini
function cleanAndParseJSON(text) {
    // 1. ลบ Markdown code blocks (```json ... ```)
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // 2. หาจุดเริ่มต้น [ และจุดสิ้นสุด ] เพื่อตัดส่วนเกินหัวท้าย
    const firstBracket = cleanText.indexOf('[');
    const lastBracket = cleanText.lastIndexOf(']');
    
    if (firstBracket !== -1 && lastBracket !== -1) {
        cleanText = cleanText.substring(firstBracket, lastBracket + 1);
    }

    try {
        return JSON.parse(cleanText);
    } catch (e) {
        console.error("Raw text from Gemini:", text); // Log ของจริงออกมาดู
        console.error("Cleaned text:", cleanText);
        throw new Error("Failed to parse JSON from Gemini response: " + e.message);
    }
}

function calculateOverall(tokenPath, filename, currentPredicted) {
    const overallFile = path.join(tokenPath, 'overall.json');
    let overallResults = {};

    if (fs.existsSync(overallFile)) {
        try {
            overallResults = JSON.parse(fs.readFileSync(overallFile, 'utf8'));
        } catch (e) { overallResults = {}; }
    }

    overallResults[filename] = currentPredicted;
    fs.writeFileSync(overallFile, JSON.stringify(overallResults, null, 2));

    const allPredictions = Object.values(overallResults).flat(); 
    const speciesStats = {};
    let validCount = 0;

    // นับจำนวนรูป (ไม่รวมรูปที่ไม่ใช่ต้นไม้)
    const uniqueFiles = Object.keys(overallResults);
    
    allPredictions.forEach(([species, score]) => {
        // ❗️ กรอง NOT_A_PLANT ออก
        if (species !== 'NOT_A_PLANT') {
            const numScore = parseFloat(score);
            if (!speciesStats[species]) speciesStats[species] = 0;
            speciesStats[species] += numScore;
        }
    });
    
    // ใช้จำนวนรูปทั้งหมดหาร
    const totalImages = uniqueFiles.length;

    const averagedResults = Object.entries(speciesStats).map(([species, totalScore]) => {
        return [species, totalScore / totalImages];
    });

    averagedResults.sort((a, b) => b[1] - a[1]);
    return { overall: averagedResults.slice(0, 3), count: totalImages };
}

// --- 4. Route ---
app.post('/ai/taxonomy/:token', upload.single('image'), async (req, res) => {
    let finalToken = handleToken(req.params.token);
    const tokenPath = path.join(UPLOAD_BASE_FOLDER, finalToken);
    
    if (!fs.existsSync(tokenPath)) fs.mkdirSync(tokenPath, { recursive: true });

    let imageType = req.body.type || "bark";
    let formFile = "";
    let imageBuffer = null;
    let mimeType = "image/jpeg";

    try {
        // --- ตรวจสอบไฟล์ ---
        if (req.file) {
            const saveName = `${imageType}@${req.file.originalname}`;
            formFile = path.join(tokenPath, saveName);
            imageBuffer = req.file.buffer;
            mimeType = req.file.mimetype;
            fs.writeFileSync(formFile, imageBuffer);
        } else if (req.body.image) {
             const base64Data = req.body.image;
             // ตรวจสอบ Base64 Pattern
             const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
             if (matches) {
                 mimeType = matches[1];
                 imageBuffer = Buffer.from(matches[2], 'base64');
                 const ext = mimeType.split('/')[1];
                 formFile = path.join(tokenPath, `${imageType}@image.${ext}`);
                 fs.writeFileSync(formFile, imageBuffer);
             }
        }

        // ❗️ แก้ Error: No image content (ให้แจ้งเตือนชัดเจนแทนการ Crash)
        if (!imageBuffer) {
            return res.status(400).json({ 
                error: "No image content received", 
                details: "Please upload a file using form-data 'image' field or send base64 string."
            });
        }

        // Call Gemini
        const generativeModel = vertex_ai.getGenerativeModel({
            model: MODEL_NAME,
        });

        const promptRequest = {
            contents: [{
                role: 'user',
                parts: [
                    { text: getSpeciesPrompt() }, 
                    { inlineData: { mimeType: mimeType, data: imageBuffer.toString('base64') } }
                ]
            }]
        };

        const result = await generativeModel.generateContent(promptRequest);
        const responseText = result.response.candidates[0].content.parts[0].text;
        
        console.log("Gemini Raw Response:", responseText); // Debug ดูค่าที่ส่งกลับมา

        // ❗️ ใช้ฟังก์ชันทำความสะอาด JSON ที่สร้างใหม่
        let predictedData = cleanAndParseJSON(responseText);

        // --- Check if NOT_A_PLANT ---
        if (predictedData.length > 0 && predictedData[0][0] === "NOT_A_PLANT") {
            // ลบไฟล์ทิ้งถ้าไม่ใช่ต้นไม้ (Optional)
            // if (fs.existsSync(formFile)) fs.unlinkSync(formFile);

            return res.status(200).json({
                error: "ไม่ใช่รูปของต้นไม้",
                details: "ระบบตรวจพบว่าภาพที่อัปโหลดไม่ใช่วัตถุที่เกี่ยวข้องกับพืช",
                token: finalToken,
                predicted: [],
                overall: []
            });
        }

        const relativeFilename = path.basename(formFile);
        const { overall, count } = calculateOverall(tokenPath, relativeFilename, predictedData);
        const formatScore = (list) => list.map(item => [item[0], parseFloat(item[1]).toFixed(2)]);

        res.json({
            filename: relativeFilename,
            token: finalToken,
            source: `data:${mimeType};base64,${imageBuffer.toString('base64').substring(0, 30)}...`,
            predicted: formatScore(predictedData),
            overall: formatScore(overall),
            count: count
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ 
            error: error.message,
            stack: error.stack 
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});