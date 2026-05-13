// ============================================================
// GRILOVAČKA – Minihry v2 (opravené + nové)
// ============================================================

const MINIGAMES = (() => {

  let onWin = null;
  let onFail = null;

  function setup(winCb, failCb) {
    onWin = winCb;
    onFail = failCb;
  }

  function showResult(success, msg) {
    const area = document.querySelector('.minigame-area');
    if (!area) return;
    const old = area.querySelector('.mg-result');
    if (old) old.remove();
    const div = document.createElement('div');
    div.className = 'mg-result';
    div.style.cssText = `position:absolute;inset:0;background:rgba(0,0,0,0.88);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;border-radius:16px;z-index:50;padding:20px;text-align:center;`;
    div.innerHTML = `
      <div style="font-size:52px">${success ? '🎉' : '😢'}</div>
      <div style="font-family:var(--font-pixel);font-size:11px;color:${success ? 'var(--clr-green)' : 'var(--clr-red)'};line-height:1.9">${msg}</div>
      ${success
        ? `<button onclick="MINIGAMES.confirmWin()" class="btn btn-primary" style="margin-top:8px">ZÍSKAT PŘEDMĚT!</button>`
        : `<button onclick="MINIGAMES.confirmFail()" class="btn btn-danger btn-sm" style="margin-top:8px">ZPĚT NA MAPU</button>`}
    `;
    area.style.position = 'relative';
    area.appendChild(div);
    if (success) AUDIO.SFX.minigameWin();
    else AUDIO.SFX.minigameFail();
  }

  function confirmWin() { if (onWin) { const cb = onWin; onWin = null; cb(); } }
  function confirmFail() { if (onFail) { const cb = onFail; onFail = null; cb(); } }

  // ===========================================================
  // 1. PEXESO – max 24 tahů, odpočítávání
  // ===========================================================
  function startPexeso(container) {
    const items = ['🐶','🐱','🐦','🦌','🐻','🦊','🥩','🌭','🍖','🔥','🍴','🧂'];
    const cards = [...items, ...items].sort(() => Math.random() - 0.5);
    let flipped = [], matched = [], locked = false, moves = 0, lastMatch = false, combo = 0;
    const MAX_MOVES = 24;

    container.innerHTML = `
      <div class="minigame-header">
        <div class="minigame-title">🐾 NAJDI GARPA!</div>
        <div class="minigame-desc">Najdi všechny páry! ${MAX_MOVES} tahů max</div>
      </div>
      <div class="minigame-area" style="position:relative;gap:12px">
        <div style="display:flex;gap:12px;align-items:center;justify-content:space-between;width:100%">
          <span style="font-family:var(--font-pixel);font-size:9px;color:var(--clr-text-dim)">Tahy: <span id="pex-moves" style="color:var(--clr-accent)">0</span>/${MAX_MOVES}</span>
          <span style="font-family:var(--font-pixel);font-size:9px;color:var(--clr-green)">Páry: <span id="pex-pairs" style="color:var(--clr-green)">0</span>/${cards.length/2}</span>
          ${combo > 1 ? `<span style="font-family:var(--font-pixel);font-size:10px;color:#ffc832;font-weight:700">🔥 COMBO x${combo}</span>` : ''}
        </div>
        <div style="flex:1;height:6px;background:var(--clr-surface2);border-radius:3px;overflow:hidden">
          <div id="pex-bar" style="height:100%;background:var(--clr-green);border-radius:3px;transition:width 0.3s;width:100%"></div>
        </div>
        <div class="pexeso-grid" id="pex-grid" style="grid-template-columns:repeat(4,1fr);gap:10px;max-width:360px;width:100%"></div>
      </div>
    `;

    const grid = document.getElementById('pex-grid');
    cards.forEach((emoji, i) => {
      const card = document.createElement('div');
      card.className = 'pexeso-card';
      card.dataset.idx = i;
      card.dataset.val = emoji;
      card.innerHTML = `<span class="card-back">🔥</span>`;
      card.style.cssText = `aspect-ratio:1;background:var(--clr-surface2);border:2px solid var(--clr-border);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:48px;cursor:pointer;transition:all 0.2s;user-select:none`;
      card.addEventListener('click', () => {
        if (locked || flipped.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;
        AUDIO.SFX.click();
        card.classList.add('flipped');
        card.innerHTML = `<span>${emoji}</span>`;
        card.style.background = 'rgba(255,150,50,0.1)';
        flipped.push(card);
        if (flipped.length === 2) {
          moves++;
          document.getElementById('pex-moves').textContent = moves;
          const pct = Math.max(0, ((MAX_MOVES - moves) / MAX_MOVES) * 100);
          const bar = document.getElementById('pex-bar');
          bar.style.width = pct + '%';
          bar.style.background = pct > 60 ? 'var(--clr-green)' : pct > 30 ? '#f39c12' : 'var(--clr-red)';

          locked = true;
          setTimeout(() => {
            console.log('Timeout fired - checking match. flipped.length:', flipped.length);
            const isMatch = flipped[0]?.dataset.val === flipped[1]?.dataset.val;
            console.log('isMatch:', isMatch, 'val0:', flipped[0]?.dataset.val, 'val1:', flipped[1]?.dataset.val);

            if (isMatch) {
              flipped.forEach(c => {
                c.classList.add('matched');
                c.style.background = 'rgba(74,222,128,0.2)';
                c.style.borderColor = '#4ade80';
                c.style.opacity = '0.7';
              });
              matched.push(...flipped);
              AUDIO.SFX.success();

              if (lastMatch) combo++; else combo = 1;
              if (combo > 1) {
                const comboEl = document.querySelector('[class*="COMBO"]');
                if (comboEl) comboEl.textContent = `🔥 COMBO x${combo}`;
              }
              lastMatch = true;
              document.getElementById('pex-pairs').textContent = matched.length/2;

              if (matched.length === cards.length) {
                setTimeout(() => showResult(true, `SKVĚLE!🐕\n${moves}/${MAX_MOVES} tahů\nCombo: x${combo}`), 400);
              }
            } else {
              AUDIO.SFX.fail();
              for (let i = 0; i < flipped.length; i++) {
                const c = flipped[i];
                c.classList.remove('flipped');
                c.innerHTML = `<span class="card-back">🔥</span>`;
                c.style.background = '#3d2000';
                c.style.borderColor = '#5a3000';
              }
              lastMatch = false;
            }
            flipped = []; locked = false;
            if (moves >= MAX_MOVES && matched.length < cards.length) {
              setTimeout(() => showResult(false, `Čas vypršel!⏱\n${matched.length/2}/${cards.length/2} párů\nPříště budeš rychlejší!`), 300);
            }
          }, 900);
        }
      });
      grid.appendChild(card);
    });
  }

  // ===========================================================
  // 2. PŘESMYČKY – slova 6-10 písmen
  // ===========================================================
  function startAnagramy(container) {
    const words = [
      { word: 'ŠLAPKA', hint: 'Zlí jazykové jí říkají pedál.' },
      { word: 'GALUSKA', hint: 'Štíhlá modelka mezi pneumatikami.' },
      { word: 'ZVONEK', hint: 'Jediný způsob, jak legálně plašit chodce.' },
      { word: 'BLATNÍK', hint: 'Osobní strážce vašich čistých zad.' },
      { word: 'ŘETĚZ', hint: 'Špinavý náhrdelník každého kola.' },
      { word: 'HELMA', hint: 'Polystyrenový bodyguard pro vaši hlavu.' },
      { word: 'KLOBÁSA', hint: 'Masové umění v jedlém střívku.' },
      { word: 'MARINÁDA', hint: 'Koupel pro maso, aby mělo grády.' },
      { word: 'JEHNĚČÍ', hint: 'Maso pro ty, co mají rádi bečení.' },
      { word: 'GRILL', hint: 'Oltář, u kterého muži v létě uctívají maso.' },
      { word: 'PILZÍŇKA', hint: 'Tekutý chléb národa v oroseném skle.' },
      { word: 'HLADINKA', hint: 'Ideální míra piva s čepicí jako hrad.' },
      { word: 'ZELENÁ', hint: 'Malá sklenička s velkými následky.' },
      { word: 'ŠTAMGAST', hint: 'Inventární číslo u třetího stolu u okna.' },
      { word: 'ZÁCHODY', hint: 'Místo, kde se v hospodě nejvíc filosofuje.' },
      { word: 'TATARÁK', hint: 'Syrové štěstí s hromadou česneku.' },
      { word: 'PIVOVAR', hint: 'Továrna na sny a ranní kocovinu.' },
    ].sort(() => Math.random() - 0.5);

    const total = 8;
    let current = 0, correct = 0;

    function shuffle(str) {
      let arr = str.split('');
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      if (arr.join('') === str && arr.length > 1) return shuffle(str);
      return arr.join('');
    }

    function render() {
      if (current >= total) {
        if (correct >= 5) showResult(true, `VÝBORNĚ!\nUhodl jsi ${correct}/${total} přesmyček!\nVáca by byl pyšný! 🔧`);
        else showResult(false, `Bohužel...\nUhodl jsi jen ${correct}/${total}.\nVáca kroutí hlavou.`);
        return;
      }
      const wordObj = words[current % words.length];
      const shuffled = shuffle(wordObj.word.replace(/ /g, ''));

      container.innerHTML = `
        <div class="minigame-header">
          <div class="minigame-title">🔤 VÁCOVO PŘESMYČKY</div>
          <div class="minigame-desc" style="font-family:var(--font-pixel);font-size:8px;color:var(--clr-text-dim)">${current + 1} / ${total} &nbsp;|&nbsp; ✅ ${correct}</div>
        </div>
        <div class="minigame-area" style="gap:18px;position:relative">
          <div style="font-size:12px;color:var(--clr-text-dim)">💡 <em>${wordObj.hint}</em></div>
          <div style="display:grid;grid-template-columns:repeat(9,1fr);gap:4px;font-family:var(--font-pixel);font-size:10px;color:var(--clr-accent);font-weight:500;max-width:300px;margin:0 auto">${shuffled.split('').map(l => `<div style="background:rgba(255,200,0,0.1);border:1px solid var(--clr-accent);padding:4px;text-align:center;border-radius:4px">${l}</div>`).join('')}</div>
          <div style="font-size:11px;color:var(--clr-text-dim)">${wordObj.word.length} písmen</div>
          <input class="anagram-input" id="ana-input" type="text" placeholder="Tvůj tip..." maxlength="20" autocomplete="off" style="text-transform:uppercase">
          <button class="btn btn-primary" id="ana-submit">POTVRDIT ↵</button>
          <div id="ana-feedback" style="font-size:13px;min-height:20px;font-weight:700"></div>
        </div>
      `;
      const input = document.getElementById('ana-input');
      const submit = document.getElementById('ana-submit');
      const feedback = document.getElementById('ana-feedback');
      input.focus();
      const check = () => {
        AUDIO.SFX.click();
        const val = input.value.trim().toUpperCase().replace(/ /g, '');
        const target = wordObj.word.replace(/ /g, '');
        if (val === target) {
          AUDIO.SFX.success(); correct++;
          feedback.style.color = 'var(--clr-green)'; feedback.textContent = '✅ Správně!';
          setTimeout(() => { current++; render(); }, 800);
        } else {
          AUDIO.SFX.fail();
          feedback.style.color = 'var(--clr-red)'; feedback.textContent = `❌ Špatně! Bylo: ${wordObj.word}`;
          input.value = '';
          setTimeout(() => { current++; render(); }, 1400);
        }
      };
      submit.addEventListener('click', check);
      input.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
    }
    render();
  }

  // ===========================================================
  // 3. SUDOKU 6x6 – Variabilní sudoku, 12-14 čísel, střední-těžká obtížnost
  // ===========================================================
  function startSudoku(container) {
    // 6x6 sudoku s čísly 1-6, těžká obtížnost (15 prázdných)
    const puzzles = [
      {
        full: [
          [1,2,3,4,5,6],
          [4,5,6,1,2,3],
          [2,3,1,5,6,4],
          [5,6,4,2,3,1],
          [3,4,2,6,1,5],
          [6,1,5,3,4,2]
        ],
        blanks: [[0,1],[0,4],[0,5],[1,3],[1,5],[2,0],[2,4],[2,5],[3,2],[3,3],[4,1],[4,3],[4,4],[5,0],[5,2]],
        label: 'Krečdoku 1'
      },
      {
        full: [
          [4,5,6,1,2,3],
          [1,2,3,4,5,6],
          [5,6,4,2,3,1],
          [2,3,1,5,6,4],
          [3,4,2,6,1,5],
          [6,1,5,3,4,2]
        ],
        blanks: [[0,0],[0,3],[0,5],[1,1],[1,4],[2,2],[2,3],[2,5],[3,0],[3,5],[4,0],[4,3],[4,5],[5,1],[5,5]],
        label: 'Krečdoku 2'
      },
      {
        full: [
          [2,3,1,5,6,4],
          [5,6,4,2,3,1],
          [1,2,3,4,5,6],
          [4,5,6,1,2,3],
          [3,4,2,6,1,5],
          [6,1,5,3,4,2]
        ],
        blanks: [[0,1],[0,3],[0,5],[1,2],[1,5],[2,0],[2,2],[2,4],[3,1],[3,2],[3,4],[4,2],[4,4],[5,0],[5,3]],
        label: 'Krečdoku 3'
      }
    ];
    const puz = puzzles[Math.floor(Math.random() * puzzles.length)];
    const puzzle = puz.full.map(r => [...r]);
    puz.blanks.forEach(([r,c]) => puzzle[r][c] = 0);
    let selected = null;
    let userAnswers = {};
    puz.blanks.forEach(([r,c]) => userAnswers[`${r}-${c}`] = 0);

    function renderGame() {
      container.innerHTML = `
        <div class="minigame-header">
          <div class="minigame-title">🔢 KREČDOKU</div>
          <div class="minigame-desc">${puz.label}!</div>
        </div>
        <div class="minigame-area" style="gap:16px;position:relative;align-items:center">
          <div id="sud-grid" style="display:grid;grid-template-columns:repeat(6,1fr);gap:2px;width:min(280px,85vw)"></div>
          <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;max-width:240px" id="sud-numpad"></div>
          <button class="btn btn-primary btn-sm" id="sud-check">ZKONTROLOVAT</button>
          <div id="sud-feedback" style="font-size:13px;min-height:20px;text-align:center;font-weight:700"></div>
        </div>
      `;

      const grid = document.getElementById('sud-grid');
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
          const cell = document.createElement('div');
          cell.style.cssText = `aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:clamp(14px,4vw,22px);font-weight:900;border-radius:4px;border:1px solid #5a3000;cursor:default;`;
          // Silné hranice mezi bloky: 2 řádky × 3 sloupce
          if (r === 2 || r === 4) cell.style.borderTop = '4px solid #d4a574';
          if (c === 3) cell.style.borderLeft = '4px solid #d4a574';
          const key = `${r}-${c}`;
          const isBlank = puz.blanks.find(b => b[0]===r && b[1]===c);
          if (isBlank) {
            cell.style.background = '#2d1a00'; cell.style.color = '#ffe066';
            cell.style.cursor = 'pointer'; cell.dataset.key = key;
            cell.textContent = userAnswers[key] || '';
            cell.addEventListener('click', () => {
              document.querySelectorAll('[data-key]').forEach(el => el.style.outline = 'none');
              cell.style.outline = '2px solid #ff8c00';
              selected = key; AUDIO.SFX.click();
            });
          } else {
            cell.style.background = '#3d2000';
            cell.style.color = '#fff8ee';
            cell.textContent = puz.full[r][c];
          }
          grid.appendChild(cell);
        }
      }

      const numpad = document.getElementById('sud-numpad');
      [1,2,3,4,5,6].forEach(n => {
        const btn = document.createElement('div');
        btn.className = 'sudoku-num';
        btn.textContent = n;
        btn.style.cssText = 'width:28px;height:28px;font-size:13px;font-weight:900;border-radius:6px;';
        btn.addEventListener('click', () => {
          if (!selected) return;
          AUDIO.SFX.click();
          userAnswers[selected] = n;
          document.querySelector(`[data-key="${selected}"]`).textContent = n;
        });
        numpad.appendChild(btn);
      });
      const clearBtn = document.createElement('div');
      clearBtn.className = 'sudoku-num';
      clearBtn.textContent = '✖';
      clearBtn.style.cssText = 'width:32px;height:32px;font-size:16px;font-weight:900;border-radius:6px;background:#8b4513;color:#ff8c00;';
      clearBtn.addEventListener('click', () => {
        if (!selected) return;
        AUDIO.SFX.click();
        userAnswers[selected] = 0;
        document.querySelector(`[data-key="${selected}"]`).textContent = '';
      });
      numpad.appendChild(clearBtn);

      document.getElementById('sud-check').addEventListener('click', () => {
        AUDIO.SFX.click();
        let allCorrect = true;
        puz.blanks.forEach(([r,c]) => {
          const key = `${r}-${c}`;
          const cell = document.querySelector(`[data-key="${key}"]`);
          if (parseInt(userAnswers[key]) === puz.full[r][c]) {
            cell.style.color = '#4ade80';
          } else {
            cell.style.color = '#ff4d6d'; allCorrect = false;
          }
        });
        const fb = document.getElementById('sud-feedback');
        if (allCorrect) {
          fb.style.color = '#4ade80';
          fb.textContent = '✅ Správně! Lubo dává 5⭐!';
          AUDIO.SFX.success();
          setTimeout(() => showResult(true, `KREČDOKU ZVLÁDNUTO!\nVšech 6 čísel!\nLubo je nadšený! 📰`), 1200);
        } else {
          fb.style.color = '#ff4d6d';
          fb.textContent = '❌ Zkus to opravit!'; AUDIO.SFX.fail();
          setTimeout(() => {
            puz.blanks.forEach(([r,c]) => {
              const cell = document.querySelector(`[data-key="${r}-${c}"]`);
              if (cell) cell.style.color = '#ffe066';
            });
            fb.textContent = '';
          }, 1500);
        }
      });
    }
    renderGame();
  }

  // ===========================================================
  // 4. LET LETADLA – fyzika gravitace, šipky mění směr
  // ===========================================================
  function startVlastovka(container) {
    container.innerHTML = `
      <div class="minigame-header">
        <div class="minigame-title">🍖 GRILL MASTER</div>
        <div class="minigame-desc">Upéc 5 kousků masa na dokonalost!</div>
      </div>
      <div class="minigame-area" style="padding:20px;gap:20px;position:relative">
        <canvas id="grill-canvas" width="560" height="240" style="max-width:100%;border-radius:12px;border:3px solid var(--clr-accent);background:#1a1a1a"></canvas>
        <button id="grill-btn" class="btn btn-primary" style="width:100%;font-size:20px;padding:20px;border-radius:12px;font-weight:bold">TAP WHEN READY!</button>
        <div style="display:flex;gap:16px;font-family:var(--font-pixel);font-size:11px">
          <div style="flex:1;text-align:center;padding:12px;background:var(--clr-surface2);border-radius:8px">
            <div style="color:var(--clr-text-dim);margin-bottom:4px">HOTOVÉ</div>
            <div id="grill-success" style="color:var(--clr-green);font-size:16px">0/5</div>
          </div>
          <div style="flex:1;text-align:center;padding:12px;background:var(--clr-surface2);border-radius:8px">
            <div style="color:var(--clr-text-dim);margin-bottom:4px">MASO</div>
            <div id="grill-current" style="color:var(--clr-accent);font-size:16px">1/5</div>
          </div>
        </div>
      </div>
    `;

    const canvas = document.getElementById('grill-canvas');
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const MEATS = 5;
    const BASE_DURATION = 3.2;

    let meats = Array(MEATS).fill(0).map(() => ({ progress: 0 }));
    let currentMeat = 0;
    let success = 0;
    let running = true;
    let lastTime = null;
    let canTap = true;

    function draw(ts) {
      if (!running) return;
      if (!lastTime) { lastTime = ts; requestAnimationFrame(draw); return; }
      const dt = Math.min((ts - lastTime) / 1000, 0.05);
      lastTime = ts;

      if (currentMeat < MEATS) {
        const speedFactor = 1 + currentMeat * 0.2;
        meats[currentMeat].progress = Math.min(1, meats[currentMeat].progress + dt / (BASE_DURATION / speedFactor));
      }

      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = '#333';
      ctx.fillRect(40, 40, W - 80, H - 80);
      ctx.fillStyle = '#444';
      for (let i = 0; i < 5; i++) ctx.fillRect(40 + i * 100, 35, 3, H - 70);

      const barW = W - 80;
      const barH = 50;
      const barX = 40;
      const barY = 80;

      ctx.fillStyle = '#2a2a2a';
      ctx.fillRect(barX, barY, barW, barH);
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;
      ctx.strokeRect(barX, barY, barW, barH);

      const prog = currentMeat < MEATS ? meats[currentMeat].progress : 0;
      const fillW = prog * barW;
      const rawColor = { r: 255, g: 100, b: 80 };
      const perfectColor = { r: 100, g: 200, b: 80 };
      const overcookedColor = { r: 100, g: 80, b: 60 };

      let color;
      if (prog < 0.35) {
        const t = prog / 0.35;
        color = { r: Math.round(rawColor.r * (1 - t) + perfectColor.r * t), g: Math.round(rawColor.g * (1 - t) + perfectColor.g * t), b: Math.round(rawColor.b * (1 - t) + perfectColor.b * t) };
      } else if (prog < 0.65) {
        color = perfectColor;
      } else {
        const t = (prog - 0.65) / 0.35;
        color = { r: Math.round(perfectColor.r * (1 - t) + overcookedColor.r * t), g: Math.round(perfectColor.g * (1 - t) + overcookedColor.g * t), b: Math.round(perfectColor.b * (1 - t) + overcookedColor.b * t) };
      }
      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.fillRect(barX, barY, fillW, barH);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Nunito';
      ctx.textAlign = 'left';
      ctx.fillText('RAW', barX + 8, barY - 8);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#7fffa0';
      ctx.fillText('PERFECT', barX + barW / 2, barY - 8);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ccc';
      ctx.fillText('BURNED', barX + barW - 8, barY - 8);

      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      const halfZone = Math.max(0.045, 0.15 - currentMeat * 0.05);
      const perfectStartPct = 0.50 - halfZone;
      const perfectEndPct = 0.50 + halfZone;
      const perfectStart = barX + barW * perfectStartPct;
      const perfectEnd = barX + barW * perfectEndPct;
      ctx.fillRect(perfectStart, barY, perfectEnd - perfectStart, barH);

      ctx.font = 'bold 48px serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ff9900';
      const meatEmoji = ['🥩', '🍖', '🥩', '🍖', '🥩'];
      ctx.fillText(meatEmoji[currentMeat], W / 2, 160);

      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.font = '24px serif';
      for (let i = 0; i < MEATS; i++) {
        const x = 60 + i * 100;
        const y = 200;
        if (i < success) {
          ctx.fillStyle = '#7fffa0';
          ctx.fillText('✓', x, y);
        } else if (i === currentMeat) {
          ctx.fillStyle = '#ff9900';
          ctx.fillText('→', x, y);
        } else {
          ctx.fillStyle = 'rgba(255,255,255,0.2)';
          ctx.fillText('•', x, y);
        }
      }

      requestAnimationFrame(draw);
    }

    const btn = document.getElementById('grill-btn');
    btn.addEventListener('click', () => {
      if (!canTap || currentMeat >= MEATS) return;
      AUDIO.SFX.click();
      canTap = false;
      const prog = meats[currentMeat].progress;

      // Progressive difficulty: perfect zone shrinks as you progress
      const halfZoneTap = Math.max(0.045, 0.15 - currentMeat * 0.05);
      const perfectStart = 0.50 - halfZoneTap;
      const perfectEnd = 0.50 + halfZoneTap;

      if (prog >= perfectStart && prog <= perfectEnd) {
        success++;
        AUDIO.SFX.success();
        document.getElementById('grill-success').textContent = `${success}/5`;
        btn.style.background = '#7fffa0';
        btn.style.color = '#000';
      } else {
        AUDIO.SFX.fail();
        if (prog < perfectStart) {
          btn.textContent = '❌ TOO RAW!';
        } else {
          btn.textContent = '❌ BURNED!';
        }
        btn.style.background = '#ff6b6b';
      }

      setTimeout(() => {
        currentMeat++;
        if (currentMeat >= MEATS) {
          running = false;
          const win = success >= 4;
          const msg = success === 5
            ? '🔥 GRILL MASTER! 🔥\nVšechna masa dokonalá!'
            : win
              ? `🔥 ${success}/5 SPRÁVNĚ!\nGrilování zvládnuto!`
              : `${success}/5 SPRÁVNĚ\nPříliš mnoho chyb!`;
          showResult(win, msg);
        } else {
          btn.textContent = 'TAP WHEN READY!';
          btn.style.background = '';
          btn.style.color = '';
          document.getElementById('grill-current').textContent = `${currentMeat + 1}/5`;
          canTap = true;
        }
      }, 800);
    });

    window._mgCleanup = () => { running = false; };
    requestAnimationFrame(draw);
  }

  // ===========================================================
  // 5. SVĚTÝLKA – 2 světla na start, 3 pokusy
  // ===========================================================
  function startSvetylka(container) {
    const colors = [
      { id: 0, color: '#dd3333', lit: '#ff9999' },
      { id: 1, color: '#3355dd', lit: '#99aaff' },
      { id: 2, color: '#33aa44', lit: '#88ee99' },
      { id: 3, color: '#ddaa00', lit: '#ffee66' },
    ];
    const totalRounds = 6, maxAttempts = 3;
    let sequence = [], playerSeq = [], round = 1, canClick = false;
    let attempts = 0, startLen = 2, errorRound = 0;

    container.innerHTML = `
      <div class="minigame-header">
        <div class="minigame-title">💡 JANKOVA SVĚTÝLKA</div>
        <div class="minigame-desc">Zopakuj sekvenci! <span id="sv-info" style="font-family:var(--font-pixel);font-size:8px;color:var(--clr-accent)">Kolo 1/6 | Pokusy: 3</span></div>
      </div>
      <div class="minigame-area" style="gap:24px;position:relative">
        <div style="display:flex;gap:16px;justify-content:center" id="sv-lights"></div>
        <div id="sv-status" style="font-family:var(--font-pixel);font-size:9px;color:var(--clr-text-dim);text-align:center">Čekej na sekvenci...</div>
        <button class="btn btn-secondary btn-sm" id="sv-start">START</button>
      </div>
    `;

    const lightsEl = document.getElementById('sv-lights');
    colors.forEach(c => {
      const el = document.createElement('div');
      el.className = 'svetylko';
      el.id = `sv-${c.id}`;
      el.style.cssText = `width:clamp(60px,16vw,85px);height:clamp(60px,16vw,85px);border-radius:14px;border:3px solid rgba(255,255,255,0.2);cursor:pointer;background:${c.color};transition:all 0.1s;`;
      el.addEventListener('click', () => playerClick(c.id));
      lightsEl.appendChild(el);
    });

    function light(id, on) {
      const el = document.getElementById(`sv-${id}`);
      el.style.background = on ? colors[id].lit : colors[id].color;
      el.style.boxShadow = on ? `0 0 28px ${colors[id].lit}` : 'none';
      el.style.transform = on ? 'scale(1.08)' : 'scale(1)';
    }

    function updateInfo() {
      document.getElementById('sv-info').textContent = `Kolo ${round}/${totalRounds} | Pokusy: ${maxAttempts - attempts}`;
    }

    function playSequence() {
      canClick = false;
      document.getElementById('sv-status').textContent = 'Sleduj sekvenci...';
      let delay = 500;
      sequence.forEach((id, i) => {
        setTimeout(() => { light(id, true); AUDIO.SFX.click(); }, delay + i * 650);
        setTimeout(() => light(id, false), delay + i * 650 + 380);
      });
      setTimeout(() => {
        canClick = true; playerSeq = [];
        document.getElementById('sv-status').textContent = 'Teď ty! Zopakuj sekvenci.';
      }, delay + sequence.length * 650 + 300);
    }

    function playSequenceFromRound(fromRound) {
      // Generate sequence starting from fromRound onwards
      const len = startLen + totalRounds - 1;
      const fullSeq = Array.from({ length: len }, () => Math.floor(Math.random() * 4));
      sequence = fullSeq;
      round = fromRound;
      updateInfo();
      canClick = false;
      document.getElementById('sv-status').textContent = `Opakuji od kola ${fromRound}...`;
      let delay = 500;
      // Play only up to the length needed for this round
      const roundLen = startLen + round - 1;
      for (let i = 0; i < Math.min(roundLen, sequence.length); i++) {
        const id = sequence[i];
        setTimeout(() => { light(id, true); AUDIO.SFX.click(); }, delay + i * 650);
        setTimeout(() => light(id, false), delay + i * 650 + 380);
      }
      setTimeout(() => {
        canClick = true; playerSeq = [];
        document.getElementById('sv-status').textContent = `Teď ty! Zopakuj sekvenci od kola ${round}.`;
      }, delay + Math.min(roundLen, sequence.length) * 650 + 300);
    }

    function playerClick(id) {
      if (!canClick) return;
      AUDIO.SFX.click();
      light(id, true); setTimeout(() => light(id, false), 180);
      playerSeq.push(id);
      const idx = playerSeq.length - 1;
      if (playerSeq[idx] !== sequence[idx]) {
        AUDIO.SFX.fail(); canClick = false; attempts++;
        updateInfo();
        if (attempts >= maxAttempts) {
          showResult(false, `Vyčerpal jsi 3 pokusy!\nJanek je smutný. 😢`); return;
        }
        errorRound = round;
        document.getElementById('sv-status').textContent = `❌ Chyba! Zbývá ${maxAttempts - attempts} pokus(ů). Opakuji od kola ${round}...`;
        playerSeq = [];
        updateInfo();
        setTimeout(() => playSequenceFromRound(errorRound), 1800);
        return;
      }
      if (playerSeq.length === sequence.length) {
        AUDIO.SFX.success();
        if (round >= totalRounds) {
          showResult(true, `GENIÁLNÍ!\nVšech 6 kol!\nJanek ti dá Plzníňku! 🍺`);
        } else {
          round++;
          document.getElementById('sv-status').textContent = `✅ Správně! Kolo ${round}...`;
          updateInfo();
          setTimeout(() => nextRound(), 1100);
        }
      }
    }

    function nextRound() {
      const len = startLen + round - 1;
      sequence = Array.from({ length: len }, () => Math.floor(Math.random() * 4));
      updateInfo();
      setTimeout(() => playSequence(), 500);
    }

    document.getElementById('sv-start').addEventListener('click', () => {
      document.getElementById('sv-start').style.display = 'none';
      nextRound();
    });
  }

  // ===========================================================
  // 6. ŠIBENICE
  // ===========================================================
  function startSibenice(container) {
    const wordList = GAME_DATA.hangmanWords.slice().sort(() => Math.random() - 0.5).slice(0, 5);
    let wordIdx = 0, correct = 0, maxErrors = 5, showHint = false;

    function renderWord() {
      const wordObj = wordList[wordIdx];
      if (!wordObj) {
        if (correct >= 4) showResult(true, `VÝBORNĚ!\nUhodl jsi ${correct}/5 slov!\nJarda nabízí drink! ⛳`);
        else showResult(false, `Bohužel...\n${correct}/5 slov.\nJarda kroutí hlavou.`);
        return;
      }
      const word = wordObj.word.toUpperCase();
      let guessed = new Set(), errors = 0;

      function guessLetter(ch) {
        if (guessed.has(ch)) return;
        AUDIO.SFX.click();
        guessed.add(ch);
        if (!word.includes(ch)) errors++;
        rerender();
      }

      function rerender() {
        const figs = ['🙂','😐','😟','😨','😱','☠️'];
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ';
        container.innerHTML = `
          <div class="minigame-header">
            <div class="minigame-title">🪢 ŠIBENICE PANA FRANCE</div>
            <div class="minigame-desc">Slovo ${wordIdx+1}/5 | ✅ ${correct}/4 pro výhru</div>
          </div>
          <div class="minigame-area" style="gap:12px;position:relative">
            <div style="display:flex;align-items:center;justify-content:space-between;width:100%">
              <div style="font-size:36px">${figs[Math.min(errors,6)]}</div>
              <div style="flex:1;margin:0 12px;height:6px;background:var(--clr-surface2);border-radius:3px;overflow:hidden">
                <div style="height:100%;width:${(maxErrors-errors)/maxErrors*100}%;background:var(--clr-green);transition:width 0.3s"></div>
              </div>
              <div style="font-family:var(--font-pixel);font-size:11px;color:var(--clr-red);white-space:nowrap">❌${errors}/${maxErrors}</div>
            </div>
            <div id="hang-word" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;min-height:50px"></div>
            <button id="hint-btn" style="align-self:center;background:rgba(255,200,50,0.2);border:2px solid #ffc832;color:#ffc832;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:700;transition:all 0.2s">💡 ${showHint ? 'Skrýt hint' : 'Hint'}</button>
            ${showHint ? `<div style="background:rgba(255,200,50,0.1);border-left:4px solid #ffc832;padding:12px;border-radius:4px;font-size:14px;color:var(--clr-text);text-align:center;font-weight:600">${wordObj.hint}</div>` : ''}
            <div id="hang-kb" style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;max-width:100%;width:100%"></div>
          </div>
        `;
        const wordEl = document.getElementById('hang-word');
        let allRevealed = true;
        word.split('').forEach(ch => {
          const el = document.createElement('div');
          if (ch === ' ') { el.style.cssText = 'width:12px;height:40px;'; }
          else {
            el.style.cssText = `width:32px;height:40px;border-bottom:3px solid var(--clr-text-dim);display:flex;align-items:flex-end;justify-content:center;font-size:22px;font-weight:900;color:var(--clr-text);padding-bottom:2px;transition:all 0.2s;`;
            if (guessed.has(ch)) {
              el.textContent = ch;
              el.style.color = 'var(--clr-green)';
            } else {
              allRevealed = false;
            }
          }
          wordEl.appendChild(el);
        });
        if (allRevealed) {
          AUDIO.SFX.success();
          correct++;
          setTimeout(() => { showHint = false; wordIdx++; renderWord(); }, 900);
          return;
        }
        if (errors >= maxErrors) {
          AUDIO.SFX.fail();
          wordEl.querySelectorAll('div').forEach((el,i) => { if (word[i] && word[i] !== ' ') { el.textContent = word[i]; el.style.color='var(--clr-red)'; } });
          setTimeout(() => { showHint = false; wordIdx++; renderWord(); }, 1600);
          return;
        }
        document.getElementById('hint-btn').addEventListener('click', () => { showHint = !showHint; rerender(); });
        const kb = document.getElementById('hang-kb');
        alphabet.split('').forEach(ch => {
          const btn = document.createElement('div');
          btn.style.cssText = `width:100%;aspect-ratio:1;background:var(--clr-surface2);border:2px solid var(--clr-border);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;cursor:pointer;color:var(--clr-text);transition:all 0.15s;`;
          btn.textContent = ch;
          if (guessed.has(ch)) {
            const hit = word.includes(ch);
            btn.style.borderColor = hit ? 'var(--clr-green)' : 'var(--clr-red)';
            btn.style.background = hit ? 'rgba(74,222,128,0.15)' : 'rgba(255,76,109,0.15)';
            btn.style.color = hit ? 'var(--clr-green)' : 'var(--clr-red)';
            btn.style.cursor = 'default';
            btn.style.opacity = '0.6';
          } else {
            btn.addEventListener('click', () => guessLetter(ch));
            btn.addEventListener('mouseover', () => { btn.style.borderColor = 'var(--clr-primary)'; btn.style.transform = 'scale(1.05)'; });
            btn.addEventListener('mouseout', () => { btn.style.borderColor = 'var(--clr-border)'; btn.style.transform = 'scale(1)'; });
          }
          kb.appendChild(btn);
        });
      }
      rerender();
    }

    document.addEventListener('keydown', (e) => {
      const ch = e.key.toUpperCase();
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ';
      if (alphabet.includes(ch)) guessLetter(ch);
    });

    renderWord();
  }

  // ===========================================================
  // 7. KVÍZ (Dr. Fíša)
  // ===========================================================
  function startKviz(container) {
    const questions = GAME_DATA.quizQuestions.slice().sort(() => Math.random() - 0.5);
    let qIdx = 0, correct = 0, wrong = 0;
    let timeLeft = 15, timerInterval = null;

    function renderQ() {
      if (qIdx >= 5) {
        if (timerInterval) clearInterval(timerInterval);
        if (wrong <= 1) showResult(true, `VÝBORNĚ!\n${correct}/5 správných!\nDr. Fíša tleská! 🩺`);
        else showResult(false, `Příliš mnoho chyb: ${wrong}.\nDr. Fíša tě vyhazuje!`);
        return;
      }

      timeLeft = 15;
      const q = questions[qIdx];
      const pct = ((qIdx) / 5) * 100;

      container.innerHTML = `
        <div class="minigame-header">
          <div class="minigame-title">🩺 ORDINACE DR. FÍŠE</div>
          <div class="minigame-desc" style="font-family:var(--font-pixel);font-size:8px">Otázka ${qIdx+1}/5 | Chyby: ${wrong}/2 | Čas: <span id="quiz-timer">15</span>s</div>
        </div>
        <div class="minigame-area" style="gap:12px;position:relative">
          <div style="flex:1;height:6px;background:#3d2000;border-radius:3px;overflow:hidden">
            <div id="quiz-bar" style="height:100%;background:#4ade80;border-radius:3px;width:${pct}%;transition:width 0.3s"></div>
          </div>
          <div style="font-size:clamp(14px,2.5vw,18px);font-weight:700;text-align:center;line-height:1.5">${q.q}</div>
          <div id="quiz-opts" style="display:flex;flex-direction:column;gap:10px;width:100%"></div>
          <div id="quiz-fb" style="font-size:13px;min-height:40px;text-align:center;font-weight:700"></div>
        </div>
      `;

      const opts = document.getElementById('quiz-opts');
      const timerEl = document.getElementById('quiz-timer');

      timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          opts.querySelectorAll('div').forEach(b => { b.style.pointerEvents='none'; });
          document.getElementById('quiz-fb').style.color='#ff4d6d';
          document.getElementById('quiz-fb').textContent='❌ Čas vypršel!\n(Automaticky pokračuji...)';
          AUDIO.SFX.fail(); wrong++;
          setTimeout(() => { qIdx++; renderQ(); }, 1500);
        }
      }, 1000);

      q.options.forEach((opt, i) => {
        const btn = document.createElement('div');
        btn.style.cssText = `background:#3d2000;border:2px solid #5a3000;border-radius:10px;padding:12px 16px;cursor:pointer;font-size:14px;color:#fff8ee;transition:all 0.2s;font-weight:600;`;
        btn.textContent = opt;
        btn.addEventListener('mouseover', () => btn.style.borderColor='#ff8c00');
        btn.addEventListener('mouseout', () => { if (!btn.dataset.answered) btn.style.borderColor='#5a3000'; });
        btn.addEventListener('click', () => {
          clearInterval(timerInterval);
          opts.querySelectorAll('div').forEach(b => { b.style.pointerEvents='none'; b.dataset.answered='1'; });
          if (i === q.correct) {
            btn.style.borderColor='#4ade80'; btn.style.background='#0a2a0a';
            AUDIO.SFX.success(); correct++;
            document.getElementById('quiz-fb').style.color='#4ade80';
            document.getElementById('quiz-fb').innerHTML=`✅ Správně!<div style="font-size:13px;margin-top:8px;font-weight:500;line-height:1.5">${q.explanation}</div>`;
          } else {
            btn.style.borderColor='#ff4d6d'; btn.style.background='#2a0a0a';
            opts.querySelectorAll('div')[q.correct].style.borderColor='#4ade80';
            AUDIO.SFX.fail(); wrong++;
            document.getElementById('quiz-fb').style.color='#ff4d6d';
            document.getElementById('quiz-fb').innerHTML=`❌ Špatně!<div style="font-size:13px;margin-top:8px;font-weight:500;line-height:1.5">${q.explanation}</div>`;
          }
          setTimeout(() => { qIdx++; renderQ(); }, 4000);
        });
        opts.appendChild(btn);
      });
    }
    renderQ();
  }

  // ===========================================================
  // 8. NATOČ PIVO – větší sklenice, pomalejší kapky, 5 miss
  // ===========================================================
  function startNatocPivo(container) {
    container.innerHTML = `
      <div class="minigame-header">
        <div class="minigame-title">🍺 CHYTEJ PIVO!</div>
        <div class="minigame-desc">Načepuj dokonalé pivo! Max 5 kapek může přijít nazmar. ← → pohyb</div>
      </div>
      <div class="minigame-area" style="padding:8px;gap:10px;position:relative">
        <canvas id="pivo-canvas" width="440" height="300" style="max-width:100%;border-radius:12px"></canvas>
        <div style="display:flex;gap:16px;justify-content:center">
          <button class="btn btn-secondary btn-sm" id="piv-left" style="font-size:20px;padding:12px 28px">⬅️</button>
          <button class="btn btn-secondary btn-sm" id="piv-right" style="font-size:20px;padding:12px 28px">➡️</button>
        </div>
        <div style="display:flex;gap:20px;justify-content:center;font-family:var(--font-pixel);font-size:9px">
          <span>Chyceno: <span id="piv-score" style="color:var(--clr-green)">0</span> / 20</span>
          <span>Ztraceno: <span id="piv-miss" style="color:var(--clr-red)">0</span> / 5</span>
        </div>
      </div>
    `;

    const canvas = document.getElementById('pivo-canvas');
    const ctx2 = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    let glass = { x: W/2, w: 80, h: 50 };
    const GLASS_Y = H - 55;
    let drops = [], score = 0, missed = 0;
    let running = true, started = false, lastTime = null;
    let moveLeft = false, moveRight = false, spawnTimer = 0;

    function draw(ts) {
      if (!running) return;
      if (!lastTime) { lastTime = ts; requestAnimationFrame(draw); return; }
      const dt = Math.min((ts - lastTime)/1000, 0.05);
      lastTime = ts;

      ctx2.clearRect(0,0,W,H);
      // BG - Grill theme (dark with orange glow)
      const bg = ctx2.createLinearGradient(0,0,0,H);
      bg.addColorStop(0,'#2a1810'); bg.addColorStop(1,'#1a1010');
      ctx2.fillStyle = bg; ctx2.fillRect(0,0,W,H);
      // Grill glow
      ctx2.fillStyle = 'rgba(255,150,50,0.05)'; ctx2.fillRect(0,0,W,H);

      // Bar counter
      ctx2.fillStyle = '#3a2820'; ctx2.fillRect(0,H-65,W,65);
      ctx2.fillStyle = '#ff8844'; ctx2.fillRect(0,H-67,W,3);

      // Tap pipes at top
      const taps = [70, 200, 340];
      taps.forEach(x => {
        ctx2.fillStyle = '#888'; ctx2.fillRect(x-5,0,10,30);
        ctx2.fillStyle = '#aaa'; ctx2.fillRect(x-12,28,24,10);
        ctx2.font = '18px serif'; ctx2.fillText('🍺',x-10,28);
      });

      if (started) {
        const speed = 200 + score * 5;
        if (moveLeft) glass.x = Math.max(glass.w/2+10, glass.x - 220*dt);
        if (moveRight) glass.x = Math.min(W-glass.w/2-10, glass.x + 220*dt);

        // Spawn drops from taps
        spawnTimer += dt;
        const spawnInt = Math.max(0.8, 1.6 - score*0.03);
        if (spawnTimer > spawnInt) {
          const tap = taps[Math.floor(Math.random()*taps.length)];
          drops.push({ x: tap + (Math.random()-0.5)*20, y: 38, vy: 80 + Math.random()*60, r: 12 });
          spawnTimer = 0;
        }

        drops.forEach(d => {
          d.vy = Math.min(d.vy + 80*dt, speed);
          d.y += d.vy * dt;
        });

        // Check caught / missed
        drops.forEach(d => {
          if (d.done) return;
          if (d.y > GLASS_Y - glass.h/2 && d.y < GLASS_Y + 10 && Math.abs(d.x - glass.x) < glass.w/2 + d.r) {
            d.done = true; d.caught = true;
            score++;
            document.getElementById('piv-score').textContent = score;
            AUDIO.SFX.tick();
            if (score >= 20) { running = false; setTimeout(() => showResult(true, `KRÁSNĚ OROSENÝ PŮLITR! 🍺\nJe vidět, že si s pípou rozumíš!\nTak na zdraví!`), 200); }
          } else if (d.y > H + 10 && !d.caught) {
            d.done = true; missed++;
            document.getElementById('piv-miss').textContent = missed;
            AUDIO.SFX.fail();
            if (missed >= 5) { running = false; setTimeout(() => showResult(false, `5 kusů ti spadlo!\nChytil jsi jen ${score}/20.\nMaso je spálené!`), 200); }
          }
        });
        drops = drops.filter(d => !d.done);
      }

      // Draw drops
      drops.forEach(d => {
        const grad = ctx2.createRadialGradient(d.x-3, d.y-3, 1, d.x, d.y, d.r);
        grad.addColorStop(0,'#ffe88a'); grad.addColorStop(1,'#c8960a');
        ctx2.fillStyle = grad;
        ctx2.beginPath(); ctx2.arc(d.x, d.y, d.r, 0, Math.PI*2); ctx2.fill();
        // Foam top
        ctx2.fillStyle = 'rgba(255,255,255,0.5)';
        ctx2.beginPath(); ctx2.ellipse(d.x, d.y-d.r+3, d.r*0.7, d.r*0.35, 0, 0, Math.PI*2); ctx2.fill();
      });

      // Draw glass
      const fillH = Math.min(glass.h, (score/20)*glass.h);
      // Beer fill
      ctx2.fillStyle = 'rgba(200,150,20,0.6)';
      ctx2.fillRect(glass.x-glass.w/2+4, GLASS_Y-fillH, glass.w-8, fillH);
      // Foam
      if (fillH > 5) {
        ctx2.fillStyle = 'rgba(255,255,255,0.7)';
        ctx2.fillRect(glass.x-glass.w/2+4, GLASS_Y-fillH-6, glass.w-8, 10);
      }
      // Glass outline
      ctx2.strokeStyle = 'rgba(180,220,255,0.8)'; ctx2.lineWidth = 4;
      ctx2.strokeRect(glass.x-glass.w/2, GLASS_Y-glass.h, glass.w, glass.h);
      // Handle
      ctx2.strokeStyle = 'rgba(180,220,255,0.5)'; ctx2.lineWidth = 3;
      ctx2.beginPath();
      ctx2.arc(glass.x+glass.w/2+10, GLASS_Y-glass.h/2, 12, -Math.PI/2, Math.PI/2);
      ctx2.stroke();

      if (!started) {
        ctx2.fillStyle='rgba(0,0,0,0.6)'; ctx2.fillRect(0,0,W,H);
        ctx2.fillStyle='#fff'; ctx2.font='bold 15px Nunito';
        ctx2.textAlign='center'; ctx2.fillText('Stiskni ← / → pro start!', W/2, H/2);
        ctx2.textAlign='left';
      }
      requestAnimationFrame(draw);
    }

    document.addEventListener('keydown', ph);
    document.addEventListener('keyup', phu);
    document.getElementById('piv-left').addEventListener('mousedown', () => { if(!started)started=true; moveLeft=true; });
    document.getElementById('piv-left').addEventListener('mouseup', () => moveLeft=false);
    document.getElementById('piv-left').addEventListener('touchstart', e=>{e.preventDefault();if(!started)started=true;moveLeft=true;},{passive:false});
    document.getElementById('piv-left').addEventListener('touchend', ()=>moveLeft=false);
    document.getElementById('piv-right').addEventListener('mousedown', () => { if(!started)started=true; moveRight=true; });
    document.getElementById('piv-right').addEventListener('mouseup', () => moveRight=false);
    document.getElementById('piv-right').addEventListener('touchstart', e=>{e.preventDefault();if(!started)started=true;moveRight=true;},{passive:false});
    document.getElementById('piv-right').addEventListener('touchend', ()=>moveRight=false);
    function ph(e){if(e.key==='ArrowLeft'){e.preventDefault();if(!started)started=true;moveLeft=true;}if(e.key==='ArrowRight'){e.preventDefault();if(!started)started=true;moveRight=true;}}
    function phu(e){if(e.key==='ArrowLeft')moveLeft=false;if(e.key==='ArrowRight')moveRight=false;}
    window._mgCleanup=()=>{running=false;document.removeEventListener('keydown',ph);document.removeEventListener('keyup',phu);};
    requestAnimationFrame(draw);
  }

  // ===========================================================
  // 9. HLEDÁNÍ ROZDÍLŮ – Fotky ze Kostelů
  // ===========================================================
  function startRozdily(container) {
    const setIdx = Math.random() < 0.5 ? '01' : '02';
    const origImg = `Pictures/Compare photos/Photo_${setIdx}A.png`;
    const diffImg = `Pictures/Compare photos/Photo_${setIdx}B.png`;
    const changesImg = `Pictures/Compare photos/Photo_${setIdx}_changes.png`;

    let timeLeft = 120, found = 0, timerInterval;
    let differences = [];
    let foundZones = new Set();

    container.innerHTML = `
      <div class="minigame-header">
        <div class="minigame-title">🔍 NAJDI ROZDÍLY V KOSTELE</div>
        <div class="minigame-desc">Klikni na rozdíly! <span id="rdiff-time" style="color:var(--clr-accent);font-family:var(--font-pixel);font-size:9px">⏱ 120s</span></div>
      </div>
      <div class="minigame-area" style="flex-direction:column;gap:12px;position:relative;align-items:center">
        <div style="font-family:var(--font-pixel);font-size:9px;color:var(--clr-text-dim)">Nalezeno: <span id="rdiff-count" style="color:var(--clr-green)">0</span> / <span id="rdiff-total">?</span></div>
        <div style="display:flex;flex-direction:column;gap:8px;width:100%;max-width:600px;align-items:center">
          <div style="width:100%;text-align:center;font-size:9px;color:var(--clr-text-dim);font-family:var(--font-pixel)">ORIGINÁL</div>
          <img id="rdiff-orig" src="${origImg}" style="width:100%;max-width:540px;border:2px solid var(--clr-border);border-radius:8px;display:block">

          <div style="width:100%;text-align:center;font-size:9px;color:var(--clr-text-dim);font-family:var(--font-pixel);margin-top:8px">HLEDEJ ROZDÍLY</div>
          <div style="position:relative;width:100%;max-width:540px;display:inline-block" id="rdiff-container">
            <img id="rdiff-img" src="${diffImg}" style="width:100%;display:block;border:2px solid var(--clr-border);border-radius:8px;cursor:crosshair">
          </div>
        </div>
        <div id="rdiff-found-list" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;max-width:540px"></div>
        <img id="rdiff-changes-img" src="${changesImg}" style="display:none">
      </div>
    `;

    // Extrahuj rozdíly z foto mapy
    const extractDifferences = () => {
      const changesImgEl = document.getElementById('rdiff-changes-img');
      const doExtract = () => {
        if (!changesImgEl.complete || changesImgEl.naturalWidth === 0) {
          setTimeout(doExtract, 100);
          return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = changesImgEl.naturalWidth;
        canvas.height = changesImgEl.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(changesImgEl, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        const redPixels = new Set();
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
          // Detekuj čistě červené kruhy/značky (velmi vysoké R, nízké G a B)
          if (a > 220 && r > 180 && r > g + 80 && r > b + 80) {
            redPixels.add(i / 4);
          }
        }

        // Skupiny pixelů do clusterů
        const clusters = [];
        const visited = new Set();
        const width = canvas.width;

        redPixels.forEach(pixelIdx => {
          if (visited.has(pixelIdx)) return;
          const cluster = [];
          const queue = [pixelIdx];

          while (queue.length > 0) {
            const idx = queue.shift();
            if (visited.has(idx) || !redPixels.has(idx)) continue;
            visited.add(idx);
            cluster.push(idx);

            const row = Math.floor(idx / width);
            const col = idx % width;
            const neighbors = [
              (row-1)*width + col, (row+1)*width + col,
              row*width + (col-1), row*width + (col+1)
            ];
            neighbors.forEach(n => {
              if (!visited.has(n) && redPixels.has(n)) queue.push(n);
            });
          }

          if (cluster.length > 50) clusters.push(cluster);
        });

        // Střed a velikost clusteru
        differences = clusters.map((cluster, clusterIdx) => {
          let sumX = 0, sumY = 0;
          cluster.forEach(idx => {
            sumX += idx % width;
            sumY += Math.floor(idx / width);
          });
          return {
            x: sumX / cluster.length,
            y: sumY / cluster.length,
            found: false,
            idx: clusterIdx,
            size: cluster.length
          };
        });

        document.getElementById('rdiff-total').textContent = differences.length;
        setupClickZones();
      };

      if (changesImgEl.complete) {
        doExtract();
      } else {
        changesImgEl.addEventListener('load', doExtract);
      }
    };

    const setupClickZones = () => {
      const container = document.getElementById('rdiff-container');
      const imgEl = document.getElementById('rdiff-img');

      const doSetup = () => {
        if (!imgEl.complete || imgEl.naturalWidth === 0) {
          setTimeout(doSetup, 100);
          return;
        }

        const scaleX = imgEl.width / imgEl.naturalWidth;
        const scaleY = imgEl.height / imgEl.naturalHeight;

        differences.forEach(d => {
          const zone = document.createElement('div');
          const size = 50;
          zone.style.cssText = `
            position:absolute;
            left:${(d.x * scaleX)}px;
            top:${(d.y * scaleY)}px;
            width:${size}px;
            height:${size}px;
            transform:translate(-50%,-50%);
            cursor:pointer;
            border:2px dashed rgba(255,100,100,0.4);
            border-radius:50%;
            transition:all 0.2s;
            z-index:100;
            pointer-events:auto;
            user-select:none;
          `;
          zone.dataset.idx = d.idx;
          zone.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (d.found) return;
            d.found = true;
            foundZones.add(d.idx);
            found++;
            try { AUDIO.SFX.success(); } catch (err) {}
            zone.style.border = '2px solid var(--clr-green)';
            zone.style.background = 'rgba(74,222,128,0.3)';
            zone.style.boxShadow = '0 0 0 3px rgba(74,222,128,0.2) inset';
            zone.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:24px;font-weight:bold">✅</div>';
            document.getElementById('rdiff-count').textContent = found;

            const list = document.getElementById('rdiff-found-list');
            const chip = document.createElement('div');
            chip.style.cssText = 'background:var(--clr-surface);border:1px solid var(--clr-green);border-radius:6px;padding:4px 10px;font-size:10px;color:var(--clr-green);font-family:var(--font-pixel)';
            chip.textContent = `✅ #${found}`;
            list.appendChild(chip);

            if (found === differences.length) {
              clearInterval(timerInterval);
              setTimeout(() => showResult(true, `OSTŘÍŽ!\nVšechny ${differences.length} rozdíly!\nJan Hus ti žehná! ⛪`), 400);
            }
          });
          container.appendChild(zone);
        });
      };

      if (imgEl.complete) {
        doSetup();
      } else {
        imgEl.addEventListener('load', doSetup);
      }
    };

    timerInterval = setInterval(() => {
      timeLeft--;
      const el = document.getElementById('rdiff-time');
      if (el) {
        el.textContent = `⏱ ${timeLeft}s`;
        el.style.color = timeLeft < 20 ? 'var(--clr-red)' : 'var(--clr-accent)';
      }
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        const success = found >= Math.max(2, Math.ceil(differences.length * 0.6));
        showResult(
          success,
          success
            ? `Čas! Našel jsi ${found}/${differences.length} – stačí! ⛪`
            : `Čas! Jen ${found}/${differences.length}.\nJan Hus je smutný.`
        );
      }
    }, 1000);

    window._mgCleanup = () => clearInterval(timerInterval);
    extractDifferences();
  }

  // ===========================================================
  // 10. NOVÁ SPORTOVNÍ HRA – Vzpírání! (nahrazuje Angličáky)
  // Hráč ťuká/kliká ve správném rytmu aby zvedl činkové břemeno
  // ===========================================================
  function startHledejIngredient(container) {
    const ingredients = [
      { emoji: '🥩', name: 'Maso' },
      { emoji: '🍗', name: 'Kuřecí' },
      { emoji: '🌭', name: 'Párek' },
      { emoji: '🍄', name: 'Houby' },
      { emoji: '🧅', name: 'Cibule' },
      { emoji: '🫑', name: 'Paprika' },
      { emoji: '🍅', name: 'Rajče' },
      { emoji: '🥒', name: 'Okurka' },
      { emoji: '🥔', name: 'Brambora' },
      { emoji: '🧄', name: 'Česnek' },
      { emoji: '🌶️', name: 'Chili' },
      { emoji: '🧀', name: 'Sýr' },
      { emoji: '🍞', name: 'Chléb' },
      { emoji: '🥬', name: 'Saláta' },
      { emoji: '🧈', name: 'Máslo' },
      { emoji: '🧂', name: 'Sůl' },
      { emoji: '🍖', name: 'Kotleta' },
      { emoji: '🍚', name: 'Rýže' },
      { emoji: '🥖', name: 'Cibatta' },
      { emoji: '🌰', name: 'Ořechy' },
      { emoji: '🍯', name: 'Med' },
      { emoji: '🥕', name: 'Mrkev' },
      { emoji: '🥦', name: 'Brokolice' },
      { emoji: '🌽', name: 'Kukuřice' },
      { emoji: '🫒', name: 'Olej' },
      { emoji: '🌿', name: 'Oregáno' },
      { emoji: '🍋', name: 'Citron' },
      { emoji: '🍝', name: 'Těstoviny' },
      { emoji: '🥚', name: 'Vejce' },
      { emoji: '🥐', name: 'Croissant' },
      { emoji: '🥜', name: 'Arašídy' },
      { emoji: '🍶', name: 'Sojovka' },
      { emoji: '🥛', name: 'Mléko' },
      { emoji: '🍫', name: 'Čokoláda' },
      { emoji: '🍆', name: 'Lilek' },
      { emoji: '🎋', name: 'Bazalka' }
    ];

    let score = 0, fails = 0, running = true, timeLeft = 3;
    let currentTask = null, taskStartTime = null;
    let gridItems = [];

    container.innerHTML = `
      <div class="minigame-header">
        <div class="minigame-title">🔍 HLEDEJ INGREDIENCI!</div>
        <div class="minigame-desc" style="font-family:var(--font-pixel);font-size:8px;color:var(--clr-text-dim)">
          Správně: <span id="score-display" style="color:var(--clr-green)">0</span> / 8 &nbsp;|&nbsp; Chyby: <span id="fail-display" style="color:var(--clr-red)">0</span> / 3
        </div>
      </div>
      <div class="minigame-area" style="flex-direction:column;gap:10px;position:relative">

        <!-- Velký zobrazovač hledané ingredience -->
        <div id="task-display" style="text-align:center;padding:8px 0 4px;min-height:90px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px">
          <span style="font-size:12px;font-family:var(--font-pixel);color:var(--clr-text-dim)">Čekám...</span>
        </div>

        <!-- Odpočet: číselný + barevný bar -->
        <div style="display:flex;align-items:center;gap:10px;width:100%">
          <div style="flex:1;position:relative;height:10px;background:var(--clr-surface2);border-radius:5px;overflow:hidden">
            <div id="time-bar" style="height:100%;background:var(--clr-green);width:100%;border-radius:5px;transition:width 0.05s linear"></div>
          </div>
          <div id="time-counter" style="font-family:var(--font-pixel);font-size:18px;color:var(--clr-green);min-width:24px;text-align:right;line-height:1">5</div>
        </div>

        <!-- Mřížka ingrediencí -->
        <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;padding:12px;background:rgba(0,0,0,0.2);border-radius:8px">
          ${ingredients.map((ing,i) => `<div class="ing-item" data-idx="${i}" style="font-size:32px;text-align:center;cursor:pointer;padding:8px;border-radius:6px;background:var(--clr-surface);transition:all 0.2s;user-select:none">${ing.emoji}</div>`).join('')}
        </div>
      </div>
    `;

    const ingItems = container.querySelectorAll('.ing-item');
    gridItems = Array.from(ingItems);

    function shuffleArray(arr) {
      return arr.sort(() => Math.random() - 0.5);
    }

    function startNewTask() {
      if (!running) return;
      taskStartTime = Date.now();
      timeLeft = 5;
      currentTask = shuffleArray([...ingredients])[0];
      document.getElementById('task-display').innerHTML = `
        <div style="font-size:68px;line-height:1">${currentTask.emoji}</div>
        <div style="font-family:var(--font-pixel);font-size:9px;color:var(--clr-text-dim);margin-top:4px;letter-spacing:1px">NAJDI: <span style="color:var(--clr-accent)">${currentTask.name.toUpperCase()}</span></div>
      `;
      document.getElementById('time-bar').style.width = '100%';
      document.getElementById('time-counter').textContent = '5';
    }

    function handleClick(e) {
      if (!running || !currentTask) return;
      const idx = parseInt(e.target.dataset.idx);
      const selected = ingredients[idx];
      const correct = selected.name === currentTask.name;

      if (correct) {
        console.log('CORRECT! Playing success sound...');
        AUDIO.SFX.success();
        console.log('Success sound played, incrementing score...');
        score++;
        console.log('Score incremented to:', score);
        e.target.style.background = 'rgba(74,222,128,0.6)';
        e.target.style.transform = 'scale(1.1)';
        document.getElementById('score-display').textContent = score;
        console.log('DOM updated, score display:', document.getElementById('score-display').textContent);
        if (score >= 8) {
          running = false;
          setTimeout(() => showResult(true, `MISTNÍ HLEDAČ! 🔍\nNašel jsi všech 8!\nIngrediencí je mistr!`), 200);
        }
        setTimeout(startNewTask, 500);
      } else {
        console.log('INCORRECT! Playing fail sound...');
        AUDIO.SFX.fail();
        console.log('Fail sound played, incrementing fails...');
        fails++;
        console.log('Fails incremented to:', fails);
        e.target.style.background = 'rgba(255,76,109,0.6)';
        e.target.style.transform = 'scale(0.95)';
        document.getElementById('fail-display').textContent = fails;
        if (fails >= 3) {
          running = false;
          setTimeout(() => showResult(false, `3 chyby!\nNašel jsi ${score}/8.\nPracticky blbě!`), 200);
        }
      }

      setTimeout(() => {
        e.target.style.background = 'var(--clr-surface)';
        e.target.style.transform = 'scale(1)';
      }, 200);
    }

    gridItems.forEach(item => item.addEventListener('click', handleClick));

    function update() {
      if (!running || !currentTask) {
        if (running) startNewTask();
        return;
      }
      const elapsed = (Date.now() - taskStartTime) / 1000;
      timeLeft = Math.max(0, 5 - elapsed);
      const barWidth = (timeLeft / 5) * 100;
      const barColor = timeLeft > 2 ? 'var(--clr-green)' : timeLeft > 1 ? '#f39c12' : 'var(--clr-red)';
      document.getElementById('time-bar').style.width = barWidth + '%';
      document.getElementById('time-bar').style.background = barColor;
      const counter = document.getElementById('time-counter');
      if (counter) { counter.textContent = Math.ceil(timeLeft); counter.style.color = barColor; }

      if (timeLeft <= 0) {
        AUDIO.SFX.fail();
        fails++;
        document.getElementById('fail-display').textContent = fails;
        if (fails >= 3) {
          running = false;
          setTimeout(() => showResult(false, `Čas vypršel!\nNašel jsi ${score}/8.\nMěl jsi být rychlejší!`), 200);
        } else {
          startNewTask();
        }
      }
    }

    window._mgCleanup = () => { running = false; };
    startNewTask();
    setInterval(update, 50);
  }

  function startAnglicaky(container) {
    container.innerHTML = `
      <div class="minigame-header">
        <div class="minigame-title">🏋️ VZPÍRÁNÍ S TRENÉRKOU</div>
        <div class="minigame-desc">Klikej/ťukej v zeleném pásmu rytmu! 10x zdvihni činku!</div>
      </div>
      <div class="minigame-area" style="gap:16px;position:relative;flex-direction:column">
        <canvas id="vzpirani-canvas" width="440" height="220" style="max-width:100%;border-radius:12px;border:2px solid var(--clr-border)"></canvas>
        <button class="btn btn-primary" id="vz-tap" style="font-size:20px;padding:16px 40px">💪 ZDVIHNI!</button>
        <div style="font-family:var(--font-pixel);font-size:10px;color:var(--clr-accent);text-align:center">
          Zdvihy: <span id="vz-score">0</span> / 10 &nbsp;|&nbsp; Chyby: <span id="vz-fail">0</span> / 3
        </div>
      </div>
    `;

    const canvas = document.getElementById('vzpirani-canvas');
    const ctx2 = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    let score = 0, fails = 0, running = true;
    let lastTime = null;
    // Oscillating marker
    let markerX = 0, markerDir = 1, markerSpeed = 280;
    const getGreenZone = () => {
      const shrinkFactor = Math.max(0.5, 1 - score * 0.1);
      const zoneWidth = W * 0.24 * shrinkFactor;
      const zoneCenter = W * 0.5;
      return { start: zoneCenter - zoneWidth / 2, end: zoneCenter + zoneWidth / 2 };
    };
    let GREEN_START = W*0.38, GREEN_END = W*0.62;
    const BAR_Y = H-50, BAR_H = 30;
    let barbellY = H*0.45, targetY = H*0.45;
    let lifting = false, liftTimer = 0;
    let flashColor = null, flashTimer = 0;
    let liftCount = 0; // animation frames tracking

    function tap() {
      if (!running) return;
      const zone = getGreenZone();
      const inGreen = markerX >= zone.start && markerX <= zone.end;
      if (inGreen) {
        AUDIO.SFX.success(); score++;
        document.getElementById('vz-score').textContent = score;
        flashColor = 'green'; flashTimer = 0.4;
        lifting = true; liftTimer = 0.5; targetY = H*0.2;
        markerSpeed = Math.min(450, 280 + score*35);
        if (score >= 10) { running = false; setTimeout(()=>showResult(true, `MISTR VZPÍRAČ! 💪\n10 zdvihů!\nTrenérka je nadšená!`),400); }
      } else {
        AUDIO.SFX.fail(); fails++;
        document.getElementById('vz-fail').textContent = fails;
        flashColor = 'red'; flashTimer = 0.35;
        if (fails >= 3) { running = false; setTimeout(()=>showResult(false, `3 chyby!\nZdvihů: ${score}/10.\nTrenérka vzdychá.`),400); }
      }
    }

    function draw(ts) {
      if (!running) return;
      if (!lastTime) { lastTime = ts; requestAnimationFrame(draw); return; }
      const dt = Math.min((ts-lastTime)/1000, 0.05); lastTime = ts;

      // Move marker
      markerX += markerDir * markerSpeed * dt;
      if (markerX > W-10) { markerX = W-10; markerDir = -1; }
      if (markerX < 10) { markerX = 10; markerDir = 1; }

      // Update green zone based on score
      const zone = getGreenZone();
      GREEN_START = zone.start;
      GREEN_END = zone.end;

      // Lift animation
      if (lifting) {
        liftTimer -= dt;
        barbellY += (targetY - barbellY) * 8 * dt;
        if (liftTimer <= 0) { lifting = false; targetY = H*0.45; }
      } else {
        barbellY += (targetY - barbellY) * 4 * dt;
      }

      if (flashTimer > 0) flashTimer -= dt;

      ctx2.clearRect(0,0,W,H);
      const bg = ctx2.createLinearGradient(0,0,0,H);
      bg.addColorStop(0,'#0a0a1a'); bg.addColorStop(1,'#1a0a00');
      ctx2.fillStyle=bg; ctx2.fillRect(0,0,W,H);

      // Gym background
      ctx2.fillStyle='rgba(255,255,255,0.03)';
      for(let i=0;i<W;i+=40) { ctx2.fillRect(i,0,1,H); }
      ctx2.font='14px serif';
      ['🪞','🪞','🏆'].forEach((e,i)=>ctx2.fillText(e, 20+i*180, 30));

      // Barbell
      const bx = W/2, by = barbellY;
      // Bar
      ctx2.fillStyle='#aaa'; ctx2.fillRect(bx-80,by-5,160,10);
      // Weights
      [[bx-80,30,50],[bx+80,30,50]].forEach(([x,w,h])=>{
        ctx2.fillStyle='#555';
        ctx2.beginPath(); ctx2.roundRect(x-w/2,by-h/2,w,h,4); ctx2.fill();
        ctx2.strokeStyle='#888'; ctx2.lineWidth=2; ctx2.stroke();
        ctx2.fillStyle='#777'; ctx2.font='bold 11px Nunito'; ctx2.textAlign='center';
        ctx2.fillText('20kg',x,by+4); ctx2.textAlign='left';
      });

      // Weightlifter figure
      ctx2.font='48px serif';
      const figY = lifting && liftTimer > 0.2 ? H*0.52 : H*0.58;
      ctx2.textAlign='center'; ctx2.fillText('🏋️', W/2, figY); ctx2.textAlign='left';

      // Timing bar background
      ctx2.fillStyle='#1a0800'; ctx2.fillRect(0,BAR_Y,W,BAR_H);
      ctx2.fillStyle='rgba(255,60,60,0.4)'; ctx2.fillRect(0,BAR_Y,W,BAR_H);
      // Green zone
      ctx2.fillStyle='rgba(74,222,128,0.5)';
      ctx2.beginPath(); ctx2.roundRect(GREEN_START,BAR_Y+4,GREEN_END-GREEN_START,BAR_H-8,6); ctx2.fill();
      ctx2.strokeStyle='var(--clr-green)'; ctx2.lineWidth=2; ctx2.stroke();
      ctx2.fillStyle='rgba(74,222,128,0.9)';
      ctx2.font='bold 11px Nunito'; ctx2.textAlign='center';
      ctx2.fillText('ZDVIHNI!', (GREEN_START+GREEN_END)/2, BAR_Y+BAR_H/2+4);
      ctx2.textAlign='left';

      // Moving marker
      ctx2.fillStyle = flashTimer > 0 && flashColor === 'green' ? '#4ade80' : flashTimer > 0 && flashColor === 'red' ? '#ff4d6d' : '#fff';
      ctx2.beginPath(); ctx2.arc(markerX, BAR_Y+BAR_H/2, 10, 0, Math.PI*2); ctx2.fill();
      ctx2.fillStyle='#000'; ctx2.font='bold 10px Nunito'; ctx2.textAlign='center';
      ctx2.fillText('▼', markerX, BAR_Y+BAR_H/2+4); ctx2.textAlign='left';

      requestAnimationFrame(draw);
    }

    document.getElementById('vz-tap').addEventListener('click', tap);
    document.addEventListener('keydown', vzHandler);
    function vzHandler(e) { if(e.key===' '||e.key==='Enter'||e.key==='ArrowUp') { e.preventDefault(); tap(); } }
    document.getElementById('vz-tap').addEventListener('touchstart', e=>{e.preventDefault();tap();},{passive:false});
    window._mgCleanup=()=>{running=false;document.removeEventListener('keydown',vzHandler);};
    requestAnimationFrame(draw);
  }

  // ===========================================================
  // DISPATCHER
  // ===========================================================
  function start(minigameId, container) {
    if (window._mgCleanup) { window._mgCleanup(); window._mgCleanup = null; }
    switch(minigameId) {
      case 'pexeso': startPexeso(container); break;
      case 'anagramy': startAnagramy(container); break;
      case 'sudoku': startSudoku(container); break;
      case 'vlastovka': startVlastovka(container); break;
      case 'svetylka': startSvetylka(container); break;
      case 'sibenice': startSibenice(container); break;
      case 'kviz': startKviz(container); break;
      case 'natocpivo': startNatocPivo(container); break;
      case 'hledejingredient': startHledejIngredient(container); break;
      case 'anglicaky': startAnglicaky(container); break;
      case 'rozdily': startRozdily(container); break;
      default:
        container.innerHTML=`<div class="minigame-header"><div class="minigame-title">⚠️ Minihra brzy!</div></div><div class="minigame-area" style="position:relative"><p style="color:var(--clr-text-dim)">Tato minihra se brzy přidá!</p><button class="btn btn-primary" onclick="MINIGAMES.confirmWin()">Pokračovat (debug)</button></div>`;
    }
  }

  return { setup, start, confirmWin, confirmFail, showResult };
})();

window.MINIGAMES = MINIGAMES;
