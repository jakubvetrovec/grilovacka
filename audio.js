// Audio disabled - all functions are no-ops
const AUDIO = {
  init() {},
  resume() {},
  SFX: {
    click() {},
    success() {},
    fail() {},
    item() {},
    sleepy() {},
    wake() {},
    typewriter() {},
    minigameWin() {},
    minigameFail() {},
    tick() {},
  },
  playMenuMusic() {},
  playMapMusic() {},
  playFinaleMusic() {},
  stopBGM() {},
  toggleMute() { return false; },
  muted: false,
};

window.AUDIO = AUDIO;
