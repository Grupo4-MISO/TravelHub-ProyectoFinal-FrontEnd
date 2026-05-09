const { chromium } = require('playwright');
const fs = require('fs');

// ==============================
// COUNTRIES + CITIES
// ==============================

const COUNTRIES = [
  {
    country: 'CL',
    cities: [
      'Santiago',
      'Valparaiso',
      'Viña del Mar',
      'Puerto Varas'
    ]
  },
  {
    country: 'CO',
    cities: [
      'Cartagena',
      'Bogotá',
      'Medellín',
      'Santa Marta'
    ]
  },
  {
    country: 'PE',
    cities: [
      'Lima',
      'Cusco',
      'Arequipa'
    ]
  },
  {
    country: 'AR',
    cities: [
      'Buenos Aires',
      'Mendoza',
      'Bariloche'
    ]
  }
];

function randomItem(array) {

  return array[
    Math.floor(Math.random() * array.length)
  ];
}

const BASE_URL = 'http://localhost:4200';

// ==============================
// CONFIG
// ==============================

const CONFIG = {
  HEADLESS: false,
  WAIT: 1200,
  SCREENSHOTS: true,
  TEST_DURATION_MINUTES: 2
};

// ==============================
// REPORT
// ==============================

const report = {
  start: new Date().toISOString(),
  flows: [],
  errors: [],
  screenshots: [],
  iterations: 0
};

// ==============================
// HELPERS
// ==============================

function randomText(size = 8) {

  const chars =
    'abcdefghijklmnopqrstuvwxyz';

  let text = '';

  for (let i = 0; i < size; i++) {

    text += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  return text;
}

function randomEmail() {

  return `${randomText(8)}@gmail.com`;
}

async function screenshot(page, name) {

  if (!CONFIG.SCREENSHOTS) return;

  if (!fs.existsSync('./screenshots')) {

    fs.mkdirSync('./screenshots');
  }

  const file =
    `./screenshots/${name}.png`;

  await page.screenshot({
    path: file,
    fullPage: true
  });

  report.screenshots.push(file);
}

async function safeClick(page, selector) {

  try {

    await page.waitForSelector(selector, {
      timeout: 5000
    });

    await page.click(selector);

    await page.waitForTimeout(CONFIG.WAIT);

    return true;

  } catch (err) {

    return false;
  }
}

async function safeFill(
  page,
  selector,
  value
) {

  try {

    await page.waitForSelector(selector, {
      timeout: 5000
    });

    await page.fill(selector, value);

    return true;

  } catch (err) {

    return false;
  }
}

// ==============================
// SEARCH FLOW
// ==============================

async function runSearchFlow(page) {

  try {

    console.log(
      'Ejecutando SEARCH flow'
    );

    // =====================================
    // PAIS ALEATORIO
    // =====================================

    const selectedCountry =
      randomItem(COUNTRIES);

    const selectedCity =
      randomItem(
        selectedCountry.cities
      );

    console.log(
      `Pais seleccionado: ${selectedCountry.country}`
    );

    console.log(
      `Ciudad seleccionada: ${selectedCity}`
    );

    // =====================================
    // ABRIR SELECTOR PAIS
    // =====================================

    const countrySelectors = [
      '[class*="country"]',
      '[class*="locale"]',
      '[class*="currency"]',
      'button:has-text("CL")',
      'button:has-text("CO")',
      'button:has-text("PE")',
      'button:has-text("AR")'
    ];

    let countryOpened = false;

    for (const selector of countrySelectors) {

      try {

        await page.click(selector, {
          timeout: 3000
        });

        countryOpened = true;

        break;

      } catch (_) {}
    }

    if (countryOpened) {

      await page.waitForTimeout(1000);

      // =====================================
      // SELECCIONAR NUEVO PAIS
      // =====================================

      const countryOptionSelectors = [
        `text=${selectedCountry.country}`,
        `li:has-text("${selectedCountry.country}")`,
        `button:has-text("${selectedCountry.country}")`
      ];

      for (const selector of countryOptionSelectors) {

        try {

          await page.click(selector, {
            timeout: 3000
          });

          break;

        } catch (_) {}
      }

      await page.waitForTimeout(2000);
    }

    // =====================================
    // DESTINO
    // =====================================

    const destinationSelectors = [
      'input[placeholder*="Ciudad"]',
      'input[placeholder*="Destino"]',
      'input[name*="destination"]',
      'input'
    ];

    for (const selector of destinationSelectors) {

      const ok = await safeFill(
        page,
        selector,
        selectedCity
      );

      if (ok) {

        await page.waitForTimeout(1500);

        // =====================================
        // SELECCIONAR AUTOCOMPLETE
        // =====================================

        const autocompleteSelectors = [
          `text=${selectedCity}`,
          `[role="option"]`,
          '.autocomplete-option',
          'li'
        ];

        for (const autoSelector of autocompleteSelectors) {

          try {

            await page.click(autoSelector, {
              timeout: 2000
            });

            break;

          } catch (_) {}
        }

        break;
      }
    }

    // =====================================
    // FECHAS
    // =====================================

    const dateInputs =
      await page.$$('input[type="date"]');

    if (dateInputs.length >= 2) {

      await dateInputs[0].fill(
        '2026-06-01'
      );

      await dateInputs[1].fill(
        '2026-06-05'
      );
    }

    // =====================================
    // HUESPEDES
    // =====================================

    const guestsInput =
      await page.$(
        'input[type="number"]'
      );

    if (guestsInput) {

      const guests =
        Math.floor(Math.random() * 4) + 1;

      await guestsInput.fill(
        String(guests)
      );
    }

    await screenshot(
      page,
      `search-before-${Date.now()}`
    );

    // =====================================
    // BUSCAR
    // =====================================

    const buttons = [
      'button:has-text("Buscar")',
      'button'
    ];

    let clicked = false;

    for (const selector of buttons) {

      try {

        await page.click(selector);

        clicked = true;

        break;

      } catch (_) {}
    }

    await page.waitForTimeout(4000);

    await screenshot(
      page,
      `search-after-${Date.now()}`
    );

    report.flows.push({
      flow: 'search',
      success: clicked,
      country: selectedCountry.country,
      city: selectedCity,
      timestamp: new Date().toISOString()
    });

  } catch (err) {

    report.errors.push({
      flow: 'search',
      message: err.message
    });
  }
}

// ==============================
// LOGIN FLOW
// ==============================

async function runLoginFlow(page) {

  try {

    console.log(
      'Ejecutando LOGIN flow'
    );

    const loginSelectors = [
      'button:has-text("Iniciar sesión")',
      'a:has-text("Iniciar sesión")',
      'button:has-text("Login")'
    ];

    let opened = false;

    for (const selector of loginSelectors) {

      const ok =
        await safeClick(page, selector);

      if (ok) {

        opened = true;
        break;
      }
    }

    await screenshot(
      page,
      `login-page-${Date.now()}`
    );

    // EMAIL
    const emailSelectors = [
      'input[type="email"]',
      'input[name="email"]'
    ];

    for (const selector of emailSelectors) {

      const ok = await safeFill(
        page,
        selector,
        randomEmail()
      );

      if (ok) break;
    }

    // PASSWORD
    const passwordSelectors = [
      'input[type="password"]'
    ];

    for (const selector of passwordSelectors) {

      const ok = await safeFill(
        page,
        selector,
        'Test123456*'
      );

      if (ok) break;
    }

    // SUBMIT
    const submitSelectors = [
      'button[type="submit"]',
      'button:has-text("Ingresar")',
      'button:has-text("Login")',
      'button'
    ];

    for (const selector of submitSelectors) {

      const ok =
        await safeClick(page, selector);

      if (ok) break;
    }

    await page.waitForTimeout(3000);

    await screenshot(
      page,
      `login-after-${Date.now()}`
    );

    report.flows.push({
      flow: 'login',
      success: opened,
      timestamp: new Date().toISOString()
    });

  } catch (err) {

    report.errors.push({
      flow: 'login',
      message: err.message
    });
  }
}

// ==============================
// REGISTER FLOW
// ==============================

async function runRegisterFlow(page) {

  try {

    console.log(
      'Ejecutando REGISTER flow'
    );

    const registerSelectors = [
      'button:has-text("Crear Cuenta")',
      'a:has-text("Crear Cuenta")',
      'button:has-text("Registrarse")'
    ];

    for (const selector of registerSelectors) {

      const ok =
        await safeClick(page, selector);

      if (ok) break;
    }

    await screenshot(
      page,
      `register-page-${Date.now()}`
    );

    // INPUTS
    const inputs = await page.$$(
      'input:not([type="hidden"])'
    );

    for (const input of inputs) {

      try {

        const type =
          await input.getAttribute('type');

        if (type === 'email') {

          await input.fill(
            randomEmail()
          );

        } else if (
          type === 'password'
        ) {

          await input.fill(
            'Test123456*'
          );

        } else if (
          type === 'tel'
        ) {

          await input.fill(
            '3001234567'
          );

        } else {

          await input.fill(
            randomText(10)
          );
        }

      } catch (_) {}
    }

    await screenshot(
      page,
      `register-before-submit-${Date.now()}`
    );

    // SUBMIT
    const submitButtons = [
      'button[type="submit"]',
      'button:has-text("Crear")',
      'button:has-text("Registrarse")',
      'button'
    ];

    for (const selector of submitButtons) {

      const ok =
        await safeClick(page, selector);

      if (ok) break;
    }

    await page.waitForTimeout(3000);

    await screenshot(
      page,
      `register-after-${Date.now()}`
    );

    report.flows.push({
      flow: 'register',
      success: true,
      timestamp: new Date().toISOString()
    });

  } catch (err) {

    report.errors.push({
      flow: 'register',
      message: err.message
    });
  }
}

// ==============================
// MAIN
// ==============================

(async () => {

  const browser =
    await chromium.launch({
      headless: CONFIG.HEADLESS
    });

  const page =
    await browser.newPage();

  // ==========================
  // JS ERRORS
  // ==========================

  page.on('pageerror', error => {

    report.errors.push({
      type: 'pageerror',
      message: error.message
    });
  });

  // ==========================
  // CONSOLE ERRORS
  // ==========================

  page.on('console', msg => {

    if (msg.type() === 'error') {

      report.errors.push({
        type: 'console',
        message: msg.text()
      });
    }
  });

  try {

    const TEST_DURATION_MS =
      CONFIG.TEST_DURATION_MINUTES
      * 60
      * 1000;

    const startTime =
      Date.now();

    let iteration = 1;

    while (
      Date.now() - startTime <
      TEST_DURATION_MS
    ) {

      console.log(
        `\n========== ITERACION ${iteration} ==========`
      );

      report.iterations++;

      // HOME
      await page.goto(BASE_URL, {
        waitUntil: 'networkidle'
      });

      await screenshot(
        page,
        `home-${iteration}`
      );

      // SEARCH FLOW
      await runSearchFlow(page);

      // HOME
      await page.goto(BASE_URL);

      // LOGIN FLOW
      await runLoginFlow(page);

      // HOME
      await page.goto(BASE_URL);

      // REGISTER FLOW
      await runRegisterFlow(page);

      iteration++;
    }

  } catch (err) {

    report.errors.push({
      type: 'fatal',
      message: err.message
    });

  } finally {

    report.end =
      new Date().toISOString();

    // JSON REPORT
    fs.writeFileSync(
      'flow-report.json',
      JSON.stringify(
        report,
        null,
        2
      )
    );

    // HTML REPORT
    const html = `
      <html>

        <head>

          <title>Flow Report</title>

          <style>

            body {
              font-family: Arial;
              padding: 20px;
            }

            .ok {
              color: green;
            }

            .error {
              color: red;
            }

          </style>

        </head>

        <body>

          <h1>Flow Testing Report</h1>

          <p>
            <b>Inicio:</b>
            ${report.start}
          </p>

          <p>
            <b>Fin:</b>
            ${report.end}
          </p>

          <p>
            <b>Iteraciones:</b>
            ${report.iterations}
          </p>

          <h2>Flows Ejecutados</h2>

          <ul>

            ${report.flows.map(flow => `
              <li class="ok">
                ${flow.flow}
                →
                ${flow.success}
                →
                ${flow.timestamp}
              </li>
            `).join('')}

          </ul>

          <h2>Errores</h2>

          <ul>

            ${report.errors.map(error => `
              <li class="error">
                ${error.type || error.flow}
                :
                ${error.message}
              </li>
            `).join('')}

          </ul>

          <h2>Screenshots</h2>

          <ul>

            ${report.screenshots.map(s => `
              <li>${s}</li>
            `).join('')}

          </ul>

        </body>

      </html>
    `;

    fs.writeFileSync(
      'flow-report.html',
      html
    );

    await browser.close();

    console.log(
      '\n===== TEST FINALIZADO ====='
    );

    console.log(
      'Reporte HTML generado'
    );

    console.log(
      'Reporte JSON generado'
    );
  }

})();