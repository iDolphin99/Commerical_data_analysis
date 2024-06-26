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

#### 3. 참고 문서
  + 행정 읍면동 경계 데이터 : https://github.com/vuski/admdongkor/blob/master/ver20220309/ver20220309_emd_vote_simple.geojson
  + 서울 구 지도 : https://upload.wikimedia.org/wikipedia/commons/2/2c/01-00-seoul-ko.svg
