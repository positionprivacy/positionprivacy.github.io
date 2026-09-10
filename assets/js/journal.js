(() => {
  const desk = document.querySelector('.song-desk');
  if (!desk) return;
  const query = desk.querySelector('#song-query');
  const title = desk.querySelector('#song-title');
  const thought = desk.querySelector('#song-thought');
  const results = desk.querySelector('.song-results');
  const searchStatus = desk.querySelector('.search-status');
  const noteStatus = desk.querySelector('.note-status');
  const pocket = desk.querySelector('.saved-notes');
  const storageKey = 'journal-song-notes-v1';
  const colors = ['sage', 'blue', 'rose'];
  let selectedSong = null;
  let controller;
  let requestNumber = 0;
  let notes = [];
  const safeArtwork = value => {
    try {
      const url = new URL(value, location.origin);
      return (url.protocol === 'https:' && url.hostname.endsWith('.mzstatic.com')) || (url.origin === location.origin && url.pathname.startsWith('/images/music/')) ? url.href : '';
    } catch { return ''; }
  };
  const coverImage = (value, className) => {
    const source = safeArtwork(value);
    if (!source) return null;
    const image = document.createElement('img');
    image.src = source; image.alt = '專輯封面'; image.className = className; image.loading = 'lazy';
    image.addEventListener('error', () => image.remove());
    return image;
  };
  const updateCover = () => {
    const preview = desk.querySelector('.selected-cover');
    preview.replaceChildren();
    const cover = coverImage(selectedSong?.artwork, 'draft-artwork');
    if (cover) preview.append(cover);
    preview.hidden = !cover;
  };
  const safeLink = value => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && ['music.apple.com', 'itunes.apple.com'].includes(url.hostname) ? url.href : '';
    } catch { return ''; }
  };
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(stored)) notes = stored.filter(note => note && typeof note.title === 'string' && typeof note.thought === 'string').slice(0, 12).map(note => ({ title: note.title.slice(0, 160), thought: note.thought.slice(0, 240), color: colors.includes(note.color) ? note.color : 'sage', url: safeLink(note.url), artwork: safeArtwork(note.artwork) }));
  } catch {}
  const element = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  const persist = () => {
    try { localStorage.setItem(storageKey, JSON.stringify(notes)); return true; }
    catch { noteStatus.textContent = '瀏覽器無法保存；便箋暫留在本頁，離開前可複製或寄出。'; return false; }
  };
  const render = () => {
    pocket.replaceChildren();
    desk.querySelector('.pocket-empty').hidden = notes.length > 0;
    notes.forEach((note, index) => {
      const card = element('article', '', `song-card paper-${note.color}`);
      const cover = coverImage(note.artwork, 'card-artwork');
      if (cover) card.append(cover);
      card.append(element('span', String(index + 1).padStart(2, '0'), 'card-index'), element('h4', note.title || '留在心裡的一句'), element('p', note.thought));
      const actions = element('div', '', 'card-actions');
      if (safeLink(note.url)) {
        const link = element('a', '聽這首 ↗');
        link.href = safeLink(note.url); link.target = '_blank'; link.rel = 'noopener noreferrer'; actions.append(link);
      }
      const body = [note.title, note.thought].filter(Boolean).join('\n\n');
      const mail = element('a', '寄給頁主 ↗');
      mail.href = `mailto:qrzhang_23@sjtu.edu.cn?subject=${encodeURIComponent('留給這一頁的歌')}&body=${encodeURIComponent(body)}`;
      const copy = element('button', '複製'); copy.type = 'button';
      copy.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(body); noteStatus.textContent = '便箋已複製，可以分享給朋友。'; }
        catch { noteStatus.textContent = '未能複製，請選取便箋文字手動複製。'; }
      });
      const remove = element('button', '取下'); remove.type = 'button'; remove.setAttribute('aria-label', `取下 ${note.title || '這張便箋'}`);
      remove.addEventListener('click', () => {
        notes.splice(index, 1); const saved = persist(); render(); if (saved) noteStatus.textContent = '已取下這張便箋。';
        (pocket.querySelector('button') || title).focus();
      });
      actions.append(mail, copy, remove); card.append(actions); pocket.append(card);
    });
  };
  const search = async term => {
    controller?.abort(); controller = new AbortController();
    const activeController = controller;
    const currentRequest = ++requestNumber;
    const timeout = setTimeout(() => activeController.abort(), 12000);
    searchStatus.textContent = '正在翻找唱片……'; results.replaceChildren(); results.setAttribute('aria-busy', 'true');
    try {
      const url = new URL('https://itunes.apple.com/search');
      url.search = new URLSearchParams({ term, entity: 'song', country: 'TW', limit: '5' }).toString();
      const response = await fetch(url, { signal: activeController.signal });
      if (!response.ok) throw new Error('Search unavailable');
      const data = await response.json();
      if (currentRequest !== requestNumber) return;
      const tracks = Array.isArray(data.results) ? data.results.filter(track => typeof track.trackName === 'string' && typeof track.artistName === 'string').slice(0, 5) : [];
      searchStatus.textContent = tracks.length ? '選一首，再寫下你的一句。' : '沒有找到；仍可以在下面親手寫下。';
      tracks.forEach(track => {
        const button = element('button', '', 'song-result'); button.type = 'button';
        const artwork = safeArtwork(track.artworkUrl100);
        const cover = coverImage(artwork, 'result-artwork');
        if (cover) button.append(cover);
        button.append(element('strong', track.trackName), element('span', `${track.artistName} · ${track.collectionName || ''}`));
        button.addEventListener('click', () => {
          title.value = `${track.trackName} · ${track.artistName}`.slice(0, 160);
          selectedSong = { title: title.value, url: safeLink(track.trackViewUrl), artwork };
          updateCover();
          results.querySelectorAll('button').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
          thought.focus(); searchStatus.textContent = `已選「${track.trackName}」。`;
        });
        button.setAttribute('aria-pressed', 'false'); results.append(button);
      });
    } catch {
      if (currentRequest === requestNumber) searchStatus.textContent = '唱片搜尋暫時連不上，可以稍後再試，或直接填寫。';
    } finally {
      clearTimeout(timeout);
      if (currentRequest === requestNumber) results.removeAttribute('aria-busy');
    }
  };
  desk.querySelector('.song-search').addEventListener('submit', event => {
    event.preventDefault(); const term = query.value.trim();
    if (term) search(term); else { searchStatus.textContent = '先寫一個歌名或歌手吧。'; query.focus(); }
  });
  const relatedArtists = ['魏如萱', '安溥', '黃玠', '洪申豪', '鄭宜農', '盧凱彤', '雷光夏', '曹方', '陳粒', '房東的貓', '落日飛車', '椅子樂團', 'Hello Nico', '持修'];
  let artistBag = [];
  const surprise = desk.querySelector('[data-surprise]');
  surprise.setAttribute('aria-label', '隨機探索一位相近風格的歌手');
  surprise.querySelector('span').textContent = '遇見另一個聲音 ↗';
  surprise.addEventListener('click', () => {
    if (!artistBag.length) artistBag = relatedArtists.filter(artist => artist !== query.value);
    const artist = artistBag.splice(Math.floor(Math.random() * artistBag.length), 1)[0];
    query.value = artist; search(artist); query.focus();
  });
  title.addEventListener('input', () => { selectedSong = null; updateCover(); });
  desk.querySelectorAll('[name="paper"]').forEach(option => option.addEventListener('change', () => { desk.querySelector('.song-note-form').dataset.paper = option.value; }));
  desk.querySelector('.song-note-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!title.value.trim() && !thought.value.trim()) { noteStatus.textContent = '先留一首歌，或一句話。'; title.focus(); return; }
    if (notes.length >= 12) { noteStatus.textContent = '已收藏 12 張；取下一張，就能放進新的便箋。'; return; }
    notes.unshift({ title: title.value.trim().slice(0, 160), thought: thought.value.trim().slice(0, 240), color: desk.querySelector('[name="paper"]:checked').value, url: selectedSong?.title === title.value ? selectedSong.url : '', artwork: selectedSong?.title === title.value ? selectedSong.artwork : '' });
    const saved = persist(); render(); if (saved) noteStatus.textContent = '已夾進這一頁，下次回來還在。';
    title.value = ''; thought.value = ''; selectedSong = null;
    updateCover();
  });
  document.querySelectorAll('.pencil-note').forEach(note => {
    const button = element('button', '抄進便箋', 'quote-copy'); button.type = 'button';
    const record = note.closest('.record');
    button.addEventListener('click', () => {
      thought.value = note.innerText.replace(/[「」]/g, '').trim();
      title.value = record.querySelector('h3').textContent.trim().slice(0, 160);
      selectedSong = { title: title.value, url: safeLink(record.querySelector('.record-art').href), artwork: record.querySelector('.record-art img').src };
      updateCover();
      thought.focus(); noteStatus.textContent = '已放到書寫區，可以添上自己的心情再收藏。';
    });
    record.append(button);
  });
  const contact = document.querySelector('.contact-sticker');
  if (contact) {
    const link = element('a', '', 'telephone-link'); link.href = 'mailto:qrzhang_23@sjtu.edu.cn'; link.setAttribute('aria-label', '寫信給 Qiran');
    contact.replaceWith(link); link.append(contact);
  }
  const stickerButton = (image, label, className) => {
    const button = element('button', '', `interactive-sticker ${className}`);
    button.type = 'button'; button.setAttribute('aria-label', label); button.title = label;
    image.replaceWith(button); button.append(image, element('span', label, 'sticker-caption'));
    return button;
  };
  const musicHeading = document.querySelector('.music-heading');
  if (musicHeading) {
    const image = element('img'); image.src = new URL('headphones.png', document.querySelector('.vinyl-button img').src).href; image.alt = ''; image.width = 74; image.height = 92;
    musicHeading.append(image);
    const headphones = stickerButton(image, '翻到下一組唱片', 'headphones-button');
    musicHeading.classList.add('has-headphones');
    const caption = element('p', '', 'listening-caption'); caption.setAttribute('role', 'status');
    musicHeading.after(caption);
    const records = [...document.querySelectorAll('.record')];
    let shelfIndex = 0;
    const original = records.map(record => ({
      title: record.querySelector('h3').textContent.trim(),
      titleMarkup: record.querySelector('.art-word').innerHTML,
      headingMarkup: record.querySelector('h3').innerHTML,
      long: record.querySelector('.art-word').classList.contains('art-word--long'),
      artist: record.querySelector('.record-credit').textContent,
      artwork: record.querySelector('.record-art img').src,
      url: record.querySelector('.record-art').href,
      lyric: record.querySelector('.pencil-note').innerText,
      year: record.querySelector('.sleeve-bottom').textContent.replace('↗', '').trim()
    }));
    const shelves = [original, [
      {title:'華麗的冒險',artist:'陳綺貞 / Cheer Chen',year:'2005',url:'https://music.apple.com/tw/album/818157917',artwork:'https://is1-ssl.mzstatic.com/image/thumb/Music/v4/c5/c5/b9/c5c5b9a5-7b08-1579-950e-6ad69d8f105a/2005_9-_1400.jpg/600x600bb.jpg',lyric:'「你看過了許多美景」',song:'旅行的意義'},
      {title:'My Life Will',artist:'張懸 / Deserts Chang',year:'2006',url:'https://music.apple.com/tw/album/300117892',artwork:'https://is1-ssl.mzstatic.com/image/thumb/Music/2c/65/a6/mzi.gfyizvei.jpg/600x600bb.jpg',lyric:'「給你一點甜甜」',song:'寶貝'},
      {title:'親愛的...我還不知道',artist:'張懸 / Deserts Chang',year:'2007',url:'https://music.apple.com/tw/album/312524587',artwork:'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/6e/1b/84/6e1b84c8-1581-c1ff-e8a3-5c1b6a4f7eac/mzi.ckeidwej.jpg/600x600bb.jpg',lyric:'「片段中有些散落」',song:'喜歡'}
    ]];
    const sun = {title:'太陽',artist:'陳綺貞 / Cheer Chen',year:'2009',url:'https://music.apple.com/tw/album/815493324',artwork:'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/07/70/06/077006a5-18c5-0e56-0e0c-ba052672b07a/4719760090010_new.jpg/600x600bb.jpg',lyric:'「原諒我飛，曾經眷戀太陽」',song:'魚'};
    const lonely = {title:'還是會寂寞',artist:'陳綺貞 / Cheer Chen',year:'2000',url:'https://music.apple.com/tw/album/152200437',artwork:'https://is1-ssl.mzstatic.com/image/thumb/Music19/v4/e0/0e/ae/e00eaefb-5737-4833-69c9-93be29dc1c6d/mzm.nshgqvxy.jpg/600x600bb.jpg',lyric:'「跟著我，勇敢的走下去」',song:'還是會寂寞'};
    const city = {title:'城市',artist:'張懸 / Deserts Chang',year:'2009',url:'https://music.apple.com/tw/album/317557859',artwork:'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/80/90/6b/80906b73-db91-c6ab-5f40-5bc6a05ee217/mzi.dckjbaow.jpg/600x600bb.jpg',lyric:'「心是一地草野」',song:'南國的孩子'};
    const time = {title:'時間的歌',artist:'陳綺貞 / Cheer Chen',year:'2013',url:'https://music.apple.com/tw/album/789593666',artwork:'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/9e/78/07/9e7807ae-f751-e110-3c3e-64c02183bc4e/1105_4000x4000.jpg/600x600bb.jpg',lyric:'「眼淚灌溉，不枉愛過」',song:'流浪者之歌'};
    shelves.push(
      [sun, city, lonely],
      [time, original[1], shelves[1][0]],
      [shelves[1][1], lonely, original[2]],
      [city, sun, shelves[1][2]]
    );
    caption.textContent = `第 1 / ${shelves.length} 組 · 點耳機，翻閱唱片`;
    const preload = source => new Promise((resolve, reject) => {
      const cover = new Image();
      const timeout = setTimeout(() => reject(new Error('Cover timeout')), 12000);
      cover.onload = () => { clearTimeout(timeout); resolve(); };
      cover.onerror = () => { clearTimeout(timeout); reject(new Error('Cover unavailable')); };
      cover.src = source;
    });
    const updateShelf = async () => {
      if (headphones.disabled) return;
      const nextIndex = (shelfIndex + 1) % shelves.length;
      headphones.disabled = true;
      caption.textContent = '正在從唱片架翻出另一組……';
      try {
        await Promise.all(shelves[nextIndex].map(item => preload(item.artwork)));
        shelves[nextIndex].forEach((item, index) => {
          const record = records[index];
          const link = record.querySelector('.record-art');
          link.href = item.url;
          link.setAttribute('aria-label', `聆聽 ${item.artist}《${item.title}》`);
          const word = record.querySelector('.art-word');
          if (item.titleMarkup) word.innerHTML = item.titleMarkup; else word.textContent = item.title;
          word.classList.toggle('art-word--long', Boolean(item.long));
          const cover = link.querySelector('img'); cover.src = item.artwork; cover.alt = `${item.artist}《${item.title}》專輯封面`;
          record.querySelector('.pencil-note').textContent = item.lyric;
          record.querySelector('.sleeve-bottom').replaceChildren(document.createTextNode(item.year + ' '), element('span', '↗'));
          if (item.headingMarkup) record.querySelector('h3').innerHTML = item.headingMarkup; else record.querySelector('h3').textContent = item.title;
          record.querySelector('.record-credit').textContent = item.artist;
        });
        shelfIndex = nextIndex;
        caption.textContent = `第 ${shelfIndex + 1} / ${shelves.length} 組 · 再點耳機，繼續翻閱`;
      } catch { caption.textContent = '封面暫時未能載入，保留這一組；可以再試一次。'; }
      finally { headphones.disabled = false; }
    };
    headphones.addEventListener('click', updateShelf);
  }
  const feather = document.querySelector('.field-sketch img');
  if (feather) {
    feather.parentElement.removeAttribute('aria-hidden');
    stickerButton(feather, '提筆，留一句', 'feather-button').addEventListener('click', () => thought.focus());
  }
  const workImage = document.querySelector('.work-sticker');
  if (workImage) {
    const papers = stickerButton(workImage, '收起摘要', 'papers-button');
    papers.setAttribute('aria-expanded', 'true');
    papers.addEventListener('click', () => {
      const expanded = papers.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.paper-card>p').forEach(paragraph => { paragraph.hidden = expanded; });
      papers.setAttribute('aria-expanded', String(!expanded));
      const label = expanded ? '展開摘要' : '收起摘要';
      papers.setAttribute('aria-label', label); papers.title = label; papers.querySelector('span').textContent = label;
    });
  }
  render();
})();
