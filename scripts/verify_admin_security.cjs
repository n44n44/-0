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
  const port = 8097;
  const server = await startServer(port);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\Public\\chrome_security_profile_' + Date.now();

  console.log('Launching headless Chrome for Admin Security Verification...');
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9229',
    '--no-sandbox',
    '--disable-gpu',
    `--user-data-dir=${userDataDir}`,
    '--window-size=1440,900',
  ]);

  await new Promise((r) => setTimeout(r, 1500));

  try {
    const jsonRes = await fetch('http://127.0.0.1:9229/json');
    const tabs = await jsonRes.json();
    const wsUrl = tabs[0].webSocketDebuggerUrl;
    console.log('Connected to Chrome DevTools Protocol via WebSocket.');

    const cdp = new CDPClient(wsUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('DOM.enable');

    console.log('\n========================================================');
    console.log('SECURITY TEST 1: UNAUTHENTICATED DIRECT ACCESS TO #/admin');
    console.log('========================================================');

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/ghaym_space.html#/admin` });
    await new Promise((r) => setTimeout(r, 2000));

    const gateEval = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const bodyText = document.body.innerText;
          const hasGateTitle = bodyText.includes('دخول إدارة منصة غيم سبيس');
          const hasGateBadge = bodyText.includes('بوابة المشرف العام');
          const hasDemoButton = bodyText.includes('دخول سريع للتجربة') || bodyText.includes('حساب تجريبي');
          const hasRegisterOption = bodyText.includes('فتح حساب جديد') || bodyText.includes('تسجيل جديد');
          const hasUsernameInput = Boolean(document.querySelector('input[type="text"]'));
          const hasPasswordInput = Boolean(document.querySelector('input[type="password"]'));
          const hasSubmitButton = bodyText.includes('التحقق والدخول للوحة المشرف');

          return {
            hasGateTitle,
            hasGateBadge,
            hasDemoButton, // MUST be false
            hasRegisterOption, // MUST be false
            hasUsernameInput,
            hasPasswordInput,
            hasSubmitButton,
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('Test 1 Evaluation Results:\n', JSON.stringify(gateEval.result?.value, null, 2));

    const shot1 = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('proof_security_admin_gate.png', Buffer.from(shot1.data, 'base64'));

    console.log('\n========================================================');
    console.log('SECURITY TEST 2: INVALID CREDENTIALS REJECTION');
    console.log('========================================================');

    const invalidLoginEval = await cdp.send('Runtime.evaluate', {
      expression: `
        (async () => {
          function setReactInput(input, val) {
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            setter.call(input, val);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }

          const inputs = document.querySelectorAll('input');
          setReactInput(inputs[0], 'hacker@ghaym.ye');
          setReactInput(inputs[1], 'WrongPassword123');

          const submitBtn = document.querySelector('button[type="submit"]');
          submitBtn.click();
          await new Promise(r => setTimeout(r, 800));

          const bodyText = document.body.innerText;
          const hasErrorMessage = bodyText.includes('بيانات') || bodyText.includes('غير صحيحة') || bodyText.includes('سجل الأمان');
          const stillInGate = bodyText.includes('دخول إدارة منصة غيم سبيس');

          return {
            hasErrorMessage,
            stillInGate,
            unauthorizedBypassPrevented: stillInGate && !bodyText.includes('لوحة المؤشرات')
          };
        })()
      `,
      awaitPromise: true,
      returnByValue: true,
    });

    console.log('Test 2 Evaluation Results:\n', JSON.stringify(invalidLoginEval.result?.value, null, 2));

    console.log('\n========================================================');
    console.log('SECURITY TEST 3: VALID CREDENTIALS AUTHORIZED ACCESS');
    console.log('========================================================');

    const validLoginEval = await cdp.send('Runtime.evaluate', {
      expression: `
        (async () => {
          function setReactInput(input, val) {
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            setter.call(input, val);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }

          const inputs = document.querySelectorAll('input');
          setReactInput(inputs[0], 'superadmin@ghaymspace.com');
          setReactInput(inputs[1], 'GhaymAdmin@2026');

          const submitBtn = document.querySelector('button[type="submit"]');
          submitBtn.click();
          await new Promise(r => setTimeout(r, 1500));

          const bodyText = document.body.innerText;
          return {
            hasAdminDashboard: bodyText.includes('لوحة تحكم المشرف العام') || bodyText.includes('لوحة المؤشرات') || bodyText.includes('الرئيسية'),
            hasMerchantsManagement: bodyText.includes('إدارة التجار'),
            hasCouriersManagement: bodyText.includes('إدارة المندوبين'),
            hasSecurityRolesManagement: bodyText.includes('إدارة الصلاحيات والأمان') || bodyText.includes('الصلاحيات والأمان'),
          };
        })()
      `,
      awaitPromise: true,
      returnByValue: true,
    });

    console.log('Test 3 Evaluation Results:\n', JSON.stringify(validLoginEval.result?.value, null, 2));

    const shot3 = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('proof_security_admin_authorized.png', Buffer.from(shot3.data, 'base64'));

    console.log('\n========================================================');
    console.log('SECURITY TEST 4: NON-ADMIN PERSONA ACCESS DENIED (Merchant attempting #/admin)');
    console.log('========================================================');

    // Logout from admin first, switch to merchant
    await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          localStorage.removeItem('ghaym_active_admin_id');
          localStorage.setItem('ghaym_active_merchant_id', 'usr-merch-1');
          window.location.hash = '#/admin';
          window.location.reload();
        })()
      `,
    });
    await new Promise((r) => setTimeout(r, 2000));

    const accessDeniedEval = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const bodyText = document.body.innerText;
          const hasAccessDeniedTitle = bodyText.includes('غير مصرح بالدخول للوحة المشرف');
          const hasDeniedBadge = bodyText.includes('وصول محظور');
          const mentionsMerchant = bodyText.includes('تاجر');
          const hasDemoButton = bodyText.includes('دخول سريع للتجربة');
          const hasReturnBtn = bodyText.includes('العودة إلى لوحة تحكم التاجر');

          return {
            hasAccessDeniedTitle,
            hasDeniedBadge,
            mentionsMerchant,
            hasDemoButton, // MUST be false
            hasReturnBtn,
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('Test 4 Evaluation Results:\n', JSON.stringify(accessDeniedEval.result?.value, null, 2));

    const shot4 = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('proof_security_access_denied.png', Buffer.from(shot4.data, 'base64'));

    console.log('\n========================================================');
    console.log('SECURITY TEST 5: PUBLIC LOGIN/SIGNUP DOES NOT EXPOSE ADMIN');
    console.log('========================================================');

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/ghaym_space.html#/login` });
    await new Promise((r) => setTimeout(r, 1500));

    const publicLoginEval = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const bodyText = document.body.innerText;
          const hasCustomerRole = bodyText.includes('عميل');
          const hasMerchantRole = bodyText.includes('تاجر');
          const hasCourierRole = bodyText.includes('مندوب');
          const hasAdminInTabs = bodyText.includes('مشرف') || bodyText.includes('مدير');
          const hasAdminModePill = bodyText.includes('بوابة الإدارة');

          return {
            hasCustomerRole,
            hasMerchantRole,
            hasCourierRole,
            hasAdminInTabs, // MUST be false in public login tabs
            hasAdminModePill, // MUST be false for general public
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('Test 5 Evaluation Results:\n', JSON.stringify(publicLoginEval.result?.value, null, 2));

    cdp.close();
  } catch (err) {
    console.error('Error during test execution:', err);
  } finally {
    chrome.kill();
    server.close();
  }
}

main();
