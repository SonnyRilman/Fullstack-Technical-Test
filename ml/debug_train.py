import pandas as pd
import numpy as np

print("Step 1: load CSV")
df = pd.read_csv("data/sales_data.csv")
print(f"Loaded {len(df)} rows")

print("Step 2: setup features")
feature_cols = ["jumlah_penjualan", "harga", "diskon"]
df = df.dropna(subset=feature_cols + ["status"])
X = df[feature_cols].values.astype(float)
y = df["status"].values
print(f"X type: {type(X)}, X dtype: {X.dtype}")
print(f"y type: {type(y)}, y dtype: {y.dtype}")

print("Step 3: import sklearn")
from sklearn.model_selection import train_test_split
print("train_test_split imported OK")

print("Step 4: split data")
n = len(X)
idx = np.random.RandomState(42).permutation(n)
split = int(n * 0.8)
train_idx, test_idx = idx[:split], idx[split:]
X_train, X_test = X[train_idx], X[test_idx]
y_train, y_test = y[train_idx], y[test_idx]
print(f"Train: {len(X_train)}, Test: {len(X_test)}")

print("Step 5: train model")
from sklearn.ensemble import RandomForestClassifier
clf = RandomForestClassifier(n_estimators=50, random_state=42)
clf.fit(X_train, y_train)
print("Model trained OK")
print(f"Classes: {clf.classes_}")

print("Step 6: evaluate")
y_pred = clf.predict(X_test)
from sklearn.metrics import accuracy_score
acc = accuracy_score(y_test, y_pred)
print(f"Accuracy: {acc:.4f}")

print("Step 7: save model")
import joblib, os
os.makedirs("ml/model", exist_ok=True)
joblib.dump(clf, "ml/model/sales_model.joblib")
print("Model saved OK")

print("ALL DONE!")
