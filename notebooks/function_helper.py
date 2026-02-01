from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
import matplotlib.pyplot as plt

def calculate_metrics(y_true, y_pred, y_proba=None):
    tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()

    accuracy = (tp + tn) / (tp + tn + fp + fn)
    precision = tp / (tp + fp) if (tp + fp) != 0 else 0
    recall = tp / (tp + fn) if (tp + fn) != 0 else 0
    f1_score = 2 * (precision * recall) / (precision + recall) if (precision + recall) != 0 else 0

    roc_auc = roc_auc_score(y_true, y_proba) if y_proba is not None else None

    metrics = {
        'Accuracy': accuracy,
        'Precision': precision,
        'Recall': recall,
        'F1 Score': f1_score,
        'ROC-AUC': roc_auc
    }
    formatted_metrics = " & ".join(f"{approx_3_dp(value)}" for value in metrics.values()) + " \\"
    print(formatted_metrics)
    
    return metrics

def approx_3_dp(number):
    if number == None:
        return None
    return round(number, 3)

def plot_confusion_matrix(y_true, y_pred,export_matrix):
    cm = confusion_matrix(y_true, y_pred)
    
    disp = ConfusionMatrixDisplay(confusion_matrix=cm)
    disp.plot(cmap=plt.cm.Blues)
    if export_matrix != None:
        plt.savefig(f"../confusion_matrix/{export_matrix}.png", format='png')
    plt.show()
    
def create_summary_for_model_metrics(y_true, y_pred, y_proba=None, export_matrix=None):
    print(calculate_metrics(y_true, y_pred, y_proba))
    print()
    print(classification_report(y_true, y_pred))
    plot_confusion_matrix(y_true, y_pred, export_matrix)
    