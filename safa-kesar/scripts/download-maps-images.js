const fs = require('fs');
const path = require('path');
const https = require('https');

const imageUrls = [
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWk4llziDUlfaFcqNkaP79_iFfGywAxSClRNou6jZWDaL35Iwiyk_bNuTZF2RfquzWyubr2WeUEngTXJNTKzrJwGplph8n1gN_q2JbwivgkIdqmXeTRUlOf_IcK4kt09C7Z5vm9mrQ=s2048",
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmLDhI_fMjjL69bPnLCh3SI4gmLkEo7BLoKMbVlkltLAGBHc_DN36JNSeVHGBm-uoIwjGztpk953XbcXknnHr0W9zuxP4jiZsdkzlgDoI1eZNncU0zfO9tqYYo2FRs0F8aLRfZY=s2048",
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmVFSsjr4o_Ld3lone_qQw2UHVcWnxLu32bkSu5ggCgeBEIQXcidrf-UP_YGgw02p2-1jqWkX_l13ICN34bh-dUInGsuqhn5RfaIFCn3_ne4S4KXLehd8SCPX-rpwhUKOsfjTzp=s2048",
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWk60HsEaBfFX8j3oQVpBSBSVu5g9TpA5awPTrmzxlLeZlhxhBoGZhYJ3jmu4Th7EjnBilDiJrZIRbvxKzWFFUEcN8Hazfe6EuqPcNZuI9BU_waW4UNUW-3_UdAGI4X3_akUYY8=s2048",
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmP-ObuYupaZA1La_H62eNxs5yj8xQ1D1Fm_s0b32Hfm0Gskd8E6WRgXb78i74yERSwImKTmwa4sl-_MlO-HipWfA48RINALd_0Ciqjlr_9iuxevULZEmOP5GHIKOWWVD2bfUV3sw=s2048",
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnCRvNnrpVNbrAAnTAjsXa4IokJbsTHPR8Z1vTfXL9RSJyjMoGQa7AGI6imVlzsmuj8f89dL7Fo_UZ9CEwJonqE_W7dsxrW9hUnKYU9zMK-FntnHx4jeIYcPNVnklVVxjM81bTNk9hG7Owh=s2048",
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWltV7HwcOI6x8Xtoz4lT6W75fiTfQwWkP871H-cjQxLzA6cBA7pEpbpwx6kp-sriaPRvTBgwpOaCcsk9uCd_gQAwFMHxxRklTmFwMJiQt9ohlM1ThnFLf98844PKASlAKw5owWR=s2048",
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWllzgl-MrPGkoO9I5EwYCnNRt5vU-l-MKqS-S1CJ4_yRAgkZYJWLSlRB_XM-OEnmubr0mQ1DZq7D2nkvOMalvVJTZjwShTgo3p_KEVVaIYzEXc4Wno9CZmOwNY-kBt4VqhPmU48Ss8r_6ak=s2048",
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkJHMGsTZktI2_ugysn6BTYNaqQ2n0HFkZ-MT9g213wCOF97tpKGCfrzLykS1Ijj9kH4QfibVfzbvXmzXFnjSaRU1dufWSfRb0idszfQGaNE1NryNL_MpSBURo2qypu1XYvAmj7MkvQQxZF=s2048",
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkbYVQYPfMBGd9Pb2_-k-fF7LtF1LWrb8I7Rb5KgogDnuXp7xtXy-BXGU67nCiGrDY907gPplNPK0qceYVrnOraalDLnNmKBRMG94arE23KKG0z8unD2MiGey5XGji6nPHJyHAjNgyWhr4=s2048",
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnBqG3ezWeCu-0dmdbAQxwsjkbQScsqp81ZeUSao9wTD0gGWu6N4QpfXMsMB7nnPG1uvUo5PuIBN4jrAlMhmg3xjSFsyULGdvX-4T87JSBjZz1UiTx05PxdGVez83Jd4Bl1OrX7mpthZ3Y=s2048",
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnVLezSGQR092szQCx_-t0kaPDyZ1jX7-ufDjJ6Zo72E4qEDmYBbqOKjC7b0WyahwsXy6V2O9u07WxbPhKFwDpJ957ewcnHGfEKAyqDRIqRubzA8kkjJPRwxxWD8KjeMnnOJX5BLw=s2048",
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlI-ct0UaZjplb2JbSxZnTFyJNHGUcwpc14rKqhMushCKAi3apI_DRREm-2unAIe8aQpNR8eFXKhyXJ5Xit3BQVjQTKGkH6SNo-N77sJimmIK6BKm9Xy94AD0hFQBcbqVuzBrJPJsladVk=s2048",
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWl3LVIC-F8d5BnkS9wmlcefUruvii2wp2wePqW0-F3beHDG_NswC18rfRv63U2SD-qp6CKVGCSPTp0xj5CjpKg6ZiF0C2csJJqSM40GmH5dP3QQ8UQtodceeT8VzjMEM2oL7w1Q=s2048",
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWn1UC5a4e1lmF7gZw1Jqow1YlQxO-KqNZv6H3HWJt9_40t8JPNRt7sJ7xZpcATAdAtDARRWhGkX8oBvQTx7LQBNvPFlpL7p6VCsYOlkISf23tP2OPwnEuDWK6gRmWWc29-f-xc=s2048",
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnFcUJ85S35lIAZWpJtEvXYhQwoiyuy6J6Sqh-iUeoXP6BqVBj5JHD5BbPYEDrgZK2jdTaoP73fAbNqO09qDHuQvpcxYejRQYa9-dMR8Rv6ZVeeQnWS3AyRYYejil-CRtPQjBgsa4SK7an1=s2048",
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmuIhFyMD9-Q2R2uujegv3_mFpoCavIefhBc66wZXj9uEEUbHQkQNqgnNjhyszygfHp0Z1RQZbMaUCkVmkgONid56Eup7XphVWzv9Bo8M1BoZPE_QeV4Z6C7EQOU3zM7xKYaVGa8RI-MJk=s2048",
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnoPv3DHeTtxXMgmWXBk2L86cmozuCAGuxHuCfIx4w5QVaf_O0lGME6t_p4y2yrLZMsVksV8eagGs2X9oiBqczwC51i8rxr3qDPI9cKALtDOSwKfVKaJ2KE9a5x-EPOIAqQZTNb2j4mgBq3=s2048",
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnoDP2p4V-6Bu2HBnkaQX2a0c8_j458RwJZa-kx4Z6a5sb66Bd-NJOl7zpAwiQr8Nm-lqF8vHzAoHMC6QPfBMEp8BASqjIi0CBWXTs9bkF1Ul7acZ5XaJSpATwEpt1Qtf0bMFkauQ=s2048",
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkIq2ID0HtYnxUfwkFWbsNwJTQ09Tb0-ZxdXXvNWbCIvKrpa0hkHvbtYjrOLLJhLJG6JI_rLqtbnddH38LKlkgrdeZetrSYbwCZ9gUGDal0Nu05GvqKyea30dX42-82Oirb9OBLaw=s2048",
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlPiiwzQqbW4xkxeItxRbap4V_d14pDr-OfTL4RgutmtGQCon4e19NVe5A4oNrL2Pqqz7CWBOM4aMBBYhomcipmx9EHJVjVK43UwOWbZ5K7szRTdesF11IRCDBePwBC22YoMljJgA=s2048",
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkNLfRhfEne8Jc_Zw9tsNLEjzyYiT9ZqX7Y7YBMoZV1xAbd0E5dIRIh8Fjo4AgpH_oUhyJ-BtaDNmU9AR7Na8fkJlOJPvQUSWMW2a-WsusPA3iqFOF-1mxLytYt7x5PcWrNC4cS=s2048",
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlQCZI0UMBsgznyEHxSXoljy23q7-LvF_MR800VOL5vBLSpWsjZbbKqqHsxVn14LFls6cGCzCBJzCfxJYizsXC1N9auy0vL7WcnD61dbP8nu3UojL6PFjNZw0iKD_C4InuM0-6N=s2048",
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlJWK_tgKWpijAcVEwmnQxej1YYlNhkNaE1bafaRxWXpit2RJSyAsH8yT1DB7wk4ifxG62JHqw03UIJscETZ-VzQudtEr1KTS5nxT4dGsg0QkDQBl5QU0tHpJF_dSU20v90OgsUJQ=s2048",
  "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnuJJF42hzXZhFZ-x2Tcw-qXfl6fsfFk2HtXXeIqaUfLrjVZ3gNkkyt_NSXzwfM7Js5Z4uyeuTiwEtiuzlY9crrbIGvvNRHC60bfLdZduDyEOD_tABoteEKnyyxwlVjLTCRFf2Kew=s2048"
];

const targetDir = path.join(__dirname, '..', 'public', 'google-maps');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location, destPath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(destPath, () => {});
        return reject(new Error(`Status Code: ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log(`Starting download of ${imageUrls.length} Google Maps images for Safa Kesar...`);
  const manifest = [];

  for (let i = 0; i < imageUrls.length; i++) {
    const indexStr = String(i + 1).padStart(2, '0');
    const fileName = `safa-kesar-map-${indexStr}.jpg`;
    const destPath = path.join(targetDir, fileName);
    try {
      await downloadImage(imageUrls[i], destPath);
      const stats = fs.statSync(destPath);
      console.log(`✓ Downloaded [${indexStr}/${imageUrls.length}]: ${fileName} (${Math.round(stats.size / 1024)} KB)`);
      manifest.push({
        index: i + 1,
        filename: fileName,
        path: `/google-maps/${fileName}`,
        sizeBytes: stats.size,
        sourceUrl: imageUrls[i]
      });
    } catch (e) {
      console.error(`✗ Failed [${indexStr}/${imageUrls.length}]: ${e.message}`);
    }
  }

  fs.writeFileSync(path.join(targetDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`Done! Saved ${manifest.length} images to ${targetDir}`);
}

run();
