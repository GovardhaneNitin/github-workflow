const fs = require("fs");

function render(state) {
  const heroPos = state.map.steps.length - 1;
  const line = state.map.steps
    .map((t, i) => (i === heroPos ? "🏹" : t))
    .join("");
  return `# World\n\nTick: ${state.tick}\nHP: ${state.hero.hp}/${state.hero.maxHp}  Luck:${state.hero.luck}  Spd:${state.hero.speed}  Insight:${state.hero.insight}\nBiome:${state.map.biome}\n\n${line}\n`;
}

function writeWorld(state, path) {
  fs.writeFileSync(path, render(state));
}

module.exports = { render, writeWorld };
