import fs from 'fs'
import https from 'https'

async function downloadPage(page) {
    const paddedPage = String(page).padStart(3, '0');
    console.log(`Downloading page ${paddedPage}...`);
    const url = `https://media.qurankemenag.net/khat2/QK_${paddedPage}.webp`;
    // save the file to disk
    const file = fs.createWriteStream(`./per-page/QK_${paddedPage}.webp`);
    https.get(url, function(response) {
        response.pipe(file);
    });
}

(async () => {
    for (let i = 1; i <= 604; i += 1) {
        await downloadPage(i);
    }

    console.log('Done!')
})();