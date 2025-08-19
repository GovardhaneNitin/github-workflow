const biomes = ["plains", "forest", "lake", "ruins", "cavern"];

function nextBiome(prevBiome, rng) {
  if (rng.next() < 0.15) return rng.pick(biomes);
  return prevBiome;
}

function makeTile(biome, rng) {
  const symbols = {
    plains: [".", ".", ".", "⛰️"],
    forest: ["🌲", "🌲", "🌳", "🍄"],
    lake: ["~", "~", "~", "💧"],
    ruins: ["🧱", "🗿", "⚙️", "📜"],
    cavern: ["🪨", "🪨", "🦇", "💎"],
  };
  return rng.pick(symbols[biome]);
}

function advanceWorld(state, rng) {
  const prevBiome = state.map.biome || "plains";
  const biome = nextBiome(prevBiome, rng);
  const tile = makeTile(biome, rng);
  state.map.biome = biome;
  state.map.steps.push(tile);
  if (state.map.steps.length > 30) {
    const archived = state.map.steps.shift();
    state.log.push({ type: "archive", tile: archived, tick: state.tick });
  }
  return tile;
}

module.exports = { advanceWorld };
