/* SPOTITUT: pemutar dengan file audio sendiri, foto album, dan lirik tersinkron.
   Lagu/podcast unggahan disimpan di IndexedDB browser (tidak dikirim ke server).
   Lagu tren asli hanya ditampilkan judulnya; tambahkan file audio dan lirik milikmu sendiri. */
   const MAJ = [0, 2, 4, 7, 9], MIN = [0, 3, 5, 7, 10], STEPS = 16;
   const D = (id, title, artist, genre, bpm, wave, scale, base, drums, c, lines) =>
     ({ id, kind: 'synth', type: 'lagu', title, artist, genre, bpm, wave, scale, base, drums, c, lines });
   const DEMO = [
     D('d1', 'Hujan di Ujung Senja', 'Nara Biru (orisinal)', 'Pop', 96, 'triangle', MAJ, 64, false, ['#ff4d9d', '#c8f03c'],
       ['Hujan turun pelan di ujung senja', 'Kuingat tawamu yang dulu menyapa', 'Payung kecil kita masih tergantung', 'Di sudut kamar yang kini sunyi', 'Pulanglah sebentar, cukup satu lagu', 'Biar hujan tahu, aku masih menunggu']),
     D('d2', 'Kopi dan Rindu', 'Senar Sore (orisinal)', 'Indie', 84, 'sine', MAJ, 62, false, ['#ff9f1c', '#123268'],
       ['Secangkir kopi, uapnya menari', 'Gitar tua memetik cerita', 'Rindu diseduh pahit dan manis', 'Di beranda kita bicara tanpa kata', 'Biar waktu berjalan sesukanya', 'Asal kamu duduk di sampingku']),
     D('d3', 'Gas Pol Mimpi', 'Rima Kota (orisinal)', 'Hip-hop', 90, 'square', MIN, 55, true, ['#25d0ee', '#ff4d9d'],
       ['Dari gang sempit ke panggung besar', 'Tinta di buku jadi bait yang lantang', 'Tak punya modal, punya tekad', 'Setiap kata kutempa jadi senjata', 'Gas pol mimpi, jangan tarik rem', 'Dunia dengar, suaraku datang']),
     D('d4', 'Sinyal Hatimu', 'Lampu Kota (orisinal)', 'Elektronik', 110, 'sawtooth', MIN, 57, true, ['#7c3aed', '#25d0ee'],
       ['Lampu kota berkedip pelan', 'Pesanmu masuk di tengah malam', 'Satu centang biru, hatiku berdebar', 'Ketik, hapus, ketik lagi', 'Sinyal hatimu kutangkap jelas', 'Malam ini kita saling mengerti']),
     D('d5', 'Doa di Sepertiga Malam', 'Cahaya Fajar (orisinal)', 'Religi', 78, 'sine', MAJ, 64, false, ['#25d0ee', '#c8f03c'],
       ['Sepertiga malam, dunia terlelap', 'Kuangkat tangan, kubisikkan harap', 'Terima kasih untuk hari yang telah lewat', 'Tenangkan hati yang gelisah', 'Terangi langkah di esok pagi', 'Aku berserah, Engkau yang Maha Baik'])
   ];
   // Lagu tren: hanya judul/artis. Klik putar untuk menambahkan file audio dan lirik milikmu.
   const TREN = [['Teh Hijau', '—', 'Pop'], ['Berapa Kali Kita Akan Saling Memaafkan', 'Pamungkas', 'Indie'], ['Bulan Bintang, Garis Menyilang', 'Wijaya 80, Sal Priadi', 'Indie'],
     ['Jangan Paksa Rindu – Beda', 'Ifan Seventeen', 'Pop'], ['AKU GAS!', 'toxicdev!, PORIS', 'Hip-hop'], ["iqro'", 'Raim Laode', 'Religi'], ['Perunggu', '33x', 'Elektronik']]
     .map(([title, artist, genre], i) => ({ id: 't' + i, kind: 'none', type: 'lagu', title, artist, genre, tren: i + 1, c: [['#c8f03c', '#25d0ee'], ['#ff4d9d', '#7c3aed'], ['#ff9f1c', '#ff4d9d'], ['#25d0ee', '#7c3aed']][i % 4] }));
   const PODS = [
     ['p1', 'Kenapa Kita Susah Fokus?', 'Ruang Tenang', 'Edukasi', ['Halo, selamat datang di Ruang Tenang.', 'Hari ini kita bahas kenapa ponsel membuat kita susah fokus.', 'Setiap notifikasi memotong pikiran menjadi potongan kecil.', 'Coba matikan notifikasi selama satu jam dan rasakan bedanya.', 'Fokus itu seperti otot, makin dilatih makin kuat.', 'Terima kasih sudah mendengarkan, sampai jumpa di episode berikutnya.']],
     ['p2', 'Kecerdasan Buatan di Sekitar Kita', 'Kopi dan Kode', 'Teknologi', ['Selamat datang di Kopi dan Kode.', 'Tanpa sadar, kita memakai kecerdasan buatan setiap hari.', 'Mulai dari rekomendasi video sampai penerjemah otomatis.', 'Teknologi ini membantu, tapi tetap perlu kita periksa hasilnya.', 'Gunakan sebagai teman berpikir, bukan pengganti berpikir.', 'Sampai jumpa di obrolan berikutnya.']],
     ['p3', 'Cerita dari Warung Kopi Pinggir Jalan', 'Cerita Senja', 'Kisah', ['Sore itu hujan baru reda, dan warung kopi mulai ramai.', 'Seorang bapak tua bercerita tentang perjalanannya merantau puluhan tahun lalu.', 'Katanya, rumah bukan soal tempat, tapi soal siapa yang menunggu.', 'Kami semua terdiam, menghangatkan tangan di gelas masing-masing.', 'Kadang cerita paling berharga datang dari meja yang paling sederhana.', 'Terima kasih sudah singgah di Cerita Senja.']],
     ['p4', 'Kenapa Lagu Lama Terasa Enak?', 'Obrolan Santai', 'Hiburan', ['Hai, selamat datang di Obrolan Santai.', 'Pernah merasa lagu lama selalu terasa lebih enak?', 'Ternyata otak kita mengaitkan lagu dengan kenangan masa itu.', 'Satu nada saja bisa membawa kita kembali ke sekolah atau rumah lama.', 'Jadi, putar lagu favoritmu dan biarkan kenangan bicara.', 'Sampai ketemu lagi, jangan lupa tersenyum.']]
   ].map(([id, title, artist, genre, lines], i) => ({ id, kind: 'speech', type: 'podcast', title, artist, genre, lines, c: [['#ff9f1c', '#ff4d9d'], ['#25d0ee', '#7c3aed'], ['#c8f03c', '#25d0ee'], ['#ff4d9d', '#c8f03c']][i] }));
   const PAL = [['#c8f03c', '#25d0ee'], ['#ff4d9d', '#7c3aed'], ['#ff9f1c', '#ff4d9d'], ['#25d0ee', '#7c3aed']];
   const EMPTY = ['Lirik belum ditambahkan.', 'Klik "Edit lirik" untuk menempelkan lirik.'];
   
   const $ = s => document.querySelector(s);
   const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
   const st = { mode: null, genre: 'all', cur: null, upl: [], lyr: null, line: -2, sync: null, vol: 0.8, step: 0, pl: 0, tok: 0, timer: null, ctx: null, master: null, noise: null };
   const au = new Audio(); au.preload = 'metadata';
   
   /* ---------- Penyimpanan unggahan (IndexedDB) ---------- */
   const DB = {
     open: () => new Promise((res, rej) => { const r = indexedDB.open('spotitut', 1); r.onupgradeneeded = () => r.result.createObjectStore('tracks', { keyPath: 'id' }); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }),
     async run(mode, fn) { const db = await this.open(); return new Promise((res, rej) => { const tx = db.transaction('tracks', mode), q = fn(tx.objectStore('tracks')); tx.oncomplete = () => res(q && q.result); tx.onerror = () => rej(tx.error); }); },
     all() { return this.run('readonly', s => s.getAll()); },
     put(t) { return this.run('readwrite', s => s.put(t)); },
     del(id) { return this.run('readwrite', s => s.delete(id)); }
   };
   const mk = r => ({ ...r, kind: 'audio', upl: true, audioUrl: URL.createObjectURL(r.audio), coverUrl: r.cover ? URL.createObjectURL(r.cover) : null, c: PAL[r.title.length % 4] });
   DB.all().then(rs => { st.upl = rs.sort((a, b) => b.id.localeCompare(a.id)).map(mk); if (st.mode) { renderList(); } }).catch(() => {});
   
   /* ---------- Navigasi & login ---------- */
   function show(id) { document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === id)); window.scrollTo(0, 0); }
   try { $('#user').value = localStorage.getItem('spotitut_user') || ''; } catch (_) {}
   $('#loginForm').addEventListener('submit', e => {
     e.preventDefault();
     const u = $('#user').value.trim(), p = $('#pass').value;
     if (u.length < 3 || p.length < 4) { $('#err').textContent = 'Isi nama pengguna minimal 3 huruf dan kata sandi minimal 4 karakter.'; return; }
     $('#err').textContent = '';
     try { localStorage.setItem('spotitut_user', u); } catch (_) {}
     $('#hello').textContent = 'Halo, ' + u + '! Mau apa hari ini?';
     $('#pass').value = ''; show('menu');
   });
   document.querySelectorAll('.mode').forEach(b => b.addEventListener('click', () => {
     document.querySelectorAll('.mode').forEach(x => x.classList.toggle('sel', x === b));
     st.mode = b.dataset.mode; $('#menuNext').disabled = false;
   }));
   $('#menuBack').addEventListener('click', () => show('login'));
   $('#menuNext').addEventListener('click', () => openMusic(st.mode));
   $('#backBtn').addEventListener('click', () => { stop(); show('menu'); });
   $('#nextBtn').addEventListener('click', () => step(1, st.playing));
   
   /* ---------- Pustaka ---------- */
   function pool() {
     const pod = st.mode === 'podcast', up = st.upl.filter(u => (u.type === 'podcast') === pod);
     if (pod) return [...up, ...PODS];
     const have = new Set(st.upl.map(u => u.title.toLowerCase()));
     return [...up, ...TREN.filter(t => !have.has(t.title.toLowerCase())), ...DEMO];
   }
   const visible = () => pool().filter(t => st.genre === 'all' || t.genre === st.genre);
   function fillGenres() {
     const pod = st.mode === 'podcast', g = ['all', ...new Set(pool().map(s => s.genre))];
     $('#genre').innerHTML = g.map(x => `<option value="${esc(x)}">${x === 'all' ? (pod ? 'Semua kategori' : 'Semua genre') : esc(x)}</option>`).join('');
     $('#genreLbl').textContent = pod ? 'Kategori' : 'Genre'; st.genre = 'all';
   }
   $('#genre').addEventListener('change', e => { st.genre = e.target.value; renderList(); const l = visible(); if (l.length) load(l[0], false); });
   const thumbCss = t => t.coverUrl ? `background:center/cover url('${t.coverUrl}')` : `background:linear-gradient(135deg,${t.c[0]},${t.c[1]})`;
   function renderList() {
     const l = visible();
     $('#list').innerHTML = l.length ? l.map(t => `<li class="${st.cur === t ? 'on' : ''}" data-id="${t.id}"><button class="row"><span class="th" style="${thumbCss(t)}">${t.coverUrl ? '' : (st.mode === 'listen' && t.tren ? t.tren : '♪')}</span><span class="meta"><b>${esc(t.title)}</b><small>${esc(t.artist)}</small></span><span class="tag">${esc(t.genre)}</span></button>${t.upl ? '<button class="del" aria-label="Hapus">✕</button>' : ''}</li>`).join('') : '<li class="empty">Belum ada item. Klik Tambah.</li>';
   }
   $('#list').addEventListener('click', e => {
     const li = e.target.closest('li[data-id]'); if (!li) return;
     const t = pool().find(x => x.id === li.dataset.id); if (!t) return;
     if (e.target.closest('.del')) {
       if (!confirm('Hapus "' + t.title + '" dari pustaka?')) return;
       DB.del(t.id).catch(() => {}); try { localStorage.removeItem('lirik_' + t.id); } catch (_) {}
       st.upl = st.upl.filter(x => x !== t);
       if (st.cur === t) { stop(); fillGenres(); renderList(); const l = visible(); if (l.length) load(l[0], false); } else renderList();
     } else load(t, true);
   });
   function openMusic(mode) {
     stop(); $('#music').className = 'page active mode-' + mode;
     $('#musicTitle').textContent = { karaoke: '🎤 Karaoke', listen: '🎧 Dengar musik', podcast: '🎙️ Podcast' }[mode];
     fillGenres(); renderList(); const l = visible(); if (l.length) load(l[0], false); show('music');
   }
   
   /* ---------- Lirik: parse, sinkron ---------- */
   function rawLyrics(t) { let s = null; try { s = localStorage.getItem('lirik_' + t.id); } catch (_) {} return s || (t.lines ? t.lines.join('\n') : ''); }
   function parseLyr(raw) {
     const rows = [];
     raw.split('\n').map(x => x.trim()).filter(Boolean).forEach(r => {
       const m = r.match(/^\[(\d+):(\d+(?:\.\d+)?)\]\s*(.*)$/);
       if (m) { if (m[3]) rows.push({ t: +m[1] * 60 + +m[2], x: m[3] }); } else if (!/^\[[a-z]+:/i.test(r)) rows.push({ t: null, x: r });
     });
     if (!rows.length) return { lines: EMPTY, times: null, empty: true };
     const timed = rows.filter(r => r.t !== null).length >= rows.length / 2;
     const use = timed ? rows.filter(r => r.t !== null).sort((a, b) => a.t - b.t) : rows;
     return { lines: use.map(r => r.x), times: timed ? use.map(r => r.t) : null, empty: false };
   }
   const dur = () => st.cur.kind === 'audio' ? (au.duration || 0) : st.cur.kind === 'synth' ? st.lyr.lines.length * STEPS * 30 / st.cur.bpm : 0;
   function starts() { const L = st.lyr; if (L.empty || st.cur.kind !== 'audio') return null; if (L.times) return L.times; const d = au.duration; return d ? L.lines.map((_, i) => i * d / L.lines.length) : null; }
   function lineAt(t) { const ts = starts(); if (!ts) return -1; let k = -1; for (let i = 0; i < ts.length && ts[i] <= t; i++) k = i; return k; }
   function renderLyrics() { $('#lyrics').innerHTML = st.lyr.lines.map((t, i) => `<p class="ln" data-i="${i}">${esc(t)}</p>`).join(''); st.line = -2; }
   function setLine(i, t = 0) {
     st.line = i;
     const ps = document.querySelectorAll('.ln'), p = ps[i];
     ps.forEach((x, k) => x.classList.toggle('on', k === i && !st.lyr.empty));
     if (!p || st.lyr.empty) return;
     const ts = starts(); let d;
     if (ts) d = (ts[i + 1] !== undefined ? ts[i + 1] : (au.duration || ts[i] + 5)) - ts[i];
     else d = st.cur.kind === 'synth' ? STEPS * 30 / st.cur.bpm : Math.max(1.5, p.textContent.length * 0.075);
     p.style.setProperty('--dur', Math.max(d, 0.5) + 's');
     p.style.setProperty('--dl', -(ts ? Math.max(0, t - ts[i]) : 0) + 's');
     p.classList.remove('on'); void p.offsetWidth; p.classList.add('on');
     const box = $('#lyrics'); box.scrollTo({ top: p.offsetTop - box.clientHeight / 2 + p.clientHeight / 2, behavior: 'smooth' });
   }
   $('#lyrics').addEventListener('click', e => {
     const p = e.target.closest('.ln'), ts = starts(); if (p && ts) au.currentTime = ts[+p.dataset.i];
   });
   
   /* ---------- Muat lagu & tampilan ---------- */
   function load(t, auto) {
     stop(); st.cur = t; st.lyr = parseLyr(rawLyrics(t)); st.sync = null; $('#syncBar').hidden = true;
     const art = $('#art'); art.style.cssText = thumbCss(t); art.textContent = t.coverUrl ? '' : '♪';
     $('#thumb').style.cssText = thumbCss(t);
     $('#sTitle').textContent = t.title; $('#sArtist').textContent = t.artist + ' · ' + t.genre;
     $('#pTitle').textContent = t.title; $('#pArtist').textContent = t.artist;
     $('#syncBtn').style.display = t.kind === 'audio' ? '' : 'none';
     $('#lyrBtn').style.display = t.kind === 'none' || t.kind === 'speech' && !t.upl ? 'none' : '';
     $('#seek').disabled = t.kind !== 'audio';
     if (t.kind === 'audio') { au.src = t.audioUrl; } else { au.removeAttribute('src'); }
     renderLyrics(); if (t.kind === 'none') $('#lyrics').innerHTML = '<p class="ln">Belum ada file audio untuk lagu ini.</p><p class="ln">Tekan tombol putar untuk menambahkan audio dan liriknya.</p>';
     $('#tCur').textContent = '0:00'; $('#tDur').textContent = t.kind === 'synth' ? fmt(dur()) : '0:00';
     document.querySelectorAll('#list li').forEach(li => li.classList.toggle('on', li.dataset.id === t.id));
     if (auto) play();
   }
   function step(dir, auto) {
     const l = visible(), i = l.indexOf(st.cur); if (!l.length) return;
     if (l.length < 2 && auto) { load(st.cur, false); return; }
     load(l[(i + dir + l.length) % l.length], auto);
   }
   const fmt = s => { s = Math.max(0, s | 0); return (s / 60 | 0) + ':' + String(s % 60).padStart(2, '0'); };
   const lrcT = s => String(s / 60 | 0).padStart(2, '0') + ':' + (s % 60).toFixed(2).padStart(5, '0');
   function ui(p) { st.playing = p; $('#playBtn').textContent = p ? '❚❚' : '▶'; $('#music').classList.toggle('playing', p); $('#music').classList.toggle('paused', !p); }
   function updateTime(t, d) { $('#tCur').textContent = fmt(t); $('#tDur').textContent = fmt(d); $('#seek').value = d ? t / d * 1000 : 0; }
   
   /* ---------- Kontrol ---------- */
   $('#playBtn').addEventListener('click', () => (st.playing ? pause() : play()));
   $('#nxtBtn').addEventListener('click', () => step(1, st.playing));
   $('#prevBtn').addEventListener('click', () => { if (st.cur.kind === 'audio' && au.currentTime > 3) au.currentTime = 0; else step(-1, st.playing); });
   $('#seek').addEventListener('input', e => { if (st.cur.kind === 'audio' && au.duration) au.currentTime = e.target.value / 1000 * au.duration; });
   $('#vol').addEventListener('input', e => { st.vol = e.target.value / 100; au.volume = st.vol; if (st.master) st.master.gain.value = st.vol; });
   au.volume = st.vol;
   function play() {
     const t = st.cur; if (!t) return;
     if (t.kind === 'none') { openAdd(t); return; }
     if (t.kind === 'audio') { au.play().catch(() => {}); return; }
     audio(); ui(true);
     if (t.kind === 'speech') { speakFrom(st.pl); return; }
     clearInterval(st.timer); st.timer = setInterval(tick, 30000 / t.bpm);
   }
   function pause() {
     if (st.cur.kind === 'audio') { au.pause(); return; }
     st.tok++; if ('speechSynthesis' in window) speechSynthesis.cancel(); clearInterval(st.timer); ui(false);
   }
   function stop() {
     st.tok++; st.pl = 0; st.step = 0; clearInterval(st.timer); st.sync = null;
     if ('speechSynthesis' in window) speechSynthesis.cancel();
     try { au.pause(); if (au.getAttribute('src')) au.currentTime = 0; } catch (_) {}
     ui(false); updateTime(0, 0);
   }
   au.addEventListener('play', () => ui(true));
   au.addEventListener('pause', () => ui(false));
   au.addEventListener('ended', () => step(1, true));
   au.addEventListener('loadedmetadata', () => { if (st.cur && st.cur.kind === 'audio') { updateTime(au.currentTime, au.duration); st.line = -2; } });
   au.addEventListener('seeked', () => { st.line = -2; au.dispatchEvent(new Event('timeupdate')); });
   au.addEventListener('timeupdate', () => {
     if (!st.cur || st.cur.kind !== 'audio') return;
     const t = au.currentTime, i = lineAt(t);
     if (i !== st.line) setLine(i, t);
     updateTime(t, au.duration || 0);
   });
   
   /* ---------- Mesin lagu contoh (sintesis) ---------- */
   function audio() {
     if (!st.ctx) {
       st.ctx = new (window.AudioContext || window.webkitAudioContext)();
       st.master = st.ctx.createGain(); st.master.gain.value = st.vol; st.master.connect(st.ctx.destination);
       const n = st.ctx.createBuffer(1, st.ctx.sampleRate * 0.1, st.ctx.sampleRate), d = n.getChannelData(0);
       for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
       st.noise = n;
     }
     if (st.ctx.state === 'suspended') st.ctx.resume();
     return st.ctx;
   }
   function tone(m, d, type, vol) {
     const c = audio(), o = c.createOscillator(), g = c.createGain(), t = c.currentTime;
     o.type = type; o.frequency.value = 440 * Math.pow(2, (m - 69) / 12);
     g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
     o.connect(g).connect(st.master); o.start(t); o.stop(t + d);
   }
   function kick() {
     const c = audio(), o = c.createOscillator(), g = c.createGain(), t = c.currentTime;
     o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.15);
     g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
     o.connect(g).connect(st.master); o.start(t); o.stop(t + 0.2);
   }
   function hat() {
     const c = audio(), s = c.createBufferSource(), g = c.createGain(), f = c.createBiquadFilter(), t = c.currentTime;
     s.buffer = st.noise; f.type = 'highpass'; f.frequency.value = 7000;
     g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
     s.connect(f).connect(g).connect(st.master); s.start(t);
   }
   function tick() {
     const s = st.cur, n = st.lyr.lines.length, line = Math.floor(st.step / STEPS), sc = s.scale, k = st.step;
     if (line >= n) { step(1, true); return; }
     if (k % STEPS === 0) setLine(line);
     if (k % 2 === 0 || k % 5 === 0) tone(s.base + 12 + sc[(k * 3 + line * 2 + (k >> 2)) % 5], 0.35, s.wave, 0.09);
     if (k % 4 === 0) tone(s.base - 12 + sc[[0, 2, 3, 1][(k >> 3) % 4]], 0.5, 'triangle', 0.16);
     if (s.drums) { if (k % 4 === 0) kick(); if (k % 2 === 1) hat(); }
     st.step++; updateTime(k * 30 / s.bpm, dur());
   }
   
   /* ---------- Podcast contoh (suara browser) ---------- */
   function speakFrom(i) {
     if (!st.playing) return;
     const n = st.lyr.lines.length;
     if (i >= n) { step(1, true); return; }
     st.pl = i; setLine(i);
     $('#tCur').textContent = (i + 1) + ''; $('#tDur').textContent = n + ''; $('#seek').value = i / n * 1000;
     const tok = ++st.tok, next = () => { if (st.playing && tok === st.tok) speakFrom(i + 1); };
     if (!('speechSynthesis' in window)) { setTimeout(next, 3500); return; }
     const u = new SpeechSynthesisUtterance(st.lyr.lines[i]);
     u.lang = 'id-ID'; u.rate = 0.95; u.volume = st.vol; u.onend = next; u.onerror = next;
     speechSynthesis.speak(u);
   }
   
   /* ---------- Tambah lagu / podcast ---------- */
   const readInto = (inp, ta) => inp.addEventListener('change', () => { const f = inp.files[0]; if (f) f.text().then(x => { ta.value = x; }); });
   readInto($('#fLrc'), $('#fLyr')); readInto($('#lyrFile'), $('#lyrArea'));
   function openAdd(pre) {
     const pod = st.mode === 'podcast';
     $('#addHead').textContent = pre ? 'Tambah audio: ' + pre.title : (pod ? 'Tambah podcast' : 'Tambah lagu');
     $('#addSub').textContent = 'Akan masuk ke ' + (pod ? 'Podcast' : 'Karaoke dan Dengar musik') + '. File hanya disimpan di browser ini.';
     $('#fTitle').value = pre ? pre.title : ''; $('#fArtist').value = pre && pre.artist !== '—' ? pre.artist : '';
     $('#fGenre').value = pre ? pre.genre : ''; ['#fAudio', '#fCover', '#fLrc'].forEach(s => { $(s).value = ''; });
     $('#fLyr').value = ''; $('#addErr').textContent = ''; $('#addDlg').showModal();
   }
   $('#addBtn').addEventListener('click', () => openAdd(null));
   $('#addCancel').addEventListener('click', () => $('#addDlg').close());
   $('#addSave').addEventListener('click', async () => {
     const f = $('#fAudio').files[0];
     if (!f) { $('#addErr').textContent = 'Pilih file audio dulu (mp3, wav, m4a, atau ogg).'; return; }
     const rec = { id: 'u' + Date.now(), type: st.mode === 'podcast' ? 'podcast' : 'lagu', title: $('#fTitle').value.trim() || f.name.replace(/\.[^.]+$/, ''),
       artist: $('#fArtist').value.trim() || 'Tanpa artis', genre: $('#fGenre').value.trim() || 'Lainnya', audio: f, cover: $('#fCover').files[0] || null };
     let saved = true; try { await DB.put(rec); } catch (_) { saved = false; }
     const t = mk(rec); st.upl.unshift(t);
     const ly = $('#fLyr').value.trim(); if (ly) { try { localStorage.setItem('lirik_' + t.id, ly); } catch (_) {} }
     $('#addDlg').close();
     if (!saved) alert('Browser ini tidak mengizinkan penyimpanan permanen. Lagu tetap bisa diputar sampai halaman ditutup.');
     fillGenres(); renderList(); load(t, true);
   });
   
   /* ---------- Edit lirik, cari lirik, sinkron ---------- */
   $('#findBtn').addEventListener('click', () => {
     const q = encodeURIComponent('lirik ' + st.cur.title + ' ' + (st.cur.artist === '—' ? '' : st.cur.artist));
     window.open('https://www.google.com/search?q=' + q, '_blank', 'noopener');
   });
   $('#lyrBtn').addEventListener('click', () => { $('#lyrName').textContent = st.cur.title; $('#lyrArea').value = rawLyrics(st.cur); $('#lyrDlg').showModal(); });
   $('#lyrCancel').addEventListener('click', () => $('#lyrDlg').close());
   $('#lyrSave').addEventListener('click', () => {
     const v = $('#lyrArea').value.trim();
     try { v ? localStorage.setItem('lirik_' + st.cur.id, v) : localStorage.removeItem('lirik_' + st.cur.id); } catch (_) {}
     $('#lyrDlg').close(); st.lyr = parseLyr(rawLyrics(st.cur)); renderLyrics();
   });
   function markNext() { document.querySelectorAll('.ln').forEach((p, k) => p.classList.toggle('next', !!st.sync && k === st.sync.i)); const p = document.querySelectorAll('.ln')[st.sync && st.sync.i]; if (p) { const b = $('#lyrics'); b.scrollTo({ top: p.offsetTop - b.clientHeight / 2, behavior: 'smooth' }); } }
   function endSync() { st.sync = null; $('#syncBar').hidden = true; markNext(); }
   $('#syncBtn').addEventListener('click', () => {
     if (st.lyr.empty) { alert('Tempel lirik dulu lewat tombol Edit lirik.'); return; }
     st.sync = { i: 0, stamps: [] }; $('#syncBar').hidden = false; au.currentTime = 0; au.play().catch(() => {}); markNext();
   });
   $('#syncCancel').addEventListener('click', endSync);
   $('#tapBtn').addEventListener('click', () => {
     if (!st.sync) return;
     st.sync.stamps.push(au.currentTime); st.sync.i++;
     if (st.sync.i >= st.lyr.lines.length) {
       const lrc = st.lyr.lines.map((l, k) => `[${lrcT(st.sync.stamps[k])}] ${l}`).join('\n');
       try { localStorage.setItem('lirik_' + st.cur.id, lrc); } catch (_) {}
       endSync(); st.lyr = parseLyr(rawLyrics(st.cur)); renderLyrics();
     } else markNext();
   });
   
   /* ---------- Hiasan latar ---------- */
   (function () {
     const bg = $('.bg'), sym = ['♪', '♫', '♬', '♩', '✦', '●'];
     for (let i = 0; i < 14; i++) {
       const s = document.createElement('span');
       s.className = 'note'; s.textContent = sym[i % sym.length];
       s.style.cssText = `--x:${(i * 71) % 100}%;--s:${1.2 + (i % 4) * 0.7}rem;--d:${14 + (i % 5) * 4}s;--l:${-i * 2.3}s;--h:${[75, 190, 330, 30][i % 4]}`;
       bg.appendChild(s);
     }
   })();