# CMPT 310 — Group 10 Presentation Script

**Format:** 12 min presentation + 5 min Q&A · 4 speakers (~3 min each)
**Visual aid:** live site at [fraser-finance.com](https://fraser-finance.com) — no slides needed, present directly off the website.

Speaker roles below follow the feature-table credits in `report.qmd` — swap names to match who's actually presenting.

---

## Speaker 1 — The Problem (0:00–2:30)

*On screen: landing page hero.*

> Banks approve or deny loans every day, and getting it wrong is expensive both ways. We built a system that predicts loan default risk from Home Credit's real historical data — 307,000+ applications — and turns that prediction into an approve/deny decision, live, on a website.

*Scroll to the "The Challenge" section.*

> Here's the trap we hit almost immediately: only 8% of applicants in our data actually default. That means a model can hit 92% accuracy just by approving everyone — and that's literally what our first Decision Tree did. Accuracy was the wrong thing to optimize for this problem.

---

## Speaker 2 — Data & Modeling (2:30–5:30)

> We merged three tables — application, bureau, and previous applications — and ran a Random Forest importance pass to narrow 122 engineered features down to 7. We deliberately excluded the three strongest predictors in the dataset, the EXT_SOURCE bureau scores, because a real applicant filling out our form can't self-report them. We traded some accuracy for a form that only asks what someone actually knows.
>
> We trained and grid-searched three models: KNN, Decision Tree, and a small neural network. Test ROC-AUC came out close for all three — 0.65 for KNN, 0.64 for the Decision Tree, 0.66 for the neural network — modest by design, since we dropped those bureau scores.

*(Optional: show the ROC curve figure from the report if presenting alongside slides.)*

---

## Speaker 3 — The Business Threshold (5:30–8:30)

> At the standard 50% classification threshold, all three models collapse to near-zero F1 — they basically predict "repaid" for everyone. Instead of reweighting the loss function, which would distort the probabilities, we fixed this at the decision layer: we derived a threshold straight from the bank's economics.
>
> If a repaid loan returns 10% profit and a default loses 100% of principal, expected profit is positive only when default probability is below 9.09%. Applying that threshold — same model, same data — takes expected profit from 688.8 to 1,514.5 loan units. That's 2.2× more profit with zero additional data.

*On screen: the "naive baseline vs. our threshold" comparison cards in the Challenge section.*

---

## Speaker 4 — Deployment & Live Demo (8:30–11:30)

> All three models are exported, but only the Decision Tree is live. That's deliberate: KNN is 67MB and takes 417 seconds to score our test set; the neural network needs TensorFlow, which is heavy to import on top of a free-tier server that's already cold-starting. The Decision Tree runs in 13 milliseconds and has no heavy dependencies, so it's the right model for a real-time first-pass check.

*Live demo: click "Predict Now," fill the form with a plausible applicant, submit, show the APPROVE/DENY result and probability.*

> This isn't a mockup — it's calling our actual FastAPI backend, running the actual trained pipeline, applying the actual 9.09% threshold.

**Note:** if the first request takes a while, that's Render's free tier waking the server from sleep (up to ~30s) — the site's loading state calls this out honestly. Model inference itself is 13ms; don't apologize, just narrate it: *"this pause is our free-tier server waking up, not the model — inference itself is 13 milliseconds."*

---

## Wrap (11:30–12:00)

> So — we didn't just train a model, we built one around what a bank actually cares about: profit, not accuracy. And we shipped it as something you can try right now, not a screenshot. Happy to take questions.

---

## Timing checkpoints

| Time | Milestone |
|---|---|
| 2:30 | Problem framing done, moving into modeling |
| 5:30 | Modeling done, moving into business threshold |
| 8:30 | Threshold done, moving into deployment/demo |
| 11:30 | Demo done, wrapping up |
| 12:00 | Hard stop — open floor for Q&A |
