(() => {
  const craft = window.JournalCraft;
  if (!craft) return;
  const loadImage = source => new Promise((resolve, reject) => {
    const image = new Image(); image.crossOrigin = 'anonymous';
    const timer = setTimeout(() => reject(new Error('圖片載入逾時，請稍後再試。')), 12000);
    image.onload = () => { clearTimeout(timer); resolve(image); };
    image.onerror = () => { clearTimeout(timer); reject(new Error('封面暫時無法讀取，請稍後再試。')); };
    image.src = source;
  });
  const linesFor = (context, text, width) => {
    const lines = [];
    for (const paragraph of text.split('\n')) {
      let line = '';
      for (const character of Array.from(paragraph)) {
        if (line && context.measureText(line + character).width > width) { lines.push(line); line = ''; }
        line += character;
      }
      lines.push(line);
    }
    return lines;
  };
  const dateText = value => value ? new Intl.DateTimeFormat('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(value)) : '';
  craft.exportPostcard = async note => {
    const palette = { sage: '#e2e5d3', blue: '#dce5e7', rose: '#eddccc' };
    const cover = await loadImage(note.artwork || craft.asset('leaf.png'));
    const stamp = note.stamp ? await loadImage(craft.asset(`ink-${note.stamp}.svg`)) : null;
    const tape = await loadImage(craft.asset('tape.png')).catch(() => null);
    await Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 1800))]);
    const canvas = document.createElement('canvas'); canvas.width = 1200;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('瀏覽器不支援圖片匯出。');
    const serif = '"Newsreader", "Noto Serif TC", "Songti SC", "Microsoft JhengHei", serif';
    context.font = `42px ${serif}`;
    const titleLines = linesFor(context, note.title || '留在心裡的一句', 555);
    context.font = `30px ${serif}`;
    const thoughtLines = linesFor(context, note.thought, 555);
    const textHeight = titleLines.length * 53 + 44 + thoughtLines.length * 48;
    canvas.height = Math.max(850, 345 + textHeight);
    const height = canvas.height;
    context.fillStyle = '#f7f2e7'; context.fillRect(0, 0, 1200, height);
    let seed = 39;
    const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    for (let count = 0; count < 20000; count++) {
      context.fillStyle = `rgba(104,88,60,${random() * .065})`;
      context.fillRect(random() * 1200, random() * height, .5 + random(), .5 + random() * 2);
    }
    context.strokeStyle = '#c4bba5'; context.lineWidth = 1; context.strokeRect(34, 34, 1132, height - 68);
    context.font = '16px sans-serif'; context.fillStyle = '#7b7765'; context.fillText('POSITIONPRIVACY / A SONG TO KEEP', 85, 92);
    context.save(); context.translate(266, 325); context.rotate(-.055);
    context.shadowColor = '#5c50332b'; context.shadowBlur = 18; context.shadowOffsetY = 7;
    context.fillStyle = '#fffaf0'; context.fillRect(-184, -184, 368, 411); context.shadowColor = 'transparent';
    if (note.artwork) context.drawImage(cover, -167, -167, 334, 334);
    else {
      context.fillStyle = palette[note.color] || palette.sage; context.fillRect(-167, -167, 334, 334);
      const ratio = Math.min(245 / cover.width, 290 / cover.height); context.drawImage(cover, -cover.width * ratio / 2, -cover.height * ratio / 2, cover.width * ratio, cover.height * ratio);
    }
    context.font = `italic 22px ${serif}`; context.fillStyle = '#716b58'; context.fillText('留在這一頁的聲音', -149, 201);
    if (tape) { context.globalAlpha = .78; context.drawImage(tape, -88, -207, 178, 52); }
    context.restore();
    context.save(); context.translate(805, 168 + textHeight / 2); context.rotate(.013);
    context.fillStyle = palette[note.color] || palette.sage;
    context.shadowColor = '#5c503318'; context.shadowBlur = 10; context.shadowOffsetY = 4;
    context.fillRect(-306, -textHeight / 2 - 30, 612, textHeight + 55); context.shadowColor = 'transparent';
    context.font = `42px ${serif}`; context.fillStyle = '#3f493e';
    let baseline = -textHeight / 2 + 19;
    titleLines.forEach(line => { context.fillText(line, -278, baseline); baseline += 53; });
    baseline += 35; context.font = `30px ${serif}`; context.fillStyle = '#5f6758';
    thoughtLines.forEach(line => { context.fillText(line, -278, baseline); baseline += 48; });
    context.restore();
    context.strokeStyle = '#aa9b82'; context.setLineDash([3, 5]); context.beginPath(); context.moveTo(84, height - 149); context.lineTo(1116, height - 149); context.stroke(); context.setLineDash([]);
    context.font = `22px ${serif}`; context.fillStyle = '#766b58'; context.fillText(dateText(note.createdAt), 86, height - 94);
    context.font = '16px sans-serif'; context.fillText('positionprivacy.github.io', 86, height - 62);
    if (stamp) { context.save(); context.translate(1030, height - 100); context.rotate(-.14); context.globalAlpha = .82; context.drawImage(stamp, -55, -55, 110, 110); context.restore(); }
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('明信片未能生成，請再試一次。');
    const url = URL.createObjectURL(blob);
    const dialog = craft.node('dialog', '', 'postcard-dialog'); dialog.setAttribute('aria-label', '你的歌曲明信片'); dialog.lang = 'zh-Hant';
    const heading = craft.node('h2', '把這一刻，帶走。');
    const preview = craft.node('img'); preview.src = url; preview.alt = '含專輯封面、文字、日期與印章的明信片預覽';
    const actions = craft.node('div', '', 'postcard-actions');
    const download = craft.node('a', '下載明信片 ↓'); download.href = url; download.download = 'positionprivacy-song-postcard.png';
    const close = craft.node('button', '再看一會兒'); close.type = 'button'; close.addEventListener('click', () => dialog.close());
    actions.append(download, close); dialog.append(heading, preview, actions); document.body.append(dialog);
    const previousFocus = document.activeElement;
    dialog.addEventListener('close', () => { URL.revokeObjectURL(url); dialog.remove(); if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true }); });
    dialog.showModal();
  };
})();
