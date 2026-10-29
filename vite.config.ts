/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

/**
 * Трекер юзер-тестов (dashboard/tracker/track.js → public/track.js).
 * Подключается только в production-сборке и только если задан UT_ENDPOINT (адрес сбора, в CI) —
 * локальная разработка в метрики не попадает. Перед трекером — нормализация экранов:
 * все /servers/<имя> считаются одним экраном «Страница сервера».
 */
function userTestingTracker(): Plugin {
  return {
    name: 'user-testing-tracker',
    apply: 'build',
    transformIndexHtml(html) {
      const endpoint = process.env.UT_ENDPOINT
      if (!endpoint) return html
      const base = process.env.BASE_PATH ?? '/'
      const normalize = `<script>window.__UT_SCREEN__=function(p){return /\\/servers\\/(?!create$)[^/]+$/.test(p)?p.replace(/[^/]+$/,':id'):p}</script>`
      const tracker = `<script src="${base}track.js" data-endpoint="${endpoint}"></script>`
      return html.replace('</body>', `    ${normalize}\n    ${tracker}\n  </body>`)
    },
  }
}

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  // GitHub Pages отдаёт сайт из подпапки репозитория (/Lesson4/) — путь задаётся при сборке в CI. Локально — корень.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), userTestingTracker()],
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});