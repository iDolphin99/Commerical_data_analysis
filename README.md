# Commerical_data_analysis_AI
Commercial location recommend system using Deep Learning data analysis  
딥러닝 데이터 분석을 통한 최적의 상권입지 추천 기술 개발

<br>

## 🔎 Overview 
1. [EDA & Preprocessing](https://github.com/iDolphin99/Commerical_data_analysis_AI#-1-eda)
2. [Regression](https://github.com/iDolphin99/Commerical_data_analysis_AI#-2-regression)
3. [Classfication](https://github.com/iDolphin99/Commerical_data_analysis_AI#-3-classification)
4. [Deep Learning](https://github.com/iDolphin99/Commerical_data_analysis_AI#-4-deep-learning)
5. [Platform](https://github.com/iDolphin99/Commerical_data_analysis_AI#-5-platform) 
6. [Rule](https://github.com/iDolphin99/Commerical_data_analysis_AI#-6-rule)
7. [Team Members](https://github.com/iDolphin99/Commerical_data_analysis_AI#%EF%B8%8F-7-team-members)

<br>

## 📌 1. EDA & Preprocessing 
See our **EDA_report_code.ipynb** code. ('bd' means 'big data', and 'sd' means 'sample data' 😎)  
We received two types of data, so there're two versions for EDA code. 
- Handling missing values, drop unnecessary columns
- Label Encoderlabeling : shop_type_big, shop_type_small
- **K-mean Clustering** : we combined "latitude" and "longitude" to create a new feature "geo", k=9
- **Log transformation** : we finally use this scaler 
- Scaler : falied(MinMax, Normalization, Robust, Standard)

<br>

## 🚀 2. Regression 
The biggest problem in regression is to improve the performance of the model. In other words, it is to increase the evaluation score.
- Idea : **How to deal with our skewed y data?** 
  - **Log transformation** : we apply log transformation to "average_sale_price" feature
  - **k-fold cross-validation** : we use k=5
  - **Log transformation <-> backtoOriginal** : but, the performance has fallen further
  - **LGBM -> objective = tweedie, tweedie loss function** : but, there was a limiation to improving preformance in LGBM, so we decieded not to use this function 
  - **Hyperparameter tuning** : We try this with GridSearchCV, but as a result of the meeting, it doesn't need to do this. 
  - **new evaluation metrics** : add r2 score, finally we use rmse, mse, r2 evaluation metrics
  - **LightGBM for Quantile Regression** : ongoning this work... 
- model 
  - randomforest : Not used! 
  - xgb
  - lgbm 
  - Ridge regression, lasso regression : ongoing this work...
- Evaluation metrics
  - rmse, mse 
  - r2 score : you need more information about r2 score, check [this](https://www.inflearn.com/questions/48025)
- BenchMark   
  From left side, three columns mean **"target(Goal score)", "For sample data", "For big data"** values we measured. 
  Seeing 'for big data' figure is enough. 

  | Model |  MSE | RMSE |  R2  |          MSE        |     RMSE    |  R2  |        MSE        |   RMSE   |  R2  | 
  |-------|:-----|:-----|:-----|:--------------------|:------------|:-----|:------------------|:---------|:-----|
  |  XGB  |0.1577|0.3971| 0.75 | 84552727800574600.00| 287561374.00| 0.88 | 133452775778200000| 363342072| 0.18 | 
  |  LGBM |      |      |      |104100031628893000.00| 318634288.00| 0.87 | 122804475776851000| 348992402| 0.26 | 
  | Ridge |      |      |      |                     |             |      | 805946649246134784| 897745314| -464 | 
  | Lasso |      |      |      |                     |             |      |                   |          |      | 

<br>

## 🚀 3. Classification
The biggest problem in classification is labeling our y value, monthly gain.  
- Idea : **How to deal with(classify or label) our skewed y data?** 
  - **Labeling 1** : labeling from 3 to 10, and accuracy.. 
  - **Labeling 2** : 
  - **Labeling 3.1** : ongoing this work... 
  - **Labeling 3.2** :
  - **Labeling 4** : 
  - **TabNet** : planning this work...
- model 
  - xgb
  - lgbm 
- Evaluation metrics
  - accuracy, precision, recall
- BenchMark    
  From left side, each column means **"Applying Labeling 1", "Applying Labeling 3.1"...** value we measured.  
  Option 1 : Removing Outlier  
  Option 2 : Rounding labeling  
  Option 3(all) : Removing Outlier + Rounding labeling 

  |    Model   |  accuracy(clf1) | accuracy(clf3.1) | accuracy(clf3.2) | accuracy(clf4) |
  |------------|:----------------|:-----------------|:-----------------|:---------------|
  | XGB        |0.22/0.37        |       0.57       |        0.57      |      0.35      |
  | LGBM       |       0.21      ||||
  | XGB(opt1)  |||||
  | LGBM(opt1) |||||
  | XGB(opt2)  |                 |                  |        0.58      |                |
  | LGBM(opt2) |||||
  | XGB(all)   |                 |                  |        0.58      |                |
  | LGBM(all)  |||||

<br>

## 🚀 4. Deep Learning 


<br>

## 🚀 5. Platform
#### 0. 개발환경
  + OS : Ubuntu
  + DBMS : Oracle 11g/xe
  + Backend : Javascript (Node.js)
  + Front : HTML, CSS, Javascript
  
#### 1. OpenK 
<div>&nbsp;&nbsp;&nbsp;&nbsp;<img width="100" alt="image" src="https://user-images.githubusercontent.com/90493141/170158089-300182ac-eee0-483e-9986-702ad5659b77.png"></div><br/>

  + Mean : 많은 정보들이 모여 하나의 결과를 제공
  + Purpose : 상권입지 정보와 매출 정보를 쉽게 알아볼 수 있는 Web DashBoard 제작

#### 2. Category 
  + 상점별 (서울 내 상점별 매출 정보)
    <br/><div><img width="800" alt="스크린샷 2022-05-25 오전 10 37 16" src="https://user-images.githubusercontent.com/90493141/170160344-7351fbc6-78d7-4b1d-80dd-525c6980feb2.png"></div>
    
    + 사용법 : 
      1) 원하는 지역 & 업종 필터를 선택
      2) 필터링 후 지도상에 표시된 핀들 중 원하는 상점의 핀을 선택
      3) 선택된 상점 정보 (상점 매출 정보) 확인
    + 데이터 정보 :
      + 핀 : 각 상점의 위도&경도를 활용해 지도상에 핀으로 표시하고, 핀 안의 내용은 해당 상점의 평균 매출
      + 필터링 : 원하는 업종 & 지역으로 필터링하여 사용자가 원하는 조건의 상점들을 지도상에 표시해주는 기능
        + 필터 없음 : (행정구+행정동)×(업종대분류+업종소분류)의 종류별로 가장 최신 데이터가 존재하는 상점
        + 업종 : 업종대분류와 업종소분류(숫자)를 선택했을 경우 선택된 업종으로 상점 필터링
        + 지역 : 행정구와 행정동을 선택했을 경우 선택된 지역으로 상점 필터링
        + 업종+지역 : 지역과 업종 필터를 동시에 선택했을 경우
      + 상점 정보 : 선택된 핀(상점)의 매출 정보
        + 상점 이름 : 선택된 상점 이름 (개인정보상 일부 제공)
        + 업종 : 선택된 상점의 업종 코드 (업종대분류+업종소분류)
        + 위치 : 선택된 상점의 위도 & 경도 기반 주소 (도로명+행정주소 & 지번+행정주소)
        + 월별 매출 : 선택된 상점의 월별 매출
        + 다음달 매출 예측 : 사용자가 단가를 조정하여 가장 최근 달을 기준으로 다음 달의 매출을 예측해주는 시스템
        
  + 지역별 (서울 구별 매출 정보)
     <br/><div><img width="800" alt="스크린샷 2022-05-25 오전 10 07 32" src="https://user-images.githubusercontent.com/90493141/170157138-25c2fb62-b0ae-41ae-83d0-e935e57d1e2d.png"></div>

    + 사용법 : 서울 구 지도를 통해 보고싶은 구를 클릭하여 해당 구에서 제공하는 데이터 확인
    + 데이터 정보 : 
      + 매출 정보 : 선택된 구의 매출 정보 (서울 전체 구 매출 순위, 구내 상점 평균 매출, 구내 상점 최대 매출)
      + 매출 비교 : 선택된 구와 서울 전체 매출 비교 (구내 상점 평균 매출, 구내 상점 최대 매출, 구내 상점 월별 평균 매출)
      + 인기 업종 : 선택된 구의 구내 인기 업종 TOP3
      + 인기 키워드 : 선택된 구의 구내 상점 이름 & 업종 기반 인기 키워드
      
  + 메뉴얼 : 매출 데이터가 어려운 사용자들을 위한 기능
    <br/><div><img width="800" alt="스크린샷 2022-05-25 오전 10 15 03" src="https://user-images.githubusercontent.com/90493141/170157818-1b0615ff-7c97-47c3-b2b4-e4c482b3b8ae.png"></div>
    
    + 사용법 : 웹 페이지 내 우측 하단의 원형 버튼 클릭
    + 목적 : XAI관점에서 매출 예측 데이터가 나오게 된 배경에 대한 메뉴얼 제공

#### 4. 참고 문서
  + 행정 읍면동 경계 : https://github.com/vuski/admdongkor/blob/master/ver20220309/ver20220309_emd_vote_simple.geojson
 
<br>

## 📝 6. Rule 
- Please create your own folder and branch with your nickname and work on there. We use 'master' branch as main branch. 
- Take care about the data leakage. The data will be discarded after the project is completed. 
- 각자의 닉네임으로 된 folder를 만들어서, branch를 딴 후 작업해주세요. main branch 이름은 master로 지정합니다. 
- 데이터 유출에 주의해주세요. 프로젝트가 종료된 후 데이터는 파기합니다. 

<br>

## 🙋‍♂️ 7. Team members
[<img src="https://avatars.githubusercontent.com/u/78654870?v=4" width="200px">](https://github.com/iDolphin99)|[<img src="https://avatars.githubusercontent.com/u/49301413?v=4" width="230px;" alt=""/>](https://github.com/yoonbincho) |[<img src="https://avatars.githubusercontent.com/u/90493141?v=4" width="230px" >](https://github.com/nemzeet) |[<img src="https://avatars.githubusercontent.com/u/64514522?v=4" width="230" >](https://github.com/rlathgml1004)|
|:---:|:---:|:---:|:---:|
|👑[박형빈](https://github.com/iDolphin99) |[조윤빈](https://github.com/yoonbincho) |[남지수](https://github.com/nemzeet)| [김소희](https://github.com/rlathgml1004)|
