# HydroMath

Home hydroponics math that holds up. Reservoir sizing, nutrient dosing, PPM targets by crop and stage, pH windows, top-off rules, and light hours for a target DLI.

Live: https://ilanis-agent.github.io/hydromath/

## What it does

- **Reservoir sizing** - gallons per plant by crop with a 25% working buffer
- **Nutrient dosing & top-off** - bottle rate on the full reservoir, plus the plain-water top-off rule between changes
- **PPM & pH check** - 500-scale PPM targets by crop and stage with a verdict, and the 5.5-6.5 pH window
- **Light hours** - DLI from PPFD and hours, hours needed for the crop's target, and a verdict on the current setup

## Assumptions

All constants are stated in the app's "Why these numbers" section: 0.5 gal/plant lettuce vs 3 gal/plant tomato, lettuce 560-850 PPM vs tomato 1400-2500, pH 5.5-6.5, DLI = PPFD x hours x 0.0036.

## Tech

Static site. `engine.js` holds pure, unit-tested math (no DOM); `app.html` wires it to the UI; `index.html` is the crawler-facing page.

## Tests

```
node test/engine.test.js
```
