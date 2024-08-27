# AGENTS 301 BOT AUTO CLAIM

## TUTORIAL PEMAKAIAN | LINK BOT: [AGENTS BOT TELE](https://t.me/Agent301Bot/app?startapp=onetime1219868821)

### Cara Penggunaan:
1. **Paste Query**: 
   - Paste `Query_id` query Anda pada file `query.txt`.
   - Format file `query.txt` dimulai dengan `query_id=` diikuti oleh data header otorisasi.
   - Contoh:
     ```txt
     query_id=your_telegram_token_1
     query_id=your_telegram_token_2
     ```

2. **Buka CMD**: 
   - Masuk ke direktori tempat file `agents.py` berada. Misalnya:
     ```bash
     cd path/to/your/agents_bot_folder
     ```

3. **Jalankan Script**:
   - Jalankan perintah berikut untuk memulai bot:
     ```bash
     python agents.py
     ```
   - Jika Anda menggunakan Python 3, gunakan perintah ini:
     ```bash
     python3 agents.py
     ```

4. **Install Dependency**: 
   - Jika Anda baru pertama kali menginstall Python atau library, jalankan perintah berikut untuk menginstall library `requests` dan `fake_useragent`:
     ```bash
     pip install requests fake_useragent
     ```

5. **Auto Claim & Delay**:
   - Bot akan secara otomatis menjalankan klaim task setiap 24 jam.
   - Jika Anda ingin mengubah durasi delay, silakan edit nilai pada fungsi `time.sleep(86400)` di kode.

### Notes:
- Pastikan Anda sudah memasukkan query dengan benar pada `query.txt`.
- Setiap akun akan diproses secara berurutan, dan klaim task akan dilakukan secara otomatis.
- Script ini akan berjalan terus-menerus dengan interval 24 jam, sesuai dengan delay yang diatur dalam kode.
