# Commerical_data_analysis_AI
Commercial location recommend system using Deep Learning data analysis  
딥러닝 데이터 분석을 통한 최적의 상권입지 추천 기술 개발

### 🛠️ **Specification**
<p>
  <img src="https://img.shields.io/badge/Python-3766AB?style=flat-square&logo=Python&logoColor=white"/></a>&nbsp   
  <img src="https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white"/></a>&nbsp 
  <img src="https://img.shields.io/badge/Scikit Learn-F7931E?style=flat-square&logo=scikitlearn&logoColor=white"/></a>&nbsp 
  <img src="https://img.shields.io/badge/Keras-D00000?style=flat-square&logo=keras&logoColor=white"/></a>&nbsp
  <img src="https://img.shields.io/badge/TensorFlow-F7931E?style=flat-square&logo=tensorflow&logoColor=white"/></a>&nbsp 
  <img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=Git&logoColor=white"/></a>&nbsp 
  <img src="https://img.shields.io/badge/Jupyter-F37626?style=flat-square&logo=jupyter&logoColor=white"/></a>&nbsp
  <br/>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white"/></a>&nbsp 
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white"/></a>&nbsp 
  <img src="https://img.shields.io/badge/JavaScript-ffb13b?style=flat-square&logo=javascript&logoColor=white"/></a>&nbsp
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white"/></a>&nbsp
  <img src="https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socketdotio&logoColor=white"/></a>&nbsp
  <img src="https://img.shields.io/badge/JSON-000000?style=flat-square&logo=json&logoColor=white"/></a>&nbsp
  <img src="https://img.shields.io/badge/Oracle-F80000?style=flat-square&logo=oracle&logoColor=white"/></a>&nbsp
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white"/></a>&nbsp
  <img src="https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazonaws&logoColor=white"/></a>&nbsp
  <img src="https://img.shields.io/badge/Ubuntu-E95420?style=flat-square&logo=ubuntu&logoColor=white"/></a>&nbsp
  <img src="https://img.shields.io/badge/MacOS-000000?style=flat-square&logo=apple&logoColor=white"/></a>&nbsp
</p>

### 🏆 **Award**
We got a prize for excellence in the spring academic conference, ASK 2022, 산학협동우수상🎉  
We got a prize for excellence in the KW & SW exhibition, Industry-Academic Collaboration SW Project, 최우수상🎉  
We got a prize for excellence in the KW University graduation exhibition, 3rd Prize, 장려상🎉  

### 🚩 **Demo**
[![Image](https://user-images.githubusercontent.com/78654870/175818055-320a7c87-019a-4ba1-bea0-53424c7e9b61.png)](https://www.youtube.com/watch?v=WBNOciDR3Zw)

<br>

## 🔎 Overview 

1. [Goal](https://github.com/iDolphin99/Commerical_data_analysis#-1-goal)
2. [EDA & Preprocessing](https://github.com/iDolphin99/Commerical_data_analysis#-2-eda--preprocessing)
3. [Regression](https://github.com/iDolphin99/Commerical_data_analysis#-3-regression)
4. [Classfication](https://github.com/iDolphin99/Commerical_data_analysis#-4-multi-class-classification)
5. [Deep Learning](https://github.com/iDolphin99/Commerical_data_analysis#-5-deep-learning)
6. [Score](https://github.com/iDolphin99/Commerical_data_analysis#-6-score)
7. [Platform](https://github.com/iDolphin99/Commerical_data_analysis#-7-platform) 
8. [Rule](https://github.com/iDolphin99/Commerical_data_analysis#-8-rule)
9. [Team Members](https://github.com/iDolphin99/Commerical_data_analysis#%EF%B8%8F-9-team-members)

<br>

## 🎯 1. Goal
Hello there 👋

This repository is for our awesome Industry-Academy Collaboration Project.
This would be helpful if you have some problems like **'how to deal with extreme skewed-data'** or **'how to solve regression problem with classification method'** and so on. We tried to write everything we experimented as much as possible. We hope even these attempts could help you.

We aim to develop **a system that recommends the best commercial location using machine learning and deep learning approach based on a large amount of commercial location data.** To do this, we train model to predict **'monthly gain'** of each stores. In addition we create **Web dashboard** to visualize our insights of huge commercial location data obtained in the project and add a short simulation function using the trained model. Finally, we wish this system help some small business owners who start their own businesses and want to increase their sales. 🙌

<br> 

## 📌 2. EDA & Preprocessing 
See our **EDA_report_code.ipynb** code. ('bd' means 'big data', and 'sd' means 'sample data' 😎)

The biggest problem in our data is that **it has large deviations and strong biases, skewness.** The monthly sales earned by each stores are too different and data should be pre-processed to help models predict this huge values well. 

We received two types of data, so there're two versions for EDA code. But we fianlly used version of big data to train models. It is important to apply appropriate preprocessing techniques for each data. So we have summarized the methods that we applied below and if you get more details about preprocessing techniques we used, please take a look for baseline code, especially markdown part. We have written in more detail there. 

- Removing missing values
- **Feature Selection** 
  - Drop unnecessary columns like identifier, shop code feature
- **Encoding** 
  - It is important to use appropriate encoding methods for categorical variables! 
  - Both ways were effective, but we we finally use binary encoder, for the reason that binary encoder does not give oridinality to categorical variables
  - Label Encoding 
  - Binary Encoding 
- **K-mean Clustering** 
  - Combined "latitude" and "longitude" to create a new feature "geo"
  - Use k++ method
  - k=9 is optimal number of clusters based on Silhouette Coefficient
- **Log Transformation** 
  - Log transform is very important in making a strongly right-skewed distribution follow a normal distribution
  - we also experimented scaler like MinMax, Normalization, Robust, Standard, but all of them were failed
- **Removing Outlier** 

<br>

## 🚀 3. Regression 
Usually, problems such as prdicting home prices or stock prices use a regression approach. So we also start with regression models and compared them. What we get attention is that the error rate of all models decreased by about 60% on average after the outlier was removed. 

Despite various attempts, there were clear limitations to regression method. 
- **K-Fold Cross-Validation**
  - Use k=5
- Log transformation <-> backtoOriginal
  - but the performance has fallen further 
- **Hyperparameter tuning**
  - Use GridSearchCV 
  - LGBM -> objective = tweedie, tweedie loss function => but there was a limiation to improving preformance more highter
- New Evaluation Metrics
- LightGBM for Quantile Regression

#### Model
- Gradient Boosting model
  - XGB, LGBM 
- Regularized Linear model
  - Ridge, Lasso
#### Evaluation metrics
- MSE, RMSE 
- adjusted R2  
  - you need more information about adjusted r2 score, check [this](https://www.inflearn.com/questions/48025)
#### BenchMark   
From left side, three columns mean **"For sample data", "For big data"** values we measured. Seeing 'for big data' figure is enough. 

  | Model |            MSE          |     RMSE    |  adj R2  |        MSE        |    RMSE    |  adj R2  | 
  |-------|:------------------------|:------------|:---------|:------------------|:-----------|:---------|
  |  XGB  |  84,552,727,800,574,600 |  287561374  |   0.88   |167,212,972,899,818| 12,931,085 |    0.3   | 
  | LGBM  | 104,100,031,628,893,000 |  318634288  |   0.87   |170,001,344,508,730| 13,038,456 |    0.2   | 
  | Ridge |                         |             |          |218,298,021,558,504| 14,774,911 |   0.14   | 
  | Lasso |                         |             |          |218,298,022,158,726| 14,774,911 |   0.14   | 

<br>

## 🚀 4. Multi-Class Classification
To solve the regression problem as a classification problem, it depends on **labeling the y variable, 'monthly gain'.** We exprienced with many various ideas and were able to achieve the Robust results when using Quantile. In particular, we can obtain the best results because we applied method according to the deviation of each shop type big. 
- Goal : **How to label(or classify) our skewed y data as many labels as possible and high accuracy?** 
  - **Labeling 1** : Cut a specific range like 10%, 20%, 33%, 50%.. from the front in order 
  - **Labeling 2** : Divide into lower fence, Q2, and upper fence values using quantiles 
  - **Labeling 3** : Divide into Q1, Q2 and Q3 values using quantiles
  - **Labeling 4** : Divide between minimum and maximum as heuristic (more detailed in 10 ~ 30 million won, other than sparsely)
  - Using mean, std for labeling, but we got the worst result from this method 🤔 
  - Rounding the values to make it easier to read, but it didn't mean much just for understanding 

#### Model
- Gradient Boosting model 
  - XGB, LGBM
#### Evaluation metrics
- Accuracy, Precision, Recall, F1 score 
#### BenchMark   
We only write accuracy score below. And as shown in the table, Labeling 3 method was the best. 

  |            |  Label |  XGB  |  LGBM  |                                   Description                             |
  |------------|:-------|:------|:-------|:--------------------------------------------------------------------------|
  | Labeling 1 |   10   |  0.22 |  0.21  |Categorized by specific ranges (10%, 20%, 33%) in order from small to large|
  | Labeling 2 |   31   |  0.57 |  0.30  |       (Quantile) Categorized by Lower Fence, Q2, and Upper Fence          |
  | Labeling 3 |   45   |  0.58 |  0.11  |                (Quantile) Categorized by Q1, Q2, and Q3                   |
  | Labeling 4 |   12   |  0.35 |  0.33  |             Categorized between min and max values of data                |
      
<br>

## 🚀 5. Deep Learning 
More higher performance and learning data from differenct perspectives, we trained Deep Learining model, especiall NLP(Natural Langauge Processing) techniques. To build NLP model, we used Sequential Model of Keras Library and created a new natural language variable from our data to obtain a totla of 120,000 word datasets.  

![16](https://user-images.githubusercontent.com/78654870/170285957-0ffa956c-493d-4828-943d-6aaa26569217.png)

<br>

## 📈 6. Score
The machine learning model learned various variables such as geo, average sale price, shop type and the deep learning model learned natural language meanings. We checked prediction accuracy when two models learned from different perspectives were properly ensembled, and we write each results below. To sum up, We finally got 0.83 acc! 👏👏👏

  |         Model        |  Accuracy | 
  |----------------------|:----------|
  |  XGB Classifier(ML)  |   0.58    |
  | Sequential Model(DL) |   0.81    | 
  | **0.5 ML + 0.5 DL**  |  **0.83** | 
  
<br>

## 🚀 7. Platform
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
      
  + 메뉴얼 (매출 데이터가 어려운 사용자들을 위한 기능)
    <br/><div><img width="800" alt="스크린샷 2022-05-25 오전 10 15 03" src="https://user-images.githubusercontent.com/90493141/170157818-1b0615ff-7c97-47c3-b2b4-e4c482b3b8ae.png"></div>
    
    + 사용법 : 웹 페이지 내 우측 하단의 원형 버튼 클릭
    + 목적 : XAI관점에서 매출 예측 데이터가 나오게 된 배경에 대한 메뉴얼 제공

#### 3. 참고 문서
  + 행정 읍면동 경계 : https://github.com/vuski/admdongkor/blob/master/ver20220309/ver20220309_emd_vote_simple.geojson
  + 서울 구 지도 : https://upload.wikimedia.org/wikipedia/commons/2/2c/01-00-seoul-ko.svg
 
<br>

## 📝 8. Rule 
- Please create your own folder and branch with your nickname and work on there. We use 'master' branch as main branch. 
- Take care about the data leakage. The data will be discarded after the project is completed. 
- 각자의 닉네임으로 된 folder를 만들어서, branch를 딴 후 작업해주세요. main branch 이름은 master로 지정합니다. 
- 데이터 유출에 주의해주세요. 프로젝트가 종료된 후 데이터는 파기합니다. 

<br>

## 🙋‍♂️ 9. Team members
[<img src="https://avatars.githubusercontent.com/u/78654870?v=4" width="200px">](https://github.com/iDolphin99)|[<img src="https://avatars.githubusercontent.com/u/49301413?v=4" width="230px;" alt=""/>](https://github.com/yoonbincho) |[<img src="https://avatars.githubusercontent.com/u/90493141?v=4" width="230px" >](https://github.com/nemzeet) |[<img src="https://avatars.githubusercontent.com/u/64514522?v=4" width="230" >](https://github.com/rlathgml1004)|
|:---:|:---:|:---:|:---:|
|👑[박형빈](https://github.com/iDolphin99) |[조윤빈](https://github.com/yoonbincho) |[남지수](https://github.com/nemzeet)| [김소희](https://github.com/rlathgml1004)|
