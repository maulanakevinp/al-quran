import puppeteer from 'puppeteer';
import fs from 'fs';

async function getPageNumbersForSurah(page, surah) {
    const url = `https://quran.kemenag.go.id/quran/per-halaman/surah/${surah}`;
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });
    // Tambahkan delay agar JS sempat mengubah URL
    await new Promise(resolve => setTimeout(resolve, 500));
    // Ambil window.location.href dari browser context
    const finalUrl = await page.evaluate(() => window.location.href);
    const match = finalUrl.match(/\?page=(\d+)/);
    if (match) {
        return [match[1].padStart(3, '0')];
    } else {
        return [];
    }
}

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const result = {};
    for (let surah = 1; surah <= 114; surah++) {
        try {
            const pages = await getPageNumbersForSurah(page, surah);
            result[surah] = pages;
            console.log(`Surah ${surah}:`, pages);
        } catch (e) {
            console.error(`Surah ${surah} error:`, e.message);
        }
    }
    await browser.close();
    fs.writeFileSync('page_numbers_by_surah.json', JSON.stringify(result, null, 2));
    console.log('Selesai! Hasil di page_numbers_by_surah.json');
})();
