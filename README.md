# Ramana™ — Rent a Living Cash Machine 💸

A (totally legit, definitely real) landing page where you can *rent* Ramana to build
your billion-dollar empire. Spoiler: it's a prank. Clicking any **Rent** button runs a
fake "wiring your billions" loading sequence and then reveals the gotcha. 🤡

## 🚀 Hosting on GitHub Pages

1. Create a repo on GitHub (e.g. `Ramana-for-sale`) and push this folder:
   ```bash
   git remote add origin https://github.com/<your-username>/Ramana-for-sale.git
   git branch -M main
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main** / **/ (root)** → **Save**
3. Wait ~1 minute. Your prank goes live at:
   ```
   https://<your-username>.github.io/Ramana-for-sale/
   ```
4. Send the link to your friend. Enjoy. 😈

## Files
- `index.html` — the page
- `style.css` — the styling
- `script.js` — money rain, animated stats, and the prank payoff
- `.nojekyll` — tells GitHub Pages to serve files as-is

## Customize
- Change the name "Ramana" throughout `index.html` for a different victim.
- Edit prices, testimonials, and FAQ in `index.html`.
- Tweak the reveal text in `script.js` (`rentNow()` function).

> Disclaimer: No humans are actually for sale. This is a joke. Be nice. 💜
