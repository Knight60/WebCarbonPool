// test-vertex.js
import { VertexAI } from '@google-cloud/vertexai';

// --- ตั้งค่าเหมือนเดิมทุกประการ ---
const PROJECT_ID = 'DCCE-Carbon';
const LOCATION = 'us-central1';
const KEY_FILE_PATH = 'D:/Project/WebCarbonPool/dcce-carbon-credential.json';
const API_ENDPOINT = 'us-central1-aiplatform.googleapis.com';

console.log('--- 🧪 เริ่มการทดสอบแบบ Minimal ---');
console.log('Project:', PROJECT_ID);
console.log('KeyFile:', KEY_FILE_PATH);
console.log('Endpoint:', API_ENDPOINT);

// บังคับทุกอย่างเหมือนเดิม
const vertex_ai = new VertexAI({
    project: PROJECT_ID,
    location: LOCATION,
    apiEndpoint: API_ENDPOINT,
    googleAuthOptions: {
        keyFile: KEY_FILE_PATH
    }
});

// ฟังก์ชันนี้จะทำสิ่งเดียวกับ 'gcloud ai models list'
async function testListModels() {
    try {
        console.log('กำลังเรียก ModelService...');

        // 1. รับ Client สำหรับบริการ Model (ModelService)
        const modelServiceClient = vertex_ai.getModelService();

        // 2. นี่คือการเรียก API ที่เทียบเท่ากับ 'gcloud ai models list'
        const [models] = await modelServiceClient.listModels({
            parent: `projects/${PROJECT_ID}/locations/${LOCATION}`,
        });

        console.log('--- ✅ SUCCESS! ---');
        console.log(`(Node.js) พบ ${models.length} โมเดล.`);
        console.log('การเชื่อมต่อ SDK กับ Vertex AI ใช้งานได้');

    } catch (error) {
        console.error('--- ❌ TEST FAILED ---');
        console.error('Error ที่เกิดขึ้น:', error.message);
        // พิมพ์รายละเอียด Error เพื่อดูว่ามันยังเรียก "ที่อยู่ B" หรือไม่
        console.error(JSON.stringify(error, null, 2));
    }
}

// 3. รันฟังก์ชันทดสอบ
testListModels();