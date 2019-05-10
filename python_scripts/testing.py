import sys
#print("ok!")
#sys.stdout.flush()
from sklearn.externals import joblib
#import pickle

a1 = int(sys.argv[1])
a2 = int(sys.argv[2])
val = a1+a2
print(val)
#val = a1+a2
#print(val)
#sys.stdout.flush()

#joblib.dump(X_test, 'X_testing.sav')
#joblib.dump(Y_test, 'Y_testing.sav')

# load the model from disk
#loaded_model = pickle.load(open('mode_testing.sav', 'rb'))
loaded_model = joblib.load('mode_testing.sav')
#X_test = pickle.load(open('X_testing.sav', 'rb'))
X_test = joblib.load('X_testing.sav')
#Y_test = pickle.load(open('Y_testing.sav', 'rb'))
Y_test = joblib.load('Y_testing.sav')
result = loaded_model.score(X_test, Y_test)
#print("testing")
print(result)
#print(val)
sys.stdout.flush()