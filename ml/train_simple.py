import traceback
import pandas as pd, numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import roc_auc_score, accuracy_score, classification_report, confusion_matrix
import json, os, joblib

DATA_PATH = "data/sales_data.csv"
MODEL_DIR = "ml/model"
MODEL_PATH = os.path.join(MODEL_DIR, "sales_model.joblib")
EVAL_PATH = os.path.join(MODEL_DIR, "evaluation.json")

os.makedirs(MODEL_DIR, exist_ok=True)

print("Loading data...")
df = pd.read_csv(DATA_PATH)
print(f"Rows: {len(df)}")
print(df['status'].value_counts())

feature_cols = ["jumlah_penjualan", "harga", "diskon"]
df = df.dropna(subset=feature_cols + ["status"])
X = df[feature_cols].values.astype(float)
y = df["status"].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Training Random Forest...")
clf = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
y_proba = clf.predict_proba(X_test)

classes = list(clf.classes_)
print("Classes:", classes)
laris_idx = classes.index("Laris") if "Laris" in classes else 1
y_proba_laris = y_proba[:, laris_idx]
y_binary = (y_test == "Laris").astype(int)

acc = accuracy_score(y_test, y_pred)
auc = roc_auc_score(y_binary, y_proba_laris)

print(f"\nAccuracy: {acc:.4f}")
print(f"AUC-ROC:  {auc:.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))
print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# Cross-validation
cv_scores = cross_val_score(clf, X_train, y_train, cv=5, scoring="accuracy")
print(f"\nCV Accuracy: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

# Save model
joblib.dump(clf, MODEL_PATH)
print(f"\nModel saved to: {MODEL_PATH}")

# Save evaluation
report = classification_report(y_test, y_pred, output_dict=True)
evaluation = {
    "best_model": "Random Forest",
    "features": feature_cols,
    "best_model_metrics": {
        "cv_mean": round(float(cv_scores.mean()), 4),
        "cv_std": round(float(cv_scores.std()), 4),
        "test_accuracy": round(float(acc), 4),
        "auc_roc": round(float(auc), 4),
        "classification_report": report,
        "confusion_matrix": confusion_matrix(y_test, y_pred).tolist(),
    }
}
with open(EVAL_PATH, "w") as f:
    json.dump(evaluation, f, indent=2)
print(f"Evaluation saved to: {EVAL_PATH}")
print("\nDone!")
