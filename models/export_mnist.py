# models/export_mnist.py
import tensorflow as tf
from tensorflow import keras
import numpy as np
import os

# 1) 모델 정의
model = keras.Sequential([
    keras.Input(shape=(28, 28), name="inputs"),
    keras.layers.Flatten(name="flatten"),
    keras.layers.Dense(10, activation="softmax", name="dense"),
])
model.compile(optimizer="adam", loss="sparse_categorical_crossentropy")

# 2) 더미 데이터로 1 epoch 훈련
x = np.random.rand(100, 28, 28).astype("float32")
y = np.random.randint(0, 10, 100).astype("int32")
model.fit(x, y, epochs=1)

# 3) 저장 경로 준비
export_path = os.path.join("models", "mnist", "1")
if os.path.exists(export_path):
    # 기존 디렉터리 완전 삭제
    import shutil
    shutil.rmtree(export_path)
os.makedirs(export_path, exist_ok=True)

# 4) Keras 기본 SavedModel로 내보내기
model.export(export_path)

print(f"Model exported to {export_path} using Keras save()")
