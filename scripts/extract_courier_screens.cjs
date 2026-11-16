const fs = require('fs');
const path = require('path');

const baseDir = path.resolve('C:/Users/شخصي/.gemini/antigravity/brain/b9c18456-c979-48da-b9c7-24b2bd9877c2/.system_generated/steps');

const screens = [
  {
    num: 1,
    name: 'courier_dashboard',
    title: 'لوحة تحكم مندوب غيم سبيس - الشعار الحقيقي والبيانات المصفّرة',
    id: '00edce93567e410f922789221e2883cb',
    htmlStep: 16,
    imgStep: 20
  },
  {
    num: 2,
    name: 'courier_available_orders',
    title: 'غيم سبيس - الطلبات المتاحة',
    id: '270948eaad364cf3a86a1a995ebb1b70',
    htmlStep: 71,
    imgStep: 73
  },
  {
    num: 3,
    name: 'courier_deliveries_history',
    title: 'غيم سبيس - سجل التوصيلات',
    id: '7aed9f15edc64573bb981be1f6068399',
    htmlStep: 75,
    imgStep: 77
  },
  {
    num: 4,
    name: 'courier_profile',
    title: 'غيم سبيس - ملفي الشخصي وإدارة الحساب',
    id: '81fc2cf7ac2b4e65b87934c58f3d7168',
    htmlStep: 79,
    imgStep: 81
  }
];

const targetDir1 = path.resolve('stitch_screens');
const targetDir2 = path.resolve('stitch_screens/courier');

if (!fs.existsSync(targetDir2)) {
  fs.mkdirSync(targetDir2, { recursive: true });
}

for (const s of screens) {
  const htmlFile = path.join(baseDir, `${s.htmlStep}`, 'output.txt');
  const imgFile = path.join(baseDir, `${s.imgStep}`, 'output.txt');

  console.log(`Processing Screen ${s.num}: ${s.name}`);

  const htmlData = JSON.parse(fs.readFileSync(htmlFile, 'utf8'));
  const imgData = JSON.parse(fs.readFileSync(imgFile, 'utf8'));

  const htmlContent = htmlData.html;
  const imgBuffer = Buffer.from(imgData.image, 'base64');

  // Save to targetDir1 (e.g. 11_courier_dashboard...)
  const idx1 = 10 + s.num;
  fs.writeFileSync(path.join(targetDir1, `${idx1}_${s.name}.html`), htmlContent, 'utf8');
  fs.writeFileSync(path.join(targetDir1, `${idx1}_${s.name}.jpg`), imgBuffer);

  // Save to targetDir2 (courier/1_courier_dashboard...)
  fs.writeFileSync(path.join(targetDir2, `${s.num}_${s.name}.html`), htmlContent, 'utf8');
  fs.writeFileSync(path.join(targetDir2, `${s.num}_${s.name}.jpg`), imgBuffer);

  console.log(` Saved Screen ${s.num}: HTML size = ${htmlContent.length} bytes, Image size = ${imgBuffer.length} bytes`);
}

console.log('All screens processed successfully!');
