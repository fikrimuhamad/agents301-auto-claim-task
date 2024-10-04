import fetch from 'node-fetch';
import fs from 'fs';

function getToken(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    return data.split('\n').map(line => line.trim()).filter(line => line.length > 0);
}
    
function number(number, decimals = 0, decPoint = ',', thousandsSep = '.') {
    const n = parseFloat(number).toFixed(decimals);
    const parts = n.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
    return parts.join(decPoint);
}

async function getCURL(url, method = 'GET', headers = {}, body = null, returnJson = true) {
    const options = {
        method,
        headers,
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = returnJson ? await response.json() : await response.text();
    
    return data;
}

(async () => {
    const dataList = getToken('query.txt');
    
    console.log(`-------------------------------`);
    console.log(` |            MENU            | `);
    console.log(` [  AGENS.BOT AUTO CLEAR TASK ] `);
    console.log(`-------------------------------`);
    console.log();

    const delayInput = 1; //delay dalam 24jam
    const hours = Math.floor(delayInput / 60 / 60);
    if ( hours === 0 ){ var minutes = Math.floor(delayInput / 60); }else{ var minutes = Math.floor(hours * 60 / 60); }
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    console.log('[.] MENJALANKAN AUTO CLEAR TASK, DELAY ' + hours + ' JAM SETELAH CEK ' + dataList.length + ' AKUN...\n');
    while (true) {
        for (let i = 0; i < dataList.length; i += 100) {
            const batch = dataList.slice(i, i + 100);
            const batchPromises = batch.map(async (token, batchIndex) => {
            const no = i + batchIndex + 1;
            // Parsing query string menggunakan URLSearchParams
            const params = new URLSearchParams(token);
            const user = JSON.parse(decodeURIComponent(params.get('user')));
            let logMessage = `====================================================
[[#${no}] MENGAMBIL DATA AKUN: ${user.username} ]\n`;
            const headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0',
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'accept-language': 'id,en;q=0.9,en-GB;q=0.8,en-US;q=0.7',
                'authorization': token,
                'origin': 'https://telegram.agent301.org'
            };
                const infoAkun = await getCURL('https://api.agent301.org/getMe', 'POST', headers, {"referrer_id":0});
                
                if (infoAkun.ok == true) {
                    logMessage += `
[ #.NAME ] : ${user.first_name ? user.first_name : ""} ${user.last_name ? user.last_name : ""} ( ${user.id} )
[ #.BALLANCE ] : ${number(infoAkun.result.balance)} AP
[*] INFORMASI CLAIM TASK:\n`;


                    // Get task ID
                    const getTaskID = await getCURL('https://api.agent301.org/getTasks', 'POST', headers, {});
                    if (getTaskID.ok === true) {
                        for (const task of getTaskID.result.data) {
                            if (task.is_claimed === false) {
                                // Auto claim untuk setiap tugas
                                if (task.type === 'video') {
                                    // Loop klaim berdasarkan jumlah yang perlu diklaim
                                    for (let i = task.count; i < task.max_count; i++) {
                                        const claimTask = await getCURL(`https://api.agent301.org/completeTask`, 'POST', headers, { "type": task.type });
                                        
                                        if (claimTask.ok === true) {
                                            const getSaldo = await getCURL('https://api.agent301.org/getMe', 'POST', headers, {"referrer_id": 0});
                                            logMessage += `[#] CLAIM ${task.title} GET ${number(task.reward)} AP => CLAIM TASK: BERHASIL!! - ${number(getSaldo.result.balance)} AP\n`;
                                        } else {
                                            logMessage += `[#] CLAIM ${task.title} GET ${number(task.reward)} AP => CLAIM TASK: SKIPPED!!\n`;
                                            break; // Jika klaim gagal, keluar dari loop
                                        }
                                    }
                                } else {
                                    try {
                                        const claimTask = await getCURL(`https://api.agent301.org/completeTask`, 'POST', headers, { "type": task.type });
                                        
                                        if (claimTask.ok === true) {
                                            const getSaldo = await getCURL('https://api.agent301.org/getMe', 'POST', headers, {"referrer_id": 0});
                                            logMessage += `[#] CLAIM ${task.title} GET ${number(task.reward)} AP => CLAIM TASK: BERHASIL!! - ${number(getSaldo.result.balance)} AP\n`;
                                        } else {
                                            logMessage += `[#] CLAIM ${task.title} GET ${number(task.reward)} AP => CLAIM TASK: SKIPPED!!\n`;
                                        }
                                    } catch (error) {
                                        logMessage += `[!] ERROR CLAIMING TASK ${task.title}: ${error.message}\n`;
                                    }
                                }
                            }
                        }
                    // } else {
                    // }
                }else if (infoAkun.ok == false) {
                    logMessage += `[!] ERROR CLAIM TASKS: ${getTaskID.status}\n`;
                } else{
                    logMessage += `[!] ERROR GETTING TASKS: ${getTaskID.status}\n`;
                }
            }else{
                logMessage += `[x] TOKEN QUERY_ID MOKAD!!\n`;
            }
                console.log(logMessage);
            });
            await Promise.all(batchPromises);
        }
        console.log(`[${getCurrentTime()}] SEMUA AKUN BERHASIL DIPROSESS, DELAY 24 JAM...`);
        await delay(delayInput * 87000);
        console.clear();
        console.log(`[${getCurrentTime()}] MEMULAI AUTO CLAIM ${dataList.length} AKUN...\n`);
    }
})();

function getCurrentTime() {
    const now = new Date();
    const options = {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    const timeFormatter = new Intl.DateTimeFormat('en-GB', options);
    const timeParts = timeFormatter.formatToParts(now);

    const hours = timeParts.find(part => part.type === 'hour').value;
    const minutes = timeParts.find(part => part.type === 'minute').value;
    const seconds = timeParts.find(part => part.type === 'second').value;

    return `${hours}:${minutes}:${seconds}`;
}
