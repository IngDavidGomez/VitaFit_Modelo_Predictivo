
import pandas as pd

# Leer la base de datos de VitaFit Guanacaste
datos = pd.read_csv("VitaFit_Datos_Modelo.csv", sep=None, engine="python", encoding="utf-8-sig")

# Mostrar la cantidad de registros y columnas
print("Cantidad de clientes:", datos.shape[0])
print("Cantidad de columnas:", datos.shape[1])

# Mostrar los primeros cinco clientes
print("\nPrimeros cinco registros:")
print(datos.head())

# Mostrar los nombres de las columnas
print("\nColumnas disponibles:")
print(datos.columns.tolist())

# Verificar la variable objetivo
print("\nDistribución de cancelaciones:")
print(datos["Cancelacion"].value_counts())

# Calcular el porcentaje de cancelación
porcentaje = datos["Cancelacion"].mean() * 100

print(f"\nPorcentaje de cancelación: {porcentaje:.2f}%")

# Separar las variables predictoras y la variable objetivo

X = datos.drop(columns=["ID_Cliente", "Cancelacion"])
y = datos["Cancelacion"]

# Verificar las dimensiones
print("\nVariables predictoras (X):", X.shape)
print("Variable objetivo (y):", y.shape)

# Mostrar los nombres de las variables predictoras
print("\nVariables que utilizaremos para predecir:")
print(X.columns.tolist())

# PASO 31: Dividir los datos en entrenamiento y prueba

from sklearn.model_selection import train_test_split

X_entrenamiento, X_prueba, y_entrenamiento, y_prueba = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\n--- DIVISION DE LOS DATOS ---")
print("Clientes de entrenamiento:", len(X_entrenamiento))
print("Clientes de prueba:", len(X_prueba))

print("\nCancelaciones en entrenamiento:")
print(y_entrenamiento.value_counts())

print("\nCancelaciones en prueba:")
print(y_prueba.value_counts())

# PASO 32: Preparar las variables para el modelo

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler

# Identificar las variables categóricas
variables_categoricas = [
    "Sucursal",
    "Genero",
    "Tipo_Membresia",
    "Clases_Grupales",
    "Entrenador_Personal",
    "Promocion_Referido"
]

# Identificar las variables numéricas
variables_numericas = [
    "Edad",
    "Antiguedad_Meses",
    "Visitas_Mes",
    "Dias_Ultima_Visita",
    "Quejas_6M",
    "Monto_Mensual",
    "Renovaciones"
]

# Configurar las transformaciones
preprocesador = ColumnTransformer(
    transformers=[
        (
            "categoricas",
            OneHotEncoder(handle_unknown="ignore"),
            variables_categoricas
        ),
        (
            "numericas",
            StandardScaler(),
            variables_numericas
        )
    ]
)

print("\n--- PREPARACION DE VARIABLES ---")
print("Variables categoricas:", len(variables_categoricas))
print("Variables numericas:", len(variables_numericas))
print("Preprocesador configurado correctamente.")

# PASO 33: Entrenar el modelo de regresion logistica

from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline


# Crear el modelo predictivo balanceado
modelo = Pipeline(steps=[
    ("preprocesamiento", preprocesador),
    ("regresion_logistica", LogisticRegression(
        max_iter=1000,
        random_state=42,
        class_weight="balanced"
    ))
])


# Entrenar el modelo con los 8000 clientes
modelo.fit(X_entrenamiento, y_entrenamiento)

print("\n--- ENTRENAMIENTO DEL MODELO ---")
print("Modelo de regresion logistica entrenado correctamente.")
print("Clientes utilizados:", len(X_entrenamiento))

# PASO 34: Evaluar el modelo de regresion logistica

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)

# Realizar predicciones con los clientes de prueba
predicciones = modelo.predict(X_prueba)

# Calcular las metricas de evaluacion
exactitud = accuracy_score(y_prueba, predicciones)
precision = precision_score(y_prueba, predicciones, zero_division=0)
sensibilidad = recall_score(y_prueba, predicciones, zero_division=0)
f1 = f1_score(y_prueba, predicciones, zero_division=0)

# Mostrar resultados
print("\n--- EVALUACION DEL MODELO ---")
print(f"Exactitud (Accuracy): {exactitud:.2%}")
print(f"Precision: {precision:.2%}")
print(f"Sensibilidad (Recall): {sensibilidad:.2%}")
print(f"Puntuacion F1: {f1:.2%}")

# Mostrar la matriz de confusion
print("\nMatriz de confusion:")
print(confusion_matrix(y_prueba, predicciones))

# PASO 38: Calcular el AUC-ROC

from sklearn.metrics import roc_auc_score

# Obtener la probabilidad de cancelacion
probabilidades = modelo.predict_proba(X_prueba)[:, 1]

# Calcular el AUC-ROC
auc_roc = roc_auc_score(y_prueba, probabilidades)

print("\n--- EVALUACION AUC-ROC ---")
print(f"AUC-ROC: {auc_roc:.4f}")

# PASO 40: Analizar los coeficientes de la regresion logistica

# Obtener los nombres de las variables transformadas
nombres_variables = modelo.named_steps[
    "preprocesamiento"
].get_feature_names_out()

# Obtener los coeficientes del modelo
coeficientes = modelo.named_steps[
    "regresion_logistica"
].coef_[0]

# Crear una tabla con los coeficientes
importancia_variables = pd.DataFrame({
    "Variable": nombres_variables,
    "Coeficiente": coeficientes
})

# Ordenar por la magnitud de los coeficientes
importancia_variables["Magnitud"] = (
    importancia_variables["Coeficiente"].abs()
)

importancia_variables = importancia_variables.sort_values(
    by="Magnitud",
    ascending=False
)

print("\n--- VARIABLES CON MAYORES COEFICIENTES ---")
print(importancia_variables.head(15).to_string(index=False))

# PASO 44: Crear la grafica de la matriz de confusion

import matplotlib.pyplot as plt
from sklearn.metrics import ConfusionMatrixDisplay

# Crear la matriz de confusion
figura, eje = plt.subplots(figsize=(8, 6))

ConfusionMatrixDisplay.from_predictions(
    y_prueba,
    predicciones,
    display_labels=["Permanece", "Cancela"],
    cmap="Blues",
    values_format="d",
    ax=eje
)

# Personalizar la grafica
eje.set_title(
    "Matriz de confusion - VitaFit Guanacaste",
    fontsize=14
)
eje.set_xlabel("Prediccion del modelo")
eje.set_ylabel("Situacion real")

plt.tight_layout()

# Guardar la grafica como imagen
plt.savefig(
    "matriz_confusion_vitafit.png",
    dpi=300,
    bbox_inches="tight"
)

# Mostrar la grafica
plt.show()

print("\nGrafica de matriz de confusion generada correctamente.")

# PASO 45: Crear la curva ROC

from sklearn.metrics import RocCurveDisplay

# Crear la figura
figura_roc, eje_roc = plt.subplots(figsize=(8, 6))

# Dibujar la curva ROC del modelo
RocCurveDisplay.from_predictions(
    y_prueba,
    probabilidades,
    name="Regresion logistica balanceada",
    ax=eje_roc
)

# Agregar linea de referencia
eje_roc.plot(
    [0, 1],
    [0, 1],
    linestyle="--",
    color="gray",
    label="Clasificacion al azar"
)

# Personalizar la grafica
eje_roc.set_title("Curva ROC - VitaFit Guanacaste")
eje_roc.set_xlabel("Tasa de falsos positivos")
eje_roc.set_ylabel("Tasa de verdaderos positivos")
eje_roc.legend(loc="lower right")

plt.tight_layout()

# Guardar la imagen
plt.savefig(
    "curva_roc_vitafit.png",
    dpi=300,
    bbox_inches="tight"
)

# Mostrar la grafica
plt.show()

print("\nCurva ROC generada correctamente.")

# PASO 47: Exportar los resultados del modelo para Power BI

# Recuperar los datos originales de los clientes de prueba
resultados_prueba = datos.loc[X_prueba.index].copy()

# Agregar la puntuación estimada por el modelo
resultados_prueba["Puntaje_Riesgo"] = probabilidades.round(4)

# Agregar la clasificación del modelo
resultados_prueba["Prediccion_Modelo"] = predicciones

# Guardar los resultados en un archivo CSV
resultados_prueba.to_csv(
    "VitaFit_Resultados_Prueba.csv",
    index=False,
    encoding="utf-8-sig"
)

# Mostrar una vista previa
print("\nARCHIVO GENERADO PARA POWER BI")
print("Total de clientes:", len(resultados_prueba))

print(
    resultados_prueba[
        ["ID_Cliente", "Cancelacion", "Puntaje_Riesgo", "Prediccion_Modelo"]
    ].head(10)
)

print("\nArchivo guardado: VitaFit_Resultados_Prueba.csv")

# PASO 49: Crear archivo completo para Power BI

# Copiar los 10.000 registros originales
datos_powerbi = datos.copy()

# Calcular puntuaciones para todos los clientes
datos_powerbi["Puntaje_Riesgo"] = modelo.predict_proba(
    datos[X.columns]
)[:, 1].round(4)

# Agregar la clasificación del modelo
datos_powerbi["Prediccion_Modelo"] = modelo.predict(
    datos[X.columns]
)

# Identificar si el cliente pertenece al conjunto de prueba
datos_powerbi["Conjunto"] = "Entrenamiento"
datos_powerbi.loc[X_prueba.index, "Conjunto"] = "Prueba"

# Guardar archivo para Power BI
datos_powerbi.to_csv(
    "VitaFit_Dashboard_PowerBI.csv",
    index=False,
    encoding="utf-8-sig"
)

print("\nARCHIVO COMPLETO PARA POWER BI")
print("Total de clientes:", len(datos_powerbi))
print("Archivo guardado: VitaFit_Dashboard_PowerBI.csv")
