const fs = require('fs');
const path = require('path');
const { makeSeed, RNG } = require('./rng');
const { advanceWorld } = require('./worldGen');
const { computeStatsBoost, rollEvent, applyEvent } = require('./events');
const { writeWorld } = require('./render');

function loadState() {
  return JSON.parse(fs.readFileSync(path.join(__dirname,'..','world','state.json'),'utf8'));
}

function saveState(state) {
  fs.writeFileSync(path.join(__dirname,'..','world','state.json'), JSON.stringify(state, null, 2));
}

function extractContributionMeta() {
  // Heuristic via env vars passed by GitHub Action (fallback to none locally)
  return {
    testsAdded: process.env.CHANGED_PATHS?.includes('__tests__/') || false,
    docsChanged: process.env.CHANGED_PATHS?.match(/README|docs\//) ? true : false,
    refactor: process.env.PR_TITLE?.toLowerCase().includes('refactor') || false,
    issueFixed: process.env.PR_BODY?.includes('Fixes #') || false
  };
}

function applyBoosts(state, boosts) {
  state.hero.hp = Math.min(state.hero.maxHp, state.hero.hp + (boosts.hp||0));
  state.hero.luck += boosts.luck||0;
  state.hero.speed += boosts.speed||0;
  state.hero.insight += boosts.insight||0;
}

function tick() {
  const state = loadState();
  state.tick += 1;
  const seed = makeSeed((process.env.GITHUB_SHA||'local') + state.tick + new Date().getDay());
  const rng = RNG(seed);

  const contrib = extractContributionMeta();
  const boosts = computeStatsBoost(state, contrib);
  applyBoosts(state, boosts);

  const tile = advanceWorld(state, rng);
  const event = rollEvent(state, rng);
  applyEvent(state, event);
  state.log.push({ tick: state.tick, tile, event, boosts });

  writeWorld(state, path.join(__dirname,'..','WORLD.md'));
  saveState(state);
  console.log(JSON.stringify({ summary: { tick: state.tick, tile, event, boosts } }, null, 2));
}

if (require.main === module) tick();

module.exports = { tick };
