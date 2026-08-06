# Sample Q&A — CMPT 310 Group 10

Anticipated questions for the 5-minute Q&A, grounded in the actual limitations documented in `report.qmd`.

---

**Q: Why is your ROC-AUC only ~0.65? That seems low.**

A: The strongest predictors in this dataset (`EXT_SOURCE_1/2/3`, external bureau scores) push AUC to ~0.79, but they're not something an applicant can self-report on a form — so we deliberately excluded them. 0.65 reflects a model that only uses fields a real user could actually enter.

---

**Q: Why not use `class_weight='balanced'` to fix the 8% imbalance directly?**

A: That reweights the loss and skews predicted probabilities — which breaks the expected-profit calculation, since it depends on the model's probability meaning something real. We fixed the imbalance at the decision-threshold layer instead, which is the correct layer for a business-driven cutoff.

---

**Q: Why 9.09% specifically — where does that number come from?**

A: From the bank's own economics: E(Profit) = p·(−1.0) + (1−p)·(0.10). Solving for E(Profit) > 0 gives p < 9.09%. It's not tuned or cross-validated — it falls straight out of the profit/loss assumptions.

---

**Q: Why deploy the Decision Tree instead of the Neural Network, which had the best AUC?**

A: Hosting constraints, not accuracy. The NN needs TensorFlow imported at runtime, and our backend runs on Render's free tier, which already cold-starts after idle time — stacking a multi-second TF import on that makes the wait feel broken. The Decision Tree is small, dependency-light, and 13ms per prediction, so it works as a fast first-pass check. The NN is reserved for a future tier doing deeper review.

---

**Q: Why did the demo take a while just now?**

A: That's the Render free-tier server waking up from sleep after inactivity — can take up to ~30 seconds. Actual model inference once it's warm is 13 milliseconds; the wait isn't the model, it's free hosting.

---

**Q: Is this production-ready?**

A: No — it's an MVP demonstrating the full pipeline end-to-end. It's missing things like live bureau data feeds, monitoring, fairness auditing across protected classes, and a paid hosting tier. The point was proving the training → export → real inference path works outside the notebook.

---

**Q: Doesn't using age and education as features raise fairness concerns?**

A: Fair question — we didn't do a formal fairness audit, which is a real limitation. Education and age are legitimate predictors in the training data, but a production system would need bias testing across protected groups before this threshold logic went anywhere near a real lending decision.

---

**Q: How confident are you in the 10%-profit / 100%-loss assumptions?**

A: They're working assumptions, not sourced figures — we say so directly in the writeup. We treat them as tunable parameters; the point of the exercise is the *method* — deriving a threshold from real economics instead of guessing 50% — which holds regardless of the exact numbers a real bank would plug in.

---

**Q: Why is KNN so slow (417s for 61,503 rows)? What does that mean for scalability?**

A: KNN has to compare each new applicant against the entire training set at inference time — there's no compact learned model, just stored data. That's fine for a one-off notebook comparison but disqualifying for a live API, which is exactly why it's not the deployed model.

---

**Q: Did you check for data leakage when merging the bureau and previous-application tables?**

A: We aggregated both to one row per applicant (counts, sums, means) before merging on `SK_ID_CURR`, and split train/test before any aggregation touched the target. Nothing derived from the outcome we're predicting leaks into the features.
