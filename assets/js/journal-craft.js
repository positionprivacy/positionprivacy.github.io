(() => {
  const root = document.documentElement;
  const assetRoot = new URL('../../images/decorations/', document.currentScript.src);
  const asset = name => new URL(name, assetRoot).href;
  const stamps = { moon: '月亮', leaf: '枝葉', record: '唱片' };
  const node = (tag, text, className) => {
    const result = document.createElement(tag);
    if (text) result.textContent = text;
    if (className) result.className = className;
    return result;
  };
  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const read = key => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } };
  const write = (key, value) => {
    try { if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  };
  const status = node('p', '', 'craft-status'); status.setAttribute('role', 'status');
  document.body.append(status);
  let statusTimer;
  const announce = message => {
    status.textContent = message; status.classList.add('is-visible'); clearTimeout(statusTimer);
    statusTimer = setTimeout(() => status.classList.remove('is-visible'), 4500);
  };
  const tools = node('aside', '', 'page-rituals'); tools.setAttribute('aria-label', '手帳小工具'); tools.lang = 'zh-Hant';
  const lamp = node('button', '', 'lamp-toggle'); lamp.type = 'button';
  const lampImage = node('img'); lampImage.src = asset('night-lamp.png'); lampImage.alt = ''; lampImage.width = 48; lampImage.height = 65;
  lamp.append(lampImage, node('span', '夜讀'));
  const applyTheme = night => {
    root.dataset.theme = night ? 'night' : 'day';
    lamp.setAttribute('aria-pressed', String(night)); lamp.setAttribute('aria-label', night ? '關燈，回到日間' : '開燈，開始夜讀');
    lamp.querySelector('span').textContent = night ? '關燈' : '夜讀';
  };
  applyTheme(root.dataset.theme === 'night');
  lamp.addEventListener('click', () => {
    const night = root.dataset.theme !== 'night'; applyTheme(night);
    if (!write('journal-night', night)) announce('這次的燈光會留到離開本頁。');
  });
  const leaf = node('button', '', 'leaf-bookmark'); leaf.type = 'button'; leaf.setAttribute('aria-label', '葉子書籤');
  const leafImage = node('img'); leafImage.src = asset('leaf.png'); leafImage.alt = ''; leafImage.width = 36; leafImage.height = 57;
  leaf.append(leafImage, node('span', '夾一葉'));
  const panel = node('div', '', 'bookmark-drawer'); panel.id = 'reading-bookmark'; panel.hidden = true;
  leaf.setAttribute('aria-controls', panel.id); leaf.setAttribute('aria-expanded', 'false');
  const bookmarkKey = `journal-reading:${location.pathname}`;
  let bookmark = read(bookmarkKey);
  if (!bookmark || typeof bookmark.id !== 'string' || !Number.isFinite(bookmark.fraction) || !document.getElementById(bookmark.id)) bookmark = null;
  const summary = node('p');
  const resume = node('button', '回到書籤'); resume.type = 'button';
  const save = node('button', '夾在現在這裡'); save.type = 'button';
  const remove = node('button', '取出葉子'); remove.type = 'button';
  panel.append(summary, resume, save, remove);
  const updateBookmark = () => {
    leaf.classList.toggle('has-bookmark', Boolean(bookmark));
    leaf.querySelector('span').textContent = bookmark ? '上次讀到' : '夾一葉';
    summary.textContent = bookmark ? `上次讀到 ${document.getElementById(bookmark.id)?.querySelector('h2, h1')?.textContent.trim() || '這一頁'}` : '把此刻讀到的地方，夾一片葉子。';
    resume.hidden = remove.hidden = !bookmark;
  };
  const closeBookmark = () => { panel.hidden = true; leaf.setAttribute('aria-expanded', 'false'); };
  leaf.addEventListener('click', () => { panel.hidden = !panel.hidden; leaf.setAttribute('aria-expanded', String(!panel.hidden)); });
  save.addEventListener('click', () => {
    const anchor = scrollY + innerHeight * .25;
    const sections = [...document.querySelectorAll('main > section[id]')];
    const section = sections.filter(item => item.getBoundingClientRect().top + scrollY <= anchor).at(-1) || document.querySelector('main');
    if (!section?.id) return;
    const top = section.getBoundingClientRect().top + scrollY;
    bookmark = { id: section.id, fraction: Math.max(0, Math.min(1, (scrollY - top) / Math.max(1, section.offsetHeight))) };
    const stored = write(bookmarkKey, bookmark); updateBookmark(); closeBookmark(); leaf.focus({ preventScroll: true });
    announce(stored ? '葉子夾好了，下次還能從這裡讀。' : '葉子暫留在本頁；瀏覽器未能保存。');
  });
  resume.addEventListener('click', () => {
    const section = document.getElementById(bookmark?.id);
    if (section) {
      const top = section.getBoundingClientRect().top + scrollY + Math.max(0, Math.min(1, bookmark.fraction)) * section.offsetHeight;
      window.scrollTo({ top, behavior: reducedMotion() ? 'instant' : 'smooth' });
    }
    closeBookmark(); leaf.focus({ preventScroll: true });
  });
  remove.addEventListener('click', () => {
    bookmark = null; const stored = write(bookmarkKey, null); updateBookmark(); closeBookmark(); leaf.focus({ preventScroll: true });
    announce(stored ? '葉子已取出。' : '本頁已取出；瀏覽器未能更新保存的書籤。');
  });
  document.addEventListener('click', event => { if (!tools.contains(event.target)) closeBookmark(); });
  tools.addEventListener('keydown', event => { if (event.key === 'Escape') { closeBookmark(); leaf.focus(); } });
  tools.append(lamp, leaf, panel); document.body.append(tools); updateBookmark();

  const makeDraggable = target => {
    if (!target || target.dataset.draggable) return;
    target.dataset.draggable = 'true'; target.classList.add('movable-sticker');
    const instructions = '可輕拖，雙擊歸位；鍵盤 Alt + 方向鍵移動，Esc 歸位。';
    target.title = `${target.getAttribute('aria-label') || ''} · ${instructions}`;
    let position = { left: 0, top: 0 }; let gesture = null; let suppressClick = false; let clickTimer;
    const move = (left, top) => {
      const current = target.getBoundingClientRect();
      const bounds = target.closest('.field-sketch, .music-heading, .desk-heading')?.getBoundingClientRect();
      const minLeft = Math.max(-35, 6 - (current.left - position.left));
      const maxLeft = Math.min(35, innerWidth - 6 - (current.right - position.left));
      const minTop = bounds ? Math.max(-22, bounds.top - (current.top - position.top) - 8) : -22;
      const maxTop = bounds ? Math.min(22, bounds.bottom - (current.bottom - position.top) + 8) : 22;
      position = { left: Math.min(maxLeft, Math.max(minLeft, left)), top: Math.min(Math.max(minTop, maxTop), Math.max(minTop, top)) };
      target.style.setProperty('--sticker-x', `${position.left}px`); target.style.setProperty('--sticker-y', `${position.top}px`);
      target.style.setProperty('--sticker-turn', `${position.left / 12}deg`);
    };
    const reset = () => { position = { left: 0, top: 0 }; ['--sticker-x', '--sticker-y', '--sticker-turn'].forEach(property => target.style.removeProperty(property)); };
    target.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse' || event.button !== 0 || target.disabled) return;
      gesture = { id: event.pointerId, startX: event.clientX, startY: event.clientY, ...position, moved: false };
      target.setPointerCapture(event.pointerId);
    });
    target.addEventListener('pointermove', event => {
      if (!gesture || gesture.id !== event.pointerId) return;
      const deltaX = event.clientX - gesture.startX, deltaY = event.clientY - gesture.startY;
      if (!gesture.moved && Math.hypot(deltaX, deltaY) < 6) return;
      gesture.moved = true; target.classList.add('is-dragging'); move(gesture.left + deltaX, gesture.top + deltaY);
    });
    const finish = () => {
      if (!gesture) return;
      suppressClick = gesture.moved; gesture = null; target.classList.remove('is-dragging');
      setTimeout(() => { suppressClick = false; }, 0);
    };
    target.addEventListener('pointerup', finish); target.addEventListener('pointercancel', () => { reset(); finish(); });
    target.addEventListener('lostpointercapture', finish);
    target.addEventListener('click', event => {
      if (suppressClick || event.detail > 1) { clearTimeout(clickTimer); event.preventDefault(); event.stopImmediatePropagation(); return; }
      if (event.detail === 1 && (position.left || position.top)) {
        event.preventDefault(); event.stopImmediatePropagation(); clearTimeout(clickTimer);
        clickTimer = setTimeout(() => target.click(), 300);
      }
    }, true);
    target.addEventListener('dblclick', event => { event.preventDefault(); clearTimeout(clickTimer); reset(); });
    target.addEventListener('dragstart', event => event.preventDefault());
    target.addEventListener('keydown', event => {
      if (event.key === 'Escape') { reset(); return; }
      const offsets = { ArrowLeft: [-6, 0], ArrowRight: [6, 0], ArrowUp: [0, -6], ArrowDown: [0, 6] };
      if (event.altKey && offsets[event.key]) { event.preventDefault(); move(position.left + offsets[event.key][0], position.top + offsets[event.key][1]); }
    });
    window.addEventListener('resize', reset);
  };
  window.JournalCraft = { asset, stamps, node, announce, makeDraggable };
})();
