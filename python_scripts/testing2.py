from sklearn.externals import joblib
import numpy as np

filename = 'taxi_face_model.sav'
loaded_model = joblib.load(filename)
inputsec = np.array([3600]).reshape(-1, 1)

result = loaded_model.predict(inputsec)
print("the predicted result is ", result[0])