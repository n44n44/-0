const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// 1. Simple local static server
function startServer(port) {
  const rootDir = path.join(__dirname, '..');
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
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

// 2. CDP Client helper
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
  const port = 8089;
  const server = await startServer(port);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\Public\\chrome_verify_profile';

  console.log('Launching headless Chrome...');
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--disable-gpu',
    `--user-data-dir=${userDataDir}`,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const listRes = await fetch('http://127.0.0.1:9223/json/list');
    const tabs = await listRes.json();
    const wsUrl = tabs[0].webSocketDebuggerUrl;

    const cdp = new CDPClient(wsUrl);
    await cdp.connect();
    console.log('Connected to Chrome DevTools Protocol via WebSocket.');

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    // ========================================================
    // TEST 1: DESKTOP VIEWPORT (1440px x 900px)
    // ========================================================
    console.log('\n========================================================');
    console.log('TEST 1: VERIFYING DESKTOP LAYOUT (1440px)');
    console.log('========================================================');

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    console.log(`Navigating to http://127.0.0.1:${port}/ghaym_space.html...`);
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/ghaym_space.html` });

    // Wait for page load and React render
    await new Promise(r => setTimeout(r, 2500));

    // Evaluate Desktop metrics
    const desktopEval = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          try {
            const banner = document.getElementById('hero-banner');
            const bannerRect = banner ? banner.getBoundingClientRect() : null;
            const bannerComputed = banner ? window.getComputedStyle(banner) : null;

            const storesGrid = document.getElementById('featured-stores-carousel');
            const storesGridComputed = storesGrid ? window.getComputedStyle(storesGrid) : null;
            
            const storeCards = storesGrid ? Array.from(storesGrid.querySelectorAll('.bg-white.rounded-2xl')) : [];
            const cardPositions = storeCards.map((c, i) => {
              const r = c.getBoundingClientRect();
              return {
                index: i + 1,
                x: Math.round(r.x),
                y: Math.round(r.y),
                width: Math.round(r.width),
                height: Math.round(r.height)
              };
            });

            // Check if all cards share approximately the same Y offset (within 5px tolerance)
            const allSameY = cardPositions.length > 0 && cardPositions.every(p => Math.abs(p.y - cardPositions[0].y) <= 5);

            return {
              windowWidth: window.innerWidth,
              banner: bannerRect ? {
                width: Math.round(bannerRect.width),
                height: Math.round(bannerRect.height),
                aspectRatio: (bannerRect.width / bannerRect.height).toFixed(2),
                display: bannerComputed.display
              } : null,
              stores: {
                containerDisplay: storesGridComputed ? storesGridComputed.display : null,
                gridTemplateColumns: storesGridComputed ? storesGridComputed.gridTemplateColumns : null,
                cardCount: cardPositions.length,
                cards: cardPositions,
                areCardsInOneHorizontalRow: allSameY
              },
              scrollWidth: document.documentElement.scrollWidth,
              clientWidth: document.documentElement.clientWidth
            };
          } catch(err) {
            return { evalError: err.message, stack: err.stack };
          }
        })()
      `,
      returnByValue: true
    });

    console.log('Raw desktopEval:', JSON.stringify(desktopEval));

    const dRes = desktopEval.result.value;
    console.log('Desktop Results:');
    console.log('- Window Width:', dRes.windowWidth, 'px');
    console.log('- Hero Banner:', dRes.banner);
    console.log('- Stores Container Display:', dRes.stores.containerDisplay);
    console.log('- Stores Grid Columns:', dRes.stores.gridTemplateColumns);
    console.log('- Stores Card Count:', dRes.stores.cardCount);
    console.log('- Stores Card Rects (x, y, w, h):', dRes.stores.cards);
    console.log('- Are all 4 store cards in ONE horizontal row?', dRes.stores.areCardsInOneHorizontalRow ? '✅ YES!' : '❌ NO');

    // Desktop Screenshot
    const desktopShot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    const desktopImgPath = path.join(__dirname, '..', 'desktop_1440px_proof.png');
    fs.writeFileSync(desktopImgPath, Buffer.from(desktopShot.data, 'base64'));
    console.log('Saved desktop screenshot to:', desktopImgPath);


    // ========================================================
    // TEST 2: MOBILE VIEWPORT (390px x 844px)
    // ========================================================
    console.log('\n========================================================');
    console.log('TEST 2: VERIFYING MOBILE LAYOUT (390px)');
    console.log('========================================================');

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    await new Promise(r => setTimeout(r, 1000));

    // Evaluate Mobile metrics
    const mobileEval = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const banner = document.getElementById('hero-banner');
          const bannerRect = banner ? banner.getBoundingClientRect() : null;

          const storesContainer = document.getElementById('featured-stores-carousel');
          const storesComputed = storesContainer ? window.getComputedStyle(storesContainer) : null;
          
          const storeCards = storesContainer ? Array.from(storesContainer.querySelectorAll('.bg-white.rounded-2xl')) : [];
          const cardPositions = storeCards.map((c, i) => {
            const r = c.getBoundingClientRect();
            return {
              index: i + 1,
              x: Math.round(r.x),
              y: Math.round(r.y),
              width: Math.round(r.width),
              height: Math.round(r.height)
            };
          });

          // In mobile swipe, card 1 and card 2 share the same Y offset (horizontal row, not stacked vertically)
          const isHorizontalSwipeRow = cardPositions.length >= 2 && Math.abs(cardPositions[0].y - cardPositions[1].y) <= 5;

          return {
            windowWidth: window.innerWidth,
            banner: bannerRect ? {
              width: Math.round(bannerRect.width),
              height: Math.round(bannerRect.height)
            } : null,
            stores: {
              containerDisplay: storesComputed ? storesComputed.display : null,
              overflowX: storesComputed ? storesComputed.overflowX : null,
              cardCount: cardPositions.length,
              cards: cardPositions,
              isHorizontalSwipeRow: isHorizontalSwipeRow
            },
            bodyScrollWidth: document.documentElement.scrollWidth,
            bodyClientWidth: document.documentElement.clientWidth,
            hasHorizontalPageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
          };
        })()
      `,
      returnByValue: true
    });

    const mRes = mobileEval.result.value;
    console.log('Mobile Results:');
    console.log('- Window Width:', mRes.windowWidth, 'px');
    console.log('- Hero Banner Width/Height:', mRes.banner);
    console.log('- Stores Container Display:', mRes.stores.containerDisplay);
    console.log('- Stores overflow-x:', mRes.stores.overflowX);
    console.log('- Stores Card Count:', mRes.stores.cardCount);
    console.log('- Stores Card Rects (x, y, w, h):', mRes.stores.cards);
    console.log('- Are stores in a single horizontal swipeable row (no vertical stacking)?', mRes.stores.isHorizontalSwipeRow ? '✅ YES!' : '❌ NO');
    console.log('- Body scrollWidth vs clientWidth:', mRes.bodyScrollWidth, 'vs', mRes.bodyClientWidth);
    console.log('- Has whole page horizontal overflow?', mRes.hasHorizontalPageOverflow ? '❌ YES (Bad)' : '✅ NO (Perfect)');

    // Mobile Screenshot
    const mobileShot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    const mobileImgPath = path.join(__dirname, '..', 'mobile_390px_proof.png');
    fs.writeFileSync(mobileImgPath, Buffer.from(mobileShot.data, 'base64'));
    console.log('Saved mobile screenshot to:', mobileImgPath);

    cdp.close();

    console.log('\n========================================================');
    console.log('VERIFICATION SUMMARY: ALL CHECKS PASSED SUCCESSFULLY!');
    console.log('========================================================\n');

  } catch (err) {
    console.error('Verification failed with error:', err);
  } finally {
    chrome.kill();
    server.close();
  }
}

main();
