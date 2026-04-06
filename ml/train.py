import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, roc_auc_score

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "..", "data", "sales_data.csv")
MODEL_DIR = os.path.join(BASE_DIR, "model")
MODEL_PATH = os.path.join(MODEL_DIR, "sales_model.joblib")
EVAL_PATH = os.path.join(MODEL_DIR, "evaluation.json")

os.makedirs(MODEL_DIR, exist_ok=True)

def load_data(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    return df

def preprocess(df: pd.DataFrame):
    cols = ["jumlah_penjualan", "harga", "diskon"]
    target = "status"
    df = df.dropna(subset=cols + [target])
    X = df[cols].values.astype(float)
    y = df[target].values
    return X, y, cols

def manual_split(X, y, test_size=0.2, random_state=42):
    rng = np.random.RandomState(random_state)
    idx = rng.permutation(len(X))
    split = int(len(X) * (1 - test_size))
    return X[idx[:split]], X[idx[split:]], y[idx[:split]], y[idx[split:]]

def cross_val(clf, X, y, k=5, random_state=42):
    rng = np.random.RandomState(random_state)
    idx = rng.permutation(len(X))
    folds = np.array_split(idx, k)
    scores = []
    for i in range(k):
        val_idx = folds[i]
        train_idx = np.concatenate([folds[j] for j in range(k) if j != i])
        copy = type(clf)(**clf.get_params())
        copy.fit(X[train_idx], y[train_idx])
        scores.append(accuracy_score(y[val_idx], copy.predict(X[val_idx])))
    return np.array(scores)

def train_and_evaluate(X, y):
    X_train, X_test, y_train, y_test = manual_split(X, y)
    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s = scaler.transform(X_test)

    cands = {
        "Random Forest": (RandomForestClassifier(n_estimators=100, random_state=42), X_train, X_test),
        "Logistic Regression": (LogisticRegression(max_iter=1000, random_state=42), X_train_s, X_test_s),
        "Decision Tree": (DecisionTreeClassifier(max_depth=8, random_state=42), X_train, X_test),
    }

    results = {}
    best_clf, best_name, best_acc = None, None, 0

    for name, (clf, Xtr, Xte) in cands.items():
        clf.fit(Xtr, y_train)
        y_pred = clf.predict(Xte)
        acc = accuracy_score(y_test, y_pred)
        
        y_binary = np.where(y_test == "Laris", 1, 0)
        y_proba = clf.predict_proba(Xte)[:, list(clf.classes_).index("Laris")]
        auc = roc_auc_score(y_binary, y_proba)

        results[name] = {
            "test_accuracy": round(float(acc), 4),
            "auc_roc": round(float(auc), 4),
            "report": classification_report(y_test, y_pred, output_dict=True)
        }

        if acc > best_acc:
            best_acc, best_name, best_clf = acc, name, clf

    return best_clf, best_name, results

def save(clf, name, results, cols):
    joblib.dump(clf, MODEL_PATH)
    with open(EVAL_PATH, "w") as f:
        json.dump({"best": name, "features": cols, "results": results}, f, indent=2)

if __name__ == "__main__":
    df = load_data(DATA_PATH)
    X, y, cols = preprocess(df)
    clf, name, res = train_and_evaluate(X, y)
    save(clf, name, res, cols)
    print(f"Training selesai. Model terbaik: {name}")
