import sys
import pandas as pd
import numpy as np
import pickle
from pickle import load


def preprocessing(data) :
    # Binary Encoding 
    be = pickle.loads(open("binaryEncoder.pkl", "rb"))
    binary_df = be.transform(data[['shop_type_big', 'shop_type_small']])
    data.drop(['shop_type_big', 'shop_type_small'], axis=1)
    data = pd.concat([data, binary_df], axis=1)
    
    # Log Transform 
    data['average_sale_price'] = data['average_sale_price'].apply(lambda x : np.log(x))
    
    # K-Means Clustering 
    kmeans = pickle.load(open("kmeans.pkl", "rb"))
    data['geo'] = kmeans.predict(data[['latitude', 'longitude']])
    data.drop(['latitude', 'longitude'], axis=1)
    
    return data
    
    
def prediction(data) : 
    # Load model 
    model_ml = load(open('model_ml.pkl', 'rb'))
    model_dl = load(open('model_dl.pkl', 'rb'))
    
    # Prediction from loaded model 
    pred_ml = model_ml.predict_proba(data)
    pred_dl = model_dl.predict_proba(data)
    
    # Ensemble predictions by one to one
    pred_ensemble_prob = pred_ml * 0.5 + pred_dl * 0.5
    pred_ensemble = np.argmax(pred_ensemble_prob, axis=1)
    
    # Label Encoder로 복귀 
    le = pickle.loads(open("labelEncoder.pkl", "rb"))
    prediction = le.inverse_transform(pred_ensemble)
    
    return prediction

if __name__ == '__main__' :
    # shop_type_big, shop_type_small, latitude, longitude, shop_name, average_sale_price 
    columns = ['shop_type_big', 'shop_type_small', 'latitude', 'longitude', 'shop_name', 'average_sale_price']
    input_data = pd.DataFrame([sys.argv], columns = columns)
    
    processed_data = preprocessing(input_data)
    prediction = prediction(processed_data) 
    
    print(prediction)
     
    
            