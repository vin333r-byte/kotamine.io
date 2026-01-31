// filepath: c:\Users\Admin\Desktop\www\script.js
// Полностью рабочая, исправленная версия script.js — фикс синтаксиса, вкладки Achievements/Account, много пасхалок/достижений.
// Сохраните файл и обновите страницу (F5). Если остаются ошибки — пришлите текст консоли (F12 → Console).

(function () {
  'use strict';

  // ===== DATA (audio + video) =====
  const songs = [
    { title: "One punch man - THE HERO! (English Dub)", artist: "Sam Luff", src: "MusiC/[English Dub]One punch man _THE HERO!_ Full ver. [Sam Luff] - Studio yuraki.mp3" },
    { title: "Like Flames (Nightcore) - MindaRyn", artist: "MindaRyn", src: "MusiC/[Nightcore] Like Flames - MindaRyn {That Time I Got Reincarnated as a Slime Season 2 OP}(ENGver).mp3" },
    { title: "Bling-Bang-Bang-Born", artist: "", src: "MusiC/Bling-Bang-Bang-Born (Official Music Video).mp3" },
    { title: "The Rising Of The Shield Hero Op2 (FULL)", artist: "MADKID", src: "MusiC/The Rising Of The Shield Hero_ Season 1 _ Op 2 ● Opening FULL _ FAITH ✦ MADKID.mp3" },
    { title: "Tokyo Ghoul - Unravel", artist: "", src: "MusiC/Tokyo Ghoul Opening  Unravel.mp3" },
    { title: "Chainsaw Man - KICK BACK", artist: "米津玄師", src: "MusiC/チェンソーマンノンクレジットオープニング  CHAINSAW MAN  Opening米津玄師 KICK BACK.mp3" },
    { title: "Cooked - The Grey Room", artist: "Golden Palms", src: "My music/Cooked - The Grey Room _ Golden Palms.mp3" },
    { title: "Pawn - The Grey Room", artist: "Golden Palms", src: "My music/Pawn - The Grey Room _ Golden Palms.mp3" },
    { title: "Purple Desire - The Grey Room", artist: "Clark Sims", src: "My music/Purple Desire - The Grey Room _ Clark Sims.mp3" },
    { title: "Soaring - The Grey Room", artist: "Golden Palms", src: "My music/Soaring - The Grey Room _ Golden Palms.mp3" },
    { title: "Twinkle - The Grey Room", artist: "Density & Time", src: "My music/Twinkle - The Grey Room _ Density & Time.mp3" }
  ];

  const localVideos = [
    { title: "Chainsaw Man - KICK BACK", file: "Video/_CHAINSAW MAN  Opening│米津玄師 「KICK BACK」.mp4" },
    { title: "Kaguya-sama Opening", file: "Video/_Kaguya-sama_ Love Is War__ Opening Theme (Limited Time Only).mp4" },
    { title: "Creepy Nuts MV", file: "Video/【MV】Creepy Nuts - ちゅだい.mp4" },
    { title: "Oshi YOASOBI", file: "Video/【推しの子】ノンクレジットオープニング｜YOASOBI「アイドル」.mp4" },
    { title: "Oshi GEMN", file: "Video/【推しの子】第2期ノンクレジットオープニング｜GEMN「ファタール」.mp4" },
    { title: "Blend S Opening", file: "Video/Blend S Opening in 4K 120FPS.mp4" },
    { title: "Dr. STONE Opening", file: "Video/Dr. STONE SCIENCE FUTURE - Opening _ CASANOVA POSSE.mp4" },
    { title: "Fly me to the Moon OP", file: "Video/Fly me to the Moon OP (Tonikaku Kawaii).mp4" },
    { title: "Hell's Paradise", file: "Video/Hell's Paradise - Opening _ Work.mp4" },
    { title: "Tokyo Ghoul - Unravel", file: "Video/Tokyo Ghoul Opening _ Unravel.mp4" },
    { title: "OxT grayscale dominator", file: "Video/TVアニメ「陰の実力者になりたくて！ 2nd season」 ノンクレジットオープニング：OxT「grayscale dominator」.mp4" },
    { title: "Oshi TEST ME", file: "Video/推しの子第3期ノンクレジットオープニングちゃんみなTEST ME.mp4" }
  ];

  // ===== DOM helpers & safe element creation =====
  const $ = id => document.getElementById(id);
  const createIfMissing = () => {
    // ensure header nav buttons and views exist (some index.html variants may be minimal)
    const header = document.querySelector('.header') || (() => {
      const h = document.createElement('header'); h.className = 'header'; h.innerHTML = `<div class="logo">MediaHub</div><nav class="nav"></nav><div class="header-right"></div>`; document.body.prepend(h); return h;
    })();

    const nav = header.querySelector('.nav');
    const ensureBtn = (id, text) => {
      if (!$(id)) {
        const b = document.createElement('button');
        b.id = id;
        b.className = 'nav-link';
        b.textContent = text;
        nav.appendChild(b);
      }
    };
    ensureBtn('tab-music','Music');
    ensureBtn('tab-anime','Anime');
    ensureBtn('tab-videos','Videos');
    ensureBtn('tab-achievements','Achievements');
    ensureBtn('tab-account','Account');

    const main = document.querySelector('.main') || (() => {
      const m = document.createElement('main'); m.className = 'main'; document.querySelector('.layout')?.appendChild(m) || document.body.appendChild(m); return m;
    })();

    const ensureSection = (id, title) => {
      if (!$(id)) {
        const s = document.createElement('section');
        s.id = id;
        s.className = 'cards-section';
        s.hidden = true;
        s.innerHTML = `<h2>${title}</h2><div id="${id}-content"></div>`;
        main.appendChild(s);
      }
    };
    ensureSection('music-view','Music');
    ensureSection('anime-view','Anime');
    ensureSection('video-view','Videos');
    ensureSection('achievements-view','Achievements');
    ensureSection('account-view','Account');

    // minimal player and audio element
    if (!$('audio')) {
      const audioEl = document.createElement('audio'); audioEl.id = 'audio'; audioEl.preload = 'metadata'; document.body.appendChild(audioEl);
    }
    // modal
    if (!$('modal')) {
      const modal = document.createElement('div'); modal.id = 'modal'; modal.className = 'modal'; modal.hidden = true;
      modal.innerHTML = `<div class="modal-content"><button id="close-modal" class="btn ghost">Close</button><div id="modal-body"></div></div>`;
      document.body.appendChild(modal);
    }
    // cards containers
    if (!$('cards')) {
      const c = document.createElement('div'); c.id = 'cards'; c.className = 'cards-grid'; $('music-view')?.appendChild(c);
    }
    if (!$('anime-list')) { const c = document.createElement('div'); c.id = 'anime-list'; $('anime-view')?.appendChild(c); }
    if (!$('video-list')) { const c = document.createElement('div'); c.id = 'video-list'; $('video-view')?.appendChild(c); }
    if (!$('achievements-list')) { const c = document.createElement('div'); c.id = 'achievements-list'; $('achievements-view')?.appendChild(c); }
    if (!$('account-box')) {
      const box = document.createElement('div'); box.id = 'account-box'; box.innerHTML = `<div id="account-username">Не вошли</div><div id="account-stats">Достижений: 0</div><input id="account-username-input" placeholder="Имя"/><button id="account-login-btn">Войти</button><button id="account-logout-btn">Выйти</button><div id="account-achievements"></div>`;
      $('account-view')?.appendChild(box);
    }
  };

  createIfMissing();

  // elements (now likely present)
  const audio = $('audio');
  const cardsContainer = $('cards');
  const playBtn = $('play');
  const prevBtn = $('prev');
  const nextBtn = $('next');
  const progress = $('progress');
  const progressFilled = $('progress-filled');
  const currentTimeEl = $('current-time');
  const durationEl = $('duration');
  const volume = $('volume');
  const trackTitle = $('track-title');
  const trackArtist = $('track-artist');
  const playIcon = $('play-icon');
  const tabMusic = $('tab-music');
  const tabAnime = $('tab-anime');
  const tabVideos = $('tab-videos');
  const tabAchievements = $('tab-achievements');
  const tabAccount = $('tab-account');
  const animeListEl = $('anime-list');
  const videoListEl = $('video-list');
  const modal = $('modal');
  const modalBody = $('modal-body');
  const closeModalBtn = $('close-modal');
  const searchInput = $('search') || (function(){ const el=document.createElement('input'); el.id='search'; el.className='search'; el.placeholder='Search'; document.querySelector('.header-right')?.appendChild(el); return el; })();
  const progressTooltip = $('progress-tooltip');
  const queueListEl = $('queue-list');

  // state
  let currentIndex = 0;
  let isPlaying = false;
  let cards = [];
  let favorites = loadFavorites();
  let shuffle = false;
  let repeatMode = 'off';
  let queue = [];

  // utilities
  function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
  function encodePath(p){ try{return encodeURI(p);}catch(e){return p;} }
  function toast(msg, ms=1400){ const d=document.createElement('div'); d.className='toast'; d.textContent=msg; document.body.appendChild(d); requestAnimationFrame(()=>d.classList.add('show')); setTimeout(()=>{d.classList.remove('show'); setTimeout(()=>d.remove(),300);},ms); }

  // favorites persistence
  function loadFavorites(){ try{return JSON.parse(localStorage.getItem('mh_favorites')||'[]');}catch(e){return [];} }
  function saveFavorites(){ localStorage.setItem('mh_favorites', JSON.stringify(favorites)); }

  // Playlist / favorites helpers (added) -----------------------
  function renderQueue(){
    if (!queueListEl) return;
    queueListEl.innerHTML = '';
    queue.forEach((src, i) => {
      const s = songs.find(x => x.src === src) || { title: src };
      const li = document.createElement('li');
      li.textContent = s.title || src;
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => {
        const idx = songs.findIndex(x => x.src === src);
        if (idx >= 0) loadSong(idx, true);
        queue.splice(i,1);
        renderQueue();
      });
      queueListEl.appendChild(li);
    });
  }

  function addToQueue(src){
    if (!src) return;
    queue.push(src);
    toast('Добавлено в очередь');
    renderQueue();
  }

  function toggleFavorite(src, cardEl){
    if (!src) return;
    const ix = favorites.indexOf(src);
    if (ix === -1) favorites.push(src);
    else favorites.splice(ix,1);
    saveFavorites();
    // update UI button state if card provided
    if (cardEl){
      const btn = cardEl.querySelector('.fav');
      if (btn) btn.classList.toggle('active', favorites.includes(src));
    }
    // refresh cards list so favorites view updates
    renderCards(searchInput?.value?.trim() || '');
    toast(favorites.includes(src) ? 'Добавлено в избранное' : 'Удалено из избранного');
  }
  // --------------------------------------------------------------

  // render cards (music)
  function renderCards(filter=''){
    if (!cardsContainer) return;
    cardsContainer.innerHTML='';
    cards=[];
    const q=(filter||'').toLowerCase();
    const filtered = songs.filter(s => !q || (s.title+' '+(s.artist||'')).toLowerCase().includes(q));
    filtered.forEach(s=>{
      const idx = songs.indexOf(s);
      const el = document.createElement('div'); el.className='card'; el.dataset.index = idx;
      el.innerHTML = `<div class="title">${escapeHtml(s.title)}</div><div class="artist">${escapeHtml(s.artist||'')}</div><button class="fav ${favorites.includes(s.src)?'active':''}">★</button>`;
      el.addEventListener('click', e=>{ if (e.target && e.target.classList.contains('fav')) return; loadSong(idx,true); });
      const favBtn = el.querySelector('.fav'); favBtn && favBtn.addEventListener('click', ev=>{ ev.stopPropagation(); toggleFavorite(s.src, el); });
      cardsContainer.appendChild(el); cards.push(el);
    });
  }

  // render anime/video lists
  function renderAnime(){ if (!animeListEl) return; animeListEl.innerHTML=''; const catalog = [{title:'Oshi no Ko', video: findVideoByPattern('推しの子')},{title:"OxT", video:findVideoByPattern('grayscale')}]; catalog.forEach(a=>{ const el=document.createElement('div'); el.className='anime-card'; el.innerHTML=`<div class="anime-title">${escapeHtml(a.title)}</div>`; el.addEventListener('click', ()=> a.video ? openVideoModal(a.video,a.title) : toast('Video not found')); animeListEl.appendChild(el); }); }
  function renderLocalVideos(){
    if (!videoListEl) return;
    videoListEl.innerHTML = '';

    // Собираем кандидатов: явные локальные видео + mp4 в songs (если есть)
    const candidates = [];
    (localVideos || []).forEach(v => {
      if (v && v.file) candidates.push({ title: v.title || v.file.split('/').pop(), file: v.file });
    });
    (songs || []).forEach(s => {
      const src = (s.src || '').toString();
      if (src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.webm')) {
        candidates.push({ title: s.title || src.split('/').pop(), file: src });
      }
    });

    if (candidates.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'card';
      empty.style.padding = '18px';
      empty.textContent = 'Видео не найдены в папках Video / My music.';
      videoListEl.appendChild(empty);
      return;
    }

    candidates.forEach(v => {
      const el = document.createElement('div');
      el.className = 'anime-card';
      el.innerHTML = `
        <div class="anime-info" style="padding:12px;">
          <div class="anime-title" title="${escapeHtml(v.title)}">${escapeHtml(v.title)}</div>
          <div class="anime-meta" style="margin-top:6px;">Local file</div>
        </div>`;
      el.addEventListener('click', () => {
        openVideoModal(v.file, v.title || v.file);
      });
      videoListEl.appendChild(el);
    });
  }

  // player functions
  function loadSong(index, autoplay=false){
    if (!audio) return;
    if (index<0 || index>=songs.length) return;
    currentIndex = index;
    const s = songs[index];
    audio.src = encodePath(s.src);
    if (trackTitle) trackTitle.textContent = s.title;
    if (trackArtist) trackArtist.textContent = s.artist||'';
    if (autoplay) play();
  }
  function play(){ if (!audio) return; audio.play().then(()=>{ isPlaying=true; }).catch(e=>{ console.warn(e); toast('Play blocked or file missing'); }); }
  function pause(){ if (!audio) return; audio.pause(); isPlaying=false; }
  function togglePlay(){ isPlaying ? pause() : play(); }
  function next(){ loadSong((currentIndex+1)%songs.length, true); }
  function prev(){ loadSong((currentIndex-1+songs.length)%songs.length, true); }

  // basic events
  if (playBtn) playBtn.addEventListener('click', togglePlay);
  window.addEventListener('keydown', e => { if (e.code==='Space' && document.activeElement && document.activeElement.tagName!=='INPUT'){ e.preventDefault(); togglePlay(); } if (e.code==='ArrowRight') next(); if (e.code==='ArrowLeft') prev(); });

  // modal
  function openVideoModal(src, title){
    if (!modal || !modalBody) return;
    modalBody.innerHTML = `<div style="font-weight:700;margin-bottom:8px;">${escapeHtml(title)}</div><video id="modal-video" src="${encodePath(src)}" controls autoplay style="width:100%;max-height:70vh;"></video>`;
    modal.hidden = false; document.body.style.overflow='hidden';
  }
  function closeModal(){ if (!modal) return; const mv=document.getElementById('modal-video'); if (mv){ try{ mv.pause(); mv.src=''; }catch{} } modal.hidden=true; document.body.style.overflow=''; }
  closeModalBtn && closeModalBtn.addEventListener('click', closeModal);
  modal && modal.addEventListener('click', e=> { if (e.target === modal) closeModal(); });

  // search / eggs
  const eggMap = [
    { keysExact: ['i am atomic','the rising of the shield hero','восхождение в тени'], action: triggerShieldEgg },
    { keysExact: ['oshi no ko','推しの子','оши'], action: triggerOshiEgg },
    { keysExact: ['1000-7','1000 - 7','1000 7'], action: triggerTokyoGhoulEgg },
    { keysExact: ['saitama','one punch'], action: triggerSaitamaEgg },
    { keysExact: ['hells paradise','地獄楽'], action: triggerHellsEgg }
  ];

  if (searchInput){
    searchInput.addEventListener('keydown', e=>{ if (e.key==='Enter') checkSearchEggs(true); });
    searchInput.addEventListener('input', ()=> checkSearchEggs(false));
  }
  function normalize(s){ return (s||'').trim().toLowerCase(); }
  function checkSearchEggs(onEnter){
    const v = normalize(searchInput?.value);
    if (!v) return;
    for (const item of eggMap) for (const k of item.keysExact) if (v === normalize(k)) { item.action(); return; }
    if (onEnter){
      if (v.includes('1000') && v.includes('7')) { triggerTokyoGhoulEgg(); return; }
      if (v.includes('oshi')) { triggerOshiEgg(); return; }
      if (v.includes('shield') || v.includes('rising')) { triggerShieldEgg(); return; }
    }
    // also filter cards
    renderCards(v);
  }

  function findVideoByPattern(pat){
    if (!pat) return null;
    const k = pat.toLowerCase();
    const found = localVideos.find(v => ((v.file||'').toLowerCase().includes(k)) || ((v.title||'').toLowerCase().includes(k)));
    return found ? found.file : null;
  }

  // egg actions
  function triggerShieldEgg(){
    const target = findVideoByPattern('grayscale dominator') || findVideoByPattern('陰の実力者') || findVideoByPattern('grayscale') || findVideoByPattern('oxt');
    if (target){ openVideoModal(target, 'OxT — grayscale dominator'); unlockAchievement('shield-hero'); return; }
    const secret = songs.find(s => /shield hero|rising/i.test(s.title));
    if (secret){ audio.src = encodePath(secret.src); audio.play().catch(()=>{}); openAudioEggModal('Shield Hero — audio'); unlockAchievement('shield-hero'); return; }
    toast('Shield Hero file not found.');
  }
  function triggerOshiEgg(){
    const candidates = ['test me','ちゃんみなtest','推しの子'];
    let t=null;
    for (const c of candidates) { t = findVideoByPattern(c); if (t) break; }
    if (t){ openVideoModal(t, 'Oshi no Ko'); unlockAchievement('oshifan'); } else toast('Oshi video not found.');
  }
  function triggerHellsEgg(){
    const t = findVideoByPattern("hell's paradise") || findVideoByPattern('地獄楽') || findVideoByPattern('hell');
    if (t){ openVideoModal(t, "Hell's Paradise"); unlockAchievement('hells-paradise'); } else toast('Hell\'s Paradise not found.');
  }
  function triggerSaitamaEgg(){
    const s = songs.find(x => /one punch|saitama|the hero/i.test(x.title));
    if (s){ audio.src = encodePath(s.src); audio.play().catch(()=>{}); openAudioEggModal('Saitama — audio'); unlockAchievement('saitama'); } else toast('Saitama track not found.');
  }
  function triggerTokyoGhoulEgg(){
    const t = findVideoByPattern('tokyo ghoul') || findVideoByPattern('unravel');
    if (t){ openVideoModal(t, 'Tokyo Ghoul — Unravel'); unlockAchievement('tokyo-ghoul'); return; }
    const s = songs.find(x => /tokyo ghoul|unravel/i.test(x.title));
    if (s){ audio.src = encodePath(s.src); audio.play().catch(()=>{}); openAudioEggModal('Tokyo Ghoul — audio'); unlockAchievement('tokyo-ghoul'); return; }
    toast('Tokyo Ghoul file not found.');
  }
  function openAudioEggModal(title){ if (!modal || !modalBody) return; modalBody.innerHTML = `<div style="text-align:center"><h2>${escapeHtml(title)}</h2><div style="color:var(--muted)">Playing in player</div></div>`; modal.hidden = false; document.body.style.overflow='hidden'; }

  // ===== ACHIEVEMENTS & ACCOUNT =====
  const ACH_KEY = 'mh_ach_unlocked_v1';
  const USER_KEY = 'mh_user_v1';

  const achievements = [
    { id:'first-play', title:'Первое воспроизведение', desc:'Воспроизвести любой трек.', icon:'🎧' },
    { id:'ten-tracks', title:'Коллекционер', desc:'Воспроизвести 10 разных треков.', icon:'💿' },
    { id:'oshifan', title:'Оши фан', desc:'Открыть пасхалку Oshi no Ko.', icon:'🌸' },
    { id:'shield-hero', title:'Щит', desc:'Активировать пасхалку Shield Hero.', icon:'🛡️' },
    { id:'saitama', title:'Bald Hero', desc:'Сработала пасхалка Saitama.', icon:'🥊' },
    { id:'hells-paradise', title:"Адский вход", desc:"Сработала пасхалка Hell's Paradise.", icon:'🔥' },
    { id:'tokyo-ghoul', title:'1000-7', desc:'Ввести 1000-7 или активировать пасху — Tokyo Ghoul.', icon:'🎭' },
    { id:'explorer', title:'Исследователь', desc:'Открыть 5 различных видео.', icon:'🔎' },
    { id:'video-novice', title:'Киноман', desc:'Открыть 1 видео.', icon:'📺' },
    { id:'secret-hunter', title:'Ищейка', desc:'Найти 10 пасхалок.', icon:'🕵️' }
  ];

  let unlocked = loadUnlocked();
  let user = loadUser() || { name:null, playHistory:[], eggsFound:0, videoOpened:0, queueAdded:0 };

  function loadUnlocked(){ try { return JSON.parse(localStorage.getItem(ACH_KEY) || '[]'); } catch(e){ return []; } }
  function saveUnlocked(){ localStorage.setItem(ACH_KEY, JSON.stringify(unlocked)); updateAccountUI(); }
  function loadUser(){ try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch(e){ return null; } }
  function saveUser(){ localStorage.setItem(USER_KEY, JSON.stringify(user)); updateAccountUI(); }

  function isUnlocked(id){ return unlocked.includes(id); }
  function unlockAchievement(id){
    if (!id || isUnlocked(id)) return;
    unlocked.push(id);
    saveUnlocked();
    const a = achievements.find(x=>x.id===id);
    toast(`Достижение разблокировано: ${a ? a.title : id} 🎉`, 2500);
    user.eggsFound = (user.eggsFound||0) + 1;
    saveUser();
    renderAchievements();
  }

  function renderAchievements(){
    const el = $('achievements-list');
    if (!el) return;
    el.innerHTML = '';
    achievements.forEach(a=>{
      const div = document.createElement('div'); div.className='card';
      div.innerHTML = `<div style="font-size:28px">${a.icon}</div><div style="font-weight:700;margin-top:6px">${escapeHtml(a.title)}</div><div style="color:var(--muted);font-size:13px">${escapeHtml(a.desc)}</div><div style="margin-top:8px;"><button data-ach="${a.id}" class="btn ghost">${isUnlocked(a.id)?'Unlocked':'Unlock'}</button></div>`;
      const btn = div.querySelector('button');
      btn && btn.addEventListener('click', ()=> { if (!isUnlocked(a.id)) unlockAchievement(a.id); else toast('Уже разблокировано'); });
      if (isUnlocked(a.id)) div.style.outline='2px solid rgba(29,185,84,0.12)';
      el.appendChild(div);
    });
  }

  function updateAccountUI(){
    const unameEl = $('account-username'); const statsEl = $('account-stats'); const accAch = $('account-achievements');
    if (unameEl) unameEl.textContent = user?.name ? user.name : 'Не вошли';
    if (statsEl) statsEl.textContent = `Достижений: ${unlocked.length} · Пасхалок: ${user?.eggsFound||0}`;
    if (accAch){ accAch.innerHTML = ''; achievements.filter(a=>isUnlocked(a.id)).forEach(a=>{ const c=document.createElement('div'); c.className='card'; c.innerHTML=`<div style="font-size:22px">${a.icon}</div><div style="font-weight:700;margin-top:6px">${escapeHtml(a.title)}</div>`; accAch.appendChild(c); }); }
  }

  // account controls
  const loginBtn = $('account-login-btn'); const logoutBtn = $('account-logout-btn'); const usernameInput = $('account-username-input');
  loginBtn && loginBtn.addEventListener('click', ()=>{ const v = (usernameInput && usernameInput.value||'').trim(); if(!v){ toast('Введите имя'); return; } user.name=v; saveUser(); toast(`Вошли как ${v}`); unlockAchievement('day-one'); });
  logoutBtn && logoutBtn.addEventListener('click', ()=>{ user={name:null,playHistory:[],eggsFound:0}; saveUser(); toast('Выход'); });

  // note play / hooks
  function notePlay(src){ if (!user) user={name:null,playHistory:[],eggsFound:0}; user.playHistory = user.playHistory||[]; if (!user.playHistory.includes(src)) user.playHistory.push(src); if (user.playHistory.length>=1) unlockAchievement('first-play'); if (user.playHistory.length>=10) unlockAchievement('ten-tracks'); saveUser(); }
  const _origLoadSong = loadSong;
  loadSong = function(index, autoplay=false){ _origLoadSong(index, autoplay); const s = songs[index]; if (s && s.src) notePlay(s.src); };

  const _origOpenVideoModal = openVideoModal;
  openVideoModal = function(src, title){ try{ _origOpenVideoModal(src, title); }catch(e){ console.warn(e); } user.videoOpened=(user.videoOpened||0)+1; if(user.videoOpened>=1) unlockAchievement('video-novice'); if(user.videoOpened>=5) unlockAchievement('explorer'); saveUser(); };

  const _origAddToQueue = addToQueue;
  addToQueue = function(src){ _origAddToQueue(src); user.queueAdded=(user.queueAdded||0)+1; if(user.queueAdded>=5) unlockAchievement('queue-master'); saveUser(); };

  // additional egg detectors (keypress sequences)
  (function extraEggs(){
    const seqEggs = [
      { keys:['generalkenobi','hellothere'], action:()=>{ toast('General Kenobi!'); unlockAchievement('secret-starter'); } },
      { keys:['10007','1000-7','1000 7'], action:()=>{ triggerTokyoGhoulEgg(); unlockAchievement('tokyo-ghoul'); } },
      { keys:['oshino','oshiko','testme'], action:()=>{ triggerOshiEgg(); unlockAchievement('oshifan'); } },
      { keys:['shieldhero','rising'], action:()=>{ triggerShieldEgg(); unlockAchievement('shield-hero'); } }
    ];
    let seq='';
    window.addEventListener('keypress', e=>{ if(!e.key||e.key.length!==1) return; seq+=e.key.toLowerCase(); if(seq.length>300) seq=seq.slice(-300); seqEggs.forEach(item=>{ item.keys.forEach(k=>{ if(seq.includes(k)) { try{ item.action(); }catch(e){console.warn(e);} seq=''; } }); }); });
  })();

  // tabs wiring
  function showTab(name){
    ['music','anime','videos','achievements','account'].forEach(n=>{
      const el = $(n+'-view'); if (el) el.hidden = (n !== name);
    });
    [tabMusic, tabAnime, tabVideos, tabAchievements, tabAccount].forEach(b=> b && b.classList.remove('active'));
    if (name==='music') tabMusic && tabMusic.classList.add('active');
    if (name==='anime') tabAnime && tabAnime.classList.add('active');
    if (name==='videos') tabVideos && tabVideos.classList.add('active');
    if (name==='achievements') tabAchievements && tabAchievements.classList.add('active');
    if (name==='account') tabAccount && tabAccount.classList.add('active');
  }
  tabMusic && tabMusic.addEventListener('click', ()=> showTab('music'));
  tabAnime && tabAnime.addEventListener('click', ()=> showTab('anime'));
  tabVideos && tabVideos.addEventListener('click', ()=> showTab('videos'));
  tabAchievements && tabAchievements.addEventListener('click', ()=> showTab('achievements'));
  tabAccount && tabAccount.addEventListener('click', ()=> showTab('account'));

  // initial render
  function renderInitial(){
    renderCards();
    renderAnime();
    renderLocalVideos();
    renderAchievements();
    updateAccountUI();
    showTab('music');
    if (songs.length) loadSong(0,false);
  }

  try{ renderInitial(); } catch(err){ console.error('Init error', err); toast('Ошибка инициализации — проверьте консоль (F12)'); }

  // expose debug
  window._mh = { songs, localVideos, unlockAchievement, triggerOshiEgg, triggerTokyoGhoulEgg };

})();