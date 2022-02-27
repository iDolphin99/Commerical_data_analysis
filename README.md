# Commerical_data_analysis_AI
딥러닝 데이터 분석을 통한 최적의 상권입지 추천 기술 개발

<br>

## 🔎 Overview 
1. [EDA](https://github.com/iDolphin99/Commerical_data_analysis_AI/edit/master/README.md#-1-eda)
2. [Regression](https://github.com/iDolphin99/Commerical_data_analysis_AI/edit/master/README.md#-2-regression)
3. [Classfication](https://github.com/iDolphin99/Commerical_data_analysis_AI/edit/master/README.md#-3-classification) 
4. [Platform](https://github.com/iDolphin99/Commerical_data_analysis_AI/edit/master/README.md#-4-platform) 
5. [Rule](https://github.com/iDolphin99/Commerical_data_analysis_AI/edit/master/README.md#-5-rule)
6. [Team Members](https://github.com/iDolphin99/Commerical_data_analysis_AI/edit/master/README.md#%EF%B8%8F-6-team-members)

<br>

## 📌 1. EDA
See our **EDA_report_code.ipynb** code. The details would be added in READ.md at a later date.
- labeling, handling missing values
- **K-mean Clustering** : we combined "latitude" and "longitude" to create a new feature "geo", our k=9
- Scaler : falied(MinMax, Normalization, Robust, Standard), we finally use **log transformation**
- outlier detection : ongoing this work...

<br>

## 🚀 2. Regression 
The biggest problem in regression is to improve the performance of the model. In other words, it is to increase the evaluation score. 
- Idea : **How to deal with our skewed y data?** 
  - **Log transformation** : we apply log transformation to "average_sale_price" feature
  - **k-fold cross-validation** : we use k=5
  - **Log transformation <-> backtoOriginal** : but, the performance has fallen further
  - **LGBM -> objective = tweedie, tweedie loss function** : but, there was a limiation to improving preformance in LGBM, so we decieded not to use this function 
  - **Hyperparameter tuning** : ongoing this work... (with GridSearchCV)
  - **new evaluation metrics** : ongoing this work... 
  - **LightGBM for Quantile Regression** : ongoning this work... 
- model 
  - xgb
  - lgbm 
- Evaluation metrics
  - rmse, mse 
  - r2 score 
- BenchMark 
  
  Based on "Our Model" column, the left side is the expected value(or target) and the right side is the value we measured. 

  | Model |  MSE | RMSE |  R2  | Our Model |  MSE | RMSE |  R2  |
  |-----  |:-----|:-----|:-----|:----------|:-----|:-----|:-----|
  |  XGB  |0.1577|0.3971| 0.75 |    XGB    |87943413680580752.00|296552547.92|:-----|
  |  LGBM |      |      |      |   LGBM    |112181777798303184.00|334935483.03 |:-----|

<br>

## 🚀 3. Classification
The biggest problem in classification is labeling our y value, monthly gain.  

<br>

## 🚀 4. Platform
- AWS or SVN 
- React

<br>

## 📝 5. Rule 
- 각자의 닉네임으로 된 folder를 만들어서, branch를 딴 후 작업해주세요. main branch 이름은 master로 지정합니다. 
- 데이터 유출에 주의해주세요. 프로젝트가 종료된 후 데이터는 파기합니다. 

<br>

## 🙋‍♂️ 6. Team members
[<img src="https://avatars.githubusercontent.com/u/78654870?v=4" width="200px">](https://github.com/iDolphin99)|[<img src="https://avatars.githubusercontent.com/u/49301413?v=4" width="230px;" alt=""/>](https://github.com/yoonbincho) |[<img src="https://avatars.githubusercontent.com/u/90493141?v=4" width="230px" >](https://github.com/nemzeet) |[<img src="https://avatars.githubusercontent.com/u/64514522?v=4" width="230" >](https://github.com/rlathgml1004)|
|:---:|:---:|:---:|:---:|
|👑[박형빈](https://github.com/iDolphin99) |[조윤빈](https://github.com/yoonbincho) |[남지수](https://github.com/nemzeet)| [김소희](https://github.com/rlathgml1004)|
