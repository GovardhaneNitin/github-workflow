function computeStatsBoost(state, contributionMeta) {
  // Basic mapping from contribution meta into stat changes
  const boosts = { hp: 0, luck: 0, speed: 0, insight: 0 };
  if (contributionMeta.testsAdded) boosts.insight += 1;
  if (contributionMeta.docsChanged) boosts.luck += 1;
  if (contributionMeta.refactor) boosts.speed += 1;
  if (contributionMeta.issueFixed) boosts.hp += 2;
  return boosts;
}

function rollEvent(state, rng) {
  const roll = rng.next();
  if (roll < 0.1) return { type: "treasure", loot: "💎", effect: { hp: +1 } };
  if (roll < 0.18)
    return {
      type: "enemy",
      enemy: "👾",
      damage: 1 + Math.floor(rng.next() * 3),
    };
  if (roll < 0.22) return { type: "weather", weather: "⛈️" };
  return { type: "none" };
}

function applyEvent(state, event) {
  if (event.type === "treasure") {
    state.hero.hp = Math.min(
      state.hero.maxHp,
      state.hero.hp + (event.effect.hp || 0)
    );
  } else if (event.type === "enemy") {
    state.hero.hp = Math.max(0, state.hero.hp - event.damage);
  }
}

module.exports = { computeStatsBoost, rollEvent, applyEvent };
