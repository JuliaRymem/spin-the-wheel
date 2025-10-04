export function pickRandomIndex(n) {
    return Math.floor(Math.random() * n);
  }
  
  export function pickWeightedIndex(weights) {
    const total = weights.reduce((a, b) => a + (Number(b) || 0), 0);
    if (total <= 0) return pickRandomIndex(weights.length);
    let r = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
      r -= Number(weights[i]) || 0;
      if (r <= 0) return i;
    }
    return weights.length - 1;
  }