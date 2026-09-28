/* HydroMath engine - honest home hydroponics math. Pure functions, no DOM. */
var HydroEngine = (function () {
  function r1(x) { return Math.round(x * 10) / 10; }

  /* reservoir: gallons per plant by crop, plus a 25% working buffer */
  var GAL_PER_PLANT = { lettuce: 0.5, herbs: 1, greens: 0.75, tomato: 3, pepper: 2.5, cucumber: 3 };
  function reservoirGallons(plants, galPerPlant) {
    return r1(plants * galPerPlant * 1.25);
  }
  function galPerPlant(crop) { return GAL_PER_PLANT[crop] || 1; }

  /* nutrient dosing from the bottle's ml-per-gallon rate */
  function dosingMl(reservoirGal, mlPerGal) { return Math.round(reservoirGal * mlPerGal); }

  /* PPM (500-scale) targets by crop and stage */
  var PPM_TARGETS = {
    lettuce:  { seedling: [400, 560], growing: [560, 850], full: [560, 850] },
    greens:   { seedling: [400, 560], growing: [560, 980], full: [560, 980] },
    herbs:    { seedling: [560, 840], growing: [840, 1260], full: [840, 1260] },
    tomato:   { seedling: [840, 1260], growing: [1400, 2000], full: [1400, 2500] },
    pepper:   { seedling: [840, 1260], growing: [1260, 1750], full: [1260, 2100] },
    cucumber: { seedling: [700, 1190], growing: [1190, 1750], full: [1190, 1750] }
  };
  function ppmRange(crop, stage) {
    var c = PPM_TARGETS[crop];
    if (!c) return null;
    return c[stage] || null;
  }
  function ppmVerdict(measured, crop, stage) {
    var range = ppmRange(crop, stage);
    if (!range) return null;
    if (measured < range[0] * 0.8) return 'low - ' + measured + ' ppm against a ' + range[0] + '-' + range[1] + ' target; plants are hungry, dose up';
    if (measured < range[0]) return 'a little light - ' + measured + ' ppm against a ' + range[0] + '-' + range[1] + ' target; fine for now, watch growth';
    if (measured <= range[1]) return 'in range - ' + measured + ' ppm sits inside the ' + range[0] + '-' + range[1] + ' target';
    if (measured <= range[1] * 1.2) return 'a little hot - ' + measured + ' ppm over the ' + range[0] + '-' + range[1] + ' target; top off with plain water';
    return 'hot - ' + measured + ' ppm well over the ' + range[0] + '-' + range[1] + ' target; dilute before tips burn';
  }

  /* pH: the 5.5-6.5 window where nutrients stay available */
  function phVerdict(ph) {
    if (ph < 5.5) return 'low - under 5.5, calcium and magnesium start locking out';
    if (ph <= 6.5) return 'in range - 5.5 to 6.5 keeps the nutrients available';
    return 'high - over 6.5, iron and manganese start locking out';
  }

  /* top-off rule: plain pH-adjusted water between full reservoir changes */
  function topoffAdvice(gallonsMissing) {
    if (gallonsMissing <= 0) return 'Reservoir is full - nothing to add.';
    return 'Top off with ' + r1(gallonsMissing) + ' gal of plain pH-adjusted water (no nutrients) - plants drink water faster than they eat. Full reservoir change every 1-2 weeks.';
  }

  /* light: DLI = PPFD x hours x 0.0036 (mol/m2/day) */
  var DLI_TARGETS = { lettuce: [12, 14], greens: [12, 14], herbs: [14, 17], tomato: [20, 30], pepper: [18, 25], cucumber: [20, 30] };
  function dliFrom(ppfd, hours) { return r1(ppfd * hours * 0.0036); }
  function hoursNeeded(ppfd, targetDli) {
    if (ppfd <= 0) return null;
    return r1(targetDli / (ppfd * 0.0036));
  }
  function dliVerdict(crop, ppfd, hours) {
    var t = DLI_TARGETS[crop];
    if (!t) return null;
    var dli = ppfd * hours * 0.0036;
    if (dli < t[0]) return 'short - ' + r1(dli) + ' DLI against a ' + t[0] + '-' + t[1] + ' target; add hours or move the light closer';
    if (dli <= t[1]) return 'in range - ' + r1(dli) + ' DLI sits inside the ' + t[0] + '-' + t[1] + ' target';
    return 'over - ' + r1(dli) + ' DLI past the ' + t[0] + '-' + t[1] + ' target; leafy crops may bolt, raise the light or cut hours';
  }

  return {
    GAL_PER_PLANT: GAL_PER_PLANT, PPM_TARGETS: PPM_TARGETS, DLI_TARGETS: DLI_TARGETS,
    reservoirGallons: reservoirGallons, galPerPlant: galPerPlant, dosingMl: dosingMl,
    ppmRange: ppmRange, ppmVerdict: ppmVerdict, phVerdict: phVerdict,
    topoffAdvice: topoffAdvice, dliFrom: dliFrom, hoursNeeded: hoursNeeded, dliVerdict: dliVerdict
  };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = HydroEngine;
