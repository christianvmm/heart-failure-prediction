from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.callbacks import ModelCheckpoint
from tensorflow.keras.layers import Dense, Dropout, Input
from tensorflow.keras.models import load_model
from tensorflow.keras.models import Sequential
from tensorflow.keras.utils import plot_model
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
import tensorflow as tf

def plot_confusion_matrix(y_true, y_pred):
    cm = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(6, 5))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=['No Heart Disease', 'Heart Disease'], yticklabels=['No Heart Disease', 'Heart Disease'])
    plt.title('Confusion Matrix')
    plt.xlabel('Predicted')
    plt.ylabel('True')
    plt.show()

# Calcular la matriz de confusión
def calculate_metrics(y_true, y_pred):
    tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()

    precision = tp / (tp + fp) if (tp + fp) > 0 else 0  # Precisión (Positive Predictive Value)
    npv = tn / (tn + fn) if (tn + fn) > 0 else 0        # Valor Predictivo Negativo
    sensitivity = tp / (tp + fn) if (tp + fn) > 0 else 0 # Sensibilidad (Recall)
    specificity = tn / (tn + fp) if (tn + fp) > 0 else 0 # Especificidad
    accuracy = (tp + tn) / (tp + tn + fp + fn)          # Exactitud

    print(f"Precision: {precision:.2f}")
    print(f"Negative Predictive Value (NPV): {npv:.2f}")
    print(f"Sensitivity (Recall): {sensitivity:.2f}")
    print(f"Specificity: {specificity:.2f}")
    print(f"Accuracy: {accuracy:.2f}")


def get_data():
   # read data
   df=pd.read_csv("data.csv")

   # transform categorical to integers
   columns_to_encode = ['Sex', 'ChestPainType', 'RestingECG', 'ExerciseAngina', 'ST_Slope']
   label_encoder = LabelEncoder()

   mappings = {}

   for column in columns_to_encode:
      if column in df.columns:
         df[column] = label_encoder.fit_transform(df[column])
         mappings[column] = {label: idx for idx, label in enumerate(label_encoder.classes_)}


   # input, result
   X = df.drop('HeartDisease', axis=1)
   y = df['HeartDisease']

   # split data 
   X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

   return X_train, X_test, y_train, y_test

def train_model():
   X_train, X_test, y_train, y_test = get_data()

   # model definition
   model = Sequential()

   print(X_train.shape[1])
   model.add(Input(shape=(X_train.shape[1],))) 

   model.add(Dense(128, activation='relu'))
   model.add(Dropout(0.2))
   model.add(Dense(64, activation='relu'))
   model.add(Dropout(0.2))
   model.add(Dense(32, activation='relu'))
   model.add(Dropout(0.2))
   model.add(Dense(64, input_dim=X_train.shape[1], activation='relu'))
   model.add(Dropout(0.2))
   model.add(Dense(32, activation='relu'))
   model.add(Dropout(0.2))
   model.add(Dense(1, activation='sigmoid')) 
   model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])

   print("✅ Running...")
   history = model.fit(X_train, y_train, epochs=2000, batch_size=64, validation_split=0.1, verbose=0)

   print("✅ Saving...")
   model.save('model.keras')

   # Extraer los pesos de la primera capa
   weights, biases = model.layers[0].get_weights()
   feature_importance = np.sum(np.abs(weights), axis=1)
   feature_importance = feature_importance / np.sum(feature_importance)
   for i, importance in enumerate(feature_importance):
      print(f"Feature {i}: {importance:.4f}")

   plt.figure(figsize=(12, 5))
   plt.subplot(1, 2, 1)
   plt.plot(history.history['accuracy'], color='red', label='Train Accuracy')
   plt.plot(history.history['val_accuracy'], color='blue', label='Validation Accuracy')
   plt.title("Accuracy")
   plt.xlabel("Epochs")
   plt.ylabel("Accuracy")
   plt.legend()
   plt.tight_layout()
   plt.show()

   # Predict on test data
   y_pred = model.predict(X_test)
   y_pred = (y_pred > 0.5).astype(int)  # Convert probabilities to binary labels


   # Prediccion booleana
   y_pred = model.predict(X_test)
   y_pred = (y_pred > 0.5).astype(int)


   # Calcular y mostrar las métricas
   calculate_metrics(y_test, y_pred)

   # Mostrar la matriz de confusión
   plot_confusion_matrix(y_test, y_pred)

train_model()


