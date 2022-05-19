import os 
import pandas as pd
import numpy as np
import pickle
import category_encoders as ce
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
from xgboost import XGBClassifier


def preprocessing_for_ensemble(data) :
    currentPath = os.getcwd()

    # Split data  
    data_ml = data[['shop_type_big', 'shop_type_small', 'latitude', 'longitude', 'average_sale_price']]
    data_dl = data[['shop_type_big', 'shop_type_small', 'shop_name', 'address1', 'address2']]
    
    # Preprocessing data for ML 
    # Binary Encoding 
    be = pickle.load(open(currentPath + "/dolphin/binaryEncoder.pkl", "rb"))
    binary_df = be.transform(data[['shop_type_big', 'shop_type_small']])
    data_ml = data_ml.drop(['shop_type_big', 'shop_type_small'], axis=1)
    data_ml = pd.concat([data_ml, binary_df], axis=1)
    
    # Log Transform 
    data_ml['average_sale_price'] = data_ml['average_sale_price'].apply(lambda x : np.log(x))
    
    # K-Means Clustering 
    kmeans = pickle.load(open(currentPath + "/dolphin/kmeans.pkl", "rb"))
    data_ml = data_ml.astype({'latitude' : np.float, 'longitude' : np.float})
    data_ml['geo'] = kmeans.predict(data_ml[['latitude', 'longitude']])
    data_ml = data_ml.drop(['latitude', 'longitude'], axis=1)
    
    # Preprocessing data for DL
    # Concat data 
    data_dl['concat_text'] = data_dl['shop_name'] + ' ' + data_dl['shop_type_big'] + ' ' + data_dl['shop_type_small']
    data_dl['concat_text'] = data_dl['concat_text'] + ' ' + data_dl['address1'] + ' ' + data_dl['address2']
    data_dl = data_dl.drop(['shop_name', 'shop_type_big', 'shop_type_small', 'address1', 'address2'], axis=1)
    
    # Word Embedding 
    with open(currentPath + '/dolphin/tokenizer.pickle', 'rb') as handle:
        tk = pickle.load(handle)
    seq_data = tk.texts_to_sequences(data_dl['concat_text']) # nlp_input_length = 16
    pad_seq_data = pad_sequences(seq_data, 16)
    data_dl = pad_seq_data
    
    return data_ml, data_dl
    
    
def prediction(data_ml, data_dl) : 
    currentPath = os.getcwd()
    
    # Load model 
    model_ml = pickle.load(open(currentPath + '/dolphin/model_ml.h5', 'rb'))
    model_dl = tf.keras.models.load_model(currentPath + '/dolphin/model_dl.h5')
    
    # Prediction from loaded model 
    pred_ml_prob = model_ml.predict_proba(data_ml)
    pred_dl_prob = model_dl.predict(data_dl)
    
    # Ensemble predictions by one to one
    pred_ensemble_prob = pred_ml_prob * 0.5 + pred_dl_prob * 0.5
    pred_ensemble = np.argmax(pred_ensemble_prob, axis=1)
    
    # Label Encoder로 복귀 
    le = pickle.load(open(currentPath + "/dolphin/labelEncoder.pkl", "rb"))
    prediction = le.inverse_transform(pred_ensemble)
    
    return prediction


if __name__ == '__main__' :
    # shop_type_big, shop_type_small, latitude, longitude, shop_name, average_sale_price, address1, address2
    columns = ['shop_type_big', 'shop_type_small', 'latitude', 'longitude', 'shop_name', 'average_sale_price', 'address1', 'address2']
    test_data = ['뷔페', '고기 뷔페', '37.574436424779', '127.03044599927601', '오돌이', 56929, '동대문구', '용신동']
    
    # input_data = pd.DataFrame([sys.argv[1:7]], columns = columns) # dtype = 'object')
    input_data = pd.DataFrame([test_data], columns = columns)

    data_ml, data_dl = preprocessing_for_ensemble(input_data)
    prediction = prediction(data_ml, data_dl) 
    
    print(prediction)
     
    
            