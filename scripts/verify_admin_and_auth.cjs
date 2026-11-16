const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function startServer(port) {
  const rootDir = path.join(__dirname, '..');
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
  };

  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/') reqPath = '/ghaym_space.html';
    const filePath = path.join(rootDir, reqPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`Local test server running on http://127.0.0.1:${port}`);
      resolve(server);
    });
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) cb.reject(new Error(msg.error.message));
          else cb.resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const callId = this.id++;
      this.callbacks.set(callId, { resolve, reject });
      this.ws.send(JSON.stringify({ id: callId, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function main() {
  const port = 8094;
  const server = await startServer(port);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\Public\\chrome_admin_profile';

  console.log('Launching headless Chrome for Admin Dashboard Verification...');
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9227',
    '--no-sandbox',
    '--disable-gpu',
    `--user-data-dir=${userDataDir}`,
    '--window-size=1440,900',
  ]);

  await new Promise((r) => setTimeout(r, 1500));

  try {
    const jsonRes = await fetch('http://127.0.0.1:9227/json');
    const tabs = await jsonRes.json();
    const wsUrl = tabs[0].webSocketDebuggerUrl;
    console.log('Connected to Chrome DevTools Protocol via WebSocket.');

    const cdp = new CDPClient(wsUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('DOM.enable');

    console.log('\n========================================================');
    console.log('TEST 1: VERIFYING ADMIN DASHBOARD ON DESKTOP (1440px)');
    console.log('========================================================');

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/ghaym_space.html#/admin?demo=admin` });
    await new Promise((r) => setTimeout(r, 2000));

    const adminEval = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const bodyText = document.body.innerText;
          return {
            hasOverviewTab: bodyText.includes('الرئيسية (لوحة المؤشرات)'),
            hasMerchantsTab: bodyText.includes('إدارة التجار'),
            hasCouriersTab: bodyText.includes('إدارة المندوبين'),
            hasCustomersTab: bodyText.includes('إدارة العملاء'),
            hasStoresTab: bodyText.includes('إدارة المتاجر'),
            hasProductsTab: bodyText.includes('إدارة المنتجات'),
            hasOrdersTab: bodyText.includes('إدارة الطلبات'),
            hasRolesTab: bodyText.includes('إدارة الصلاحيات والأمان'),
            hasMetric1_Customers: bodyText.includes('1. إجمالي العملاء'),
            hasMetric2_Merchants: bodyText.includes('2. إجمالي التجار'),
            hasMetric3_Stores: bodyText.includes('3. إجمالي المتاجر'),
            hasMetric4_Products: bodyText.includes('4. إجمالي المنتجات'),
            hasMetric5_Orders: bodyText.includes('5. إجمالي الطلبات'),
            hasMetric6_Couriers: bodyText.includes('6. عدد المندوبين'),
            hasMetric7_NewOrders: bodyText.includes('7. الطلبات الجديدة'),
            hasMetric8_PendingRequests: bodyText.includes('8. طلبات التجار المعلقة'),
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('Admin Dashboard Desktop Evaluation Results:\n', JSON.stringify(adminEval.result?.value, null, 2));

    const shot1 = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('admin_dashboard_1440px_proof.png', Buffer.from(shot1.data, 'base64'));
    console.log('Saved Admin Dashboard screenshot to admin_dashboard_1440px_proof.png');

    console.log('\n========================================================');
    console.log('TEST 2: VERIFYING ADMIN DASHBOARD ON MOBILE (390px)');
    console.log('========================================================');

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });

    await new Promise((r) => setTimeout(r, 1000));

    const mobileAdminEval = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const mobileMenuBtn = document.querySelector('button[aria-label="القائمة الجانبية"]');
          const clientWidth = document.body.clientWidth;
          const scrollWidth = document.body.scrollWidth;
          return {
            hasMobileMenuBtn: Boolean(mobileMenuBtn),
            clientWidth,
            scrollWidth,
            isHorizontallyContained: scrollWidth <= clientWidth + 2,
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('Admin Dashboard Mobile Evaluation Results:\n', JSON.stringify(mobileAdminEval.result?.value, null, 2));

    const shot2 = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('admin_dashboard_390px_proof.png', Buffer.from(shot2.data, 'base64'));
    console.log('Saved Admin Dashboard Mobile screenshot to admin_dashboard_390px_proof.png');

    console.log('\n========================================================');
    console.log('TEST 3: VERIFYING LOGIN PAGE & RBAC REGISTRATION');
    console.log('========================================================');

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/ghaym_space.html#/login` });
    await new Promise((r) => setTimeout(r, 1500));

    const loginEval = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const bodyText = document.body.innerText;
          return {
            hasCustomerRole: bodyText.includes('عميل'),
            hasMerchantRole: bodyText.includes('تاجر'),
            hasCourierRole: bodyText.includes('مندوب'),
            hasAdminPortalBtn: bodyText.includes('بوابة الإدارة'),
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('Login Page Evaluation Results:\n', JSON.stringify(loginEval.result?.value, null, 2));

    const shot3 = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('login_page_proof.png', Buffer.from(shot3.data, 'base64'));
    console.log('Saved Login Page screenshot to login_page_proof.png');

    cdp.close();
  } catch (err) {
    console.error('Error during test execution:', err);
  } finally {
    chrome.kill();
    server.close();
  }
}

main();
