///////////////// 소켓 객체 생성
let socket = io.connect();
let predFlag = false;
let predBtnFlag = false;
let startPredFlag = false;
let selectedPredNum = null;
let selectedStore = ['', '', '', '', '', '', '', ''];
let flag = [false, false]; // initMap, notInitMap
let startFlag = false;
///////////////// 사용자가 실시간으로 선택한 업종 (대, 소) 지역 (구, 동)
let selectedJob = '';
let selJobSmall = null;
let selectedJob_All = ['', '']; // 업종 대분류, 소분류
let selectedLoc = '';
let selLocSmall = null;
let selectedLoc_All = ['', '']; // 지역 구, 동

///////////////// 반올림 함수
function roundXL(n, digits) {
    if (digits >= 0) return parseFloat(n.toFixed(digits)); // 소수부 반올림
  
    digits = Math.pow(10, digits); // 정수부 반올림
    var t = Math.round(n * digits) / digits;
  
    return parseFloat(t.toFixed(0));
  }

///////////////// 가격 출력 패턴
function priceStyle(n, type){

    let result = '';

    var mill = parseInt(n/10000);
    var th = n-mill*10000;
    
    if (type == 1){
        // 억대인 경우 -> 1.013억
        // 만대인 경우 -> 123만

        if (mill != 0) {

            th = th.toString().padStart(4, '0');
            th = th.replace(/0+$/, '');

            res = (mill.toString()+"."+th).substring(0,5)

            if (res[res.length-1] != "."){
                res = parseFloat(res);
                res = res.toString();
                result = [res , "억"];
            } else {
                result = [res.substring(0,4), "억"]
            }

        } else {
            result = [th.toString() ,"만"];
        }


    } else if (type == 2){
        // 억대인 경우 -> 1억 123만
        // 만대인 경우 -> 123만

        if (mill != 0) {
            result = mill.toString()+"억 "+th.toString()+"만원";
        } else {
            result = th.toString()+"만원";
        }

    } else if (type == 3){ // 다음달 상점 월 매출 예측
        
        result = n.toString();

        if (n >= 1000 && n < 1000000){
            result = result.substring(0, result.length-3)+","+result.substring(result.length-3,result.length);
        } else if(n>=1000000) {
            //165,260,550
            result = result.substring(0, result.length-6)+","+result.substring(result.length-6, result.length-3)+
            ","+result.substring(result.length-3,result.length);
        } 
    }

    return result;

}

///////////////// 상점이름 정규화 출력
function marketNameStyle(str){
    let newStr = str.replace(/(?<=\([^()]*\)\s*\S{1}).*/, '*');
    newStr = newStr.replace(/(?<=\S{1}).*(?=\([^()]*\))/, '*');
    newStr = newStr.replace(/(?<=\([^()]{1}).*(?=\))/, '*');
    if (newStr == str){
        newStr = newStr.replace(/(?<=\s*\S{1}).*/, '*');
    }
    return newStr;

}


///////////////// 차트
google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(startChart);
let pin_data = null;// [['Month', '매출(만)', '매출(만)'], ['', 0, 0]];
let chart = null;
let options = null;

function startChart() {
    options = {
        backgroundColor: {
            opacity: 100,
            fill:'transparent',
        },
        
        width:410, /* 430 */
        height:196.5,
        

        legend : {
			position : 'none'
		},
            
            hAxis: {
                //title: '날짜'
            },
            vAxis: {
            //title: '매출 (만원)'
            },

            seriesType: 'bars',
                
            series: {
                0: { type: 'line', lineWidth: 1.7, pointSize:3, legend: 'right',},
                1: { },
                /*
                2: { type: 'area',},
                3: { type: 'area,'},
                */
            },
                    
            bar: { 
                groupWidth: '40%' , 
                rx:10,
                ry:10,
                },

            tooltip: { trigger: 'both' },

            animation: {
                startup: true,
                duration: 1000,
                easing: 'out' },		
    };

    chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
    drawChart();
}


function drawChart() {
    if (pin_data != null && options != null && chart != null) {
        let data = new google.visualization.arrayToDataTable(pin_data);
        chart.draw(data, options);

        if(predBtnFlag){
            chart.setSelection([{ row: (pin_data.length-2), column:1}]);
        }
    }
};

////////////////// 지도
let locations = [];
start_data = start_data.replaceAll('&#34;', '\"');
start_data = JSON.parse(start_data);


for(var i = 0; i < start_data.length; i++){
    locations[i] = {
        place : start_data[i][0], lat : parseFloat(start_data[i][2]), lng : parseFloat(start_data[i][1]), 
        avgmonth: priceStyle(roundXL(start_data[i][3]/10000, 0), 1),
        avgmonth2: start_data[i][3],
        strlat : start_data[i][2], strlng : start_data[i][1],
    };
}

let triangleCoords = [];

function startMarketData() {
    ///// Start   
        var geocoder = new kakao.maps.services.Geocoder();
        var relating_start = new kakao.maps.LatLng(locations[0].lat, locations[0].lng);
        let add = '';
        geocoder.coord2Address(relating_start.getLng(), relating_start.getLat(), function(result, status){
            if(status == kakao.maps.services.Status.OK){
                selectedStore = ['', '', '', '', '', '', '', ''];
                selectedPredNum = null;
                // 도로명 주소가 존재하는 경우 : 도로명주소, 그렇지 않은 경우 : 지번주소
                add += !!result[0].road_address ? result[0].road_address.address_name : result[0].address.address_name;
                var n =  marketNameStyle(locations[0].place); // 상점명
                var ap = priceStyle(roundXL(locations[0].avgmonth2/10000, 0), 2); // 평균 매출
    
                selectedStore[4] = locations[0].place;
                selectedStore[2] = locations[0].strlat;
                selectedStore[3] = locations[0].strlng;
                
                socket.emit("select_pin", socket.id, locations[0].place, locations[0].lng, locations[0].lat,
                    n, add, ap);
                
                pinFlag = true;
                
                return;
            }
    });
}

function initMap() {

    var lastDiv = null;
    var lastLocinfo = null;

    // custom marker class
    class HTMLMapMarker extends google.maps.OverlayView {
		constructor(lating, html, map, locinfo, count, kakao_relating) {
			super();
			this.latlng = lating;
			this.html = html;
            this.locinfo = locinfo;
            this.count = count;
            this.kakao_relating = kakao_relating
            this.map = map;
			this.setMap(map);
		}

		createDiv() {
			this.div = document.createElement("div");
			this.div.style.position = "absolute";
			if (this.html) {
				this.div.innerHTML = this.html;
			}
            if (this.count == 0){
                lastDiv = this.div;
                lastLocinfo = this.locinfo;
            }
			google.maps.event.addDomListener(this.div, "click", event => {

                // var geocoder = new google.maps.Geocoder(); 
                var locinfo = this.locinfo;

                lastDiv.innerHTML = '<button class="price_pin">'+lastLocinfo.avgmonth[0]+'<br/><text class="price_style">'+
                lastLocinfo.avgmonth[1]+'</text></button>';
                

                var newDiv = this.div;
                newDiv.innerHTML = '<button class="price_pin_selected">'+locinfo.avgmonth[0]+'<br/><text class="price_style">'+
                locinfo.avgmonth[1]+'</text></button>';
                lastDiv = newDiv;
                lastLocinfo = locinfo;

                //중심 위치를 클릭된 마커의 위치로 변경
                this.map.setCenter(this.getPosition());
                //마커 클릭 시의 줌 변화
                this.map.setZoom(19);

                var geocoder = new kakao.maps.services.Geocoder();
                let add = '';
                geocoder.coord2Address(kakao_relating.getLng(), kakao_relating.getLat(), function(result, status){
                    if(status == kakao.maps.services.Status.OK){
                        // 도로명 주소가 존재하는 경우 : 도로명주소, 그렇지 않은 경우 : 지번주소
                        selectedStore = ['', '', '', '', '', '', '', ''];
                        add += !!result[0].road_address ? result[0].road_address.address_name : result[0].address.address_name;
                        var n =  marketNameStyle(locinfo.place); // 상점명 // 상점명
                        var ap = priceStyle(roundXL(locinfo.avgmonth2/10000, 0), 2); // 평균 매출
                        
                        selectedStore[4] = locinfo.place;
                        selectedStore[2] = locinfo.strlat;
                        selectedStore[3] = locinfo.strlng;

                        socket.emit("select_pin", socket.id, locinfo.place, locinfo.lng, locinfo.lat, n, add, ap);
                        return;       
                    }
                });

			});
		}

		appendDivToOverlay() {
			const panes = this.getPanes();
			panes.overlayImage.appendChild(this.div);
		}

		positionDiv() {
			const point = this.getProjection().fromLatLngToDivPixel(this.latlng);
			let offset = 25;
			if (point) {
				this.div.style.left = `${point.x - offset}px`;
				this.div.style.top = `${point.y - 50}px`;
			}
		}

		draw() {
			if (!this.div) {
				this.createDiv();
				this.appendDivToOverlay();
			}
			this.positionDiv();
		}

		remove() {
			if (this.div) {
				this.div.parentNode.removeChild(this.div);
				this.div = null;
			}
		}

		getPosition() {
			return this.latlng;
		}

		getDraggable() {
			return false;
		}
    }
    ////////////////////////////
    if(!flag[0]&&!flag[1] || startFlag){
      console.log('is initMap');
      flag[0] = true;
      startMarketData();
    }
    
    

    ///// Map Options
    var mapOptions = {
        zoom: 18,
        center: { lat: locations[0].lat, lng: locations[0].lng },
        disableDefaultUI:true,
        zoomControl: true,
        overviewMapControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    const map = new google.maps.Map(document.getElementById("map"), mapOptions);

    
    const bermudaTriangle = new google.maps.Polygon({
        path: triangleCoords,
        strokeColor: "#318688",
        strokeOpacity: 0.7,
        strokeWeight: 2,
        fillColor: "#318688",
        fillOpacity: 0.13,
      });

    bermudaTriangle.setMap(map);
    

    ///// Marker Event
    for (var i = 0; i < locations.length; i++) {
        
        var relating = new google.maps.LatLng(locations[i].lat, locations[i].lng);
        var kakao_relating = new kakao.maps.LatLng(locations[i].lat, locations[i].lng);

        let markerClass = '';
        let markerUnitClass = '';
        if (i==0){
            markerClass = 'price_pin_selected';
            markerUnitClass = 'price_style_selected';
        }
        else 
            markerClass = 'price_pin'
            markerUnitClass = 'price_style'

        var markerHTML = '<button class="'+markerClass+'">'+locations[i].avgmonth[0]+'<br/><text class="'+markerUnitClass+'">'+
                            locations[i].avgmonth[1]+'</text></button>';
        var customMarker = new HTMLMapMarker(relating, markerHTML, map, locations[i], i, kakao_relating);
    }   
}

function selectJob(job, job_small){

    if (job == '') {
        if(selectedLoc_All[0] == ''){
            location.href='/';
        } else if (selectedLoc_All[0] != '' && selectedLoc_All[1] == ''){
            selectedJob_All = ['', ''];
            socket.emit("select_job", socket.id, job);
        }
        else {
            selectedJob_All = ['', ''];
            socket.emit("select_job", socket.id, job);
            socket.emit("select_loc_small", socket.id, selectedLoc_All[0], selectedLoc_All[1]);
        }

    } else {
        selectedJob = job;
        selJobSmall = job_small;
        selectedJob_All = [job, ''];
        socket.emit("select_job", socket.id, job);
    }
}

function selectJobSmall(job){

    if (job == '') {
        selectedJob_All[1] = '';
    } else {
        selectedJob_All = [selectedJob, job];

        if (selectedLoc_All[1] == ''){
            socket.emit("select_job_small", socket.id, selectedJob, job);
        } else {
            socket.emit("select_job_loc_small", socket.id, selectedLoc_All[0], selectedLoc_All[1], 
            selectedJob_All[0], selectedJob_All[1]);
        }
    }
}

function selectLoc(loc, loc_small){

    if (loc == '') {
        if(selectedJob_All[0] == ''){
            location.href='/';
        } else if (selectedJob_All[0] != '' && selectedJob_All[1] == ''){
            selectedLoc_All = ['', ''];
            socket.emit("select_loc", socket.id, loc);
        }
        else {
            selectedLoc_All = ['', ''];
            socket.emit("select_loc", socket.id, loc);
            socket.emit("select_job_small", socket.id, selectedJob_All[0], selectedJob_All[1]);
        }
    } else {
        selectedLoc = loc;
        selLocSmall = loc_small;
        selectedLoc_All = [loc, ''];
        
        socket.emit("select_loc", socket.id, loc);
    }
}

function selectLocSmall(loc){

    if (loc == '') {
        selectedLoc_All[1] = '';
    } else {
        selectedLoc_All = [selectedLoc, loc];

        if (selectedJob_All[1] == ''){
            socket.emit("select_loc_small", socket.id, selectedLoc, loc);
        } else {
            socket.emit("select_job_loc_small", socket.id, selectedLoc_All[0], selectedLoc_All[1], 
            selectedJob_All[0], selectedJob_All[1]);
        }
        
    }
}

///////////////// 업종 대분류 선택시 발동
let count2 = 0;

socket.on("select_job_result", function(data){

    var result = JSON.parse(`${data.job_small}`);

    for(c = selJobSmall.length; c > 0  ; c--){
        selJobSmall.options[c-1] = null;
    }        
    count2 = 0;
                
    if(result.length == 0){
        selJobSmall.options[0] = new Option('-선택-','', '', 'true');
    }

    else {

    for (var i = 0; i < result.length+1 ; i++){
            
        if (count2 == 0){
            selJobSmall.options[count2] = new Option('-선택-','', '', 'true');
        } else {
            selJobSmall.options[count2] = new Option((i).toString().padStart(3, '0'), result[i-1][0]);
        }
            count2++;
        }
    }

});

///////////////// 업종 소분류 선택시 발동
socket.on("select_job_small_result", function(data){

    var result = JSON.parse(`${data.job}`);

    locations = [];

    for(var i = 0; i < result.length; i++){
        
        locations[i] = {
            place : result[i][1], lat : parseFloat(result[i][3]), lng : parseFloat(result[i][2]), 
            avgmonth: priceStyle(roundXL(result[i][4]/10000, 0), 1),
            avgmonth2: result[i][4],
            strlat : result[i][3], strlng : result[i][2],
        };
    }

    triangleCoords = [];

    stat = true;
    initMap();

});


///////////////// 지역구 선택시 발동
let count3 = 0;

socket.on("select_loc_result", function(data){

    var result = JSON.parse(`${data.dong}`);

    for(c = selLocSmall.length; c > 0  ; c--){
        selLocSmall.options[c-1] = null;
    }        
    count3 = 0;
                
    if(result.length == ''){
        selLocSmall.options[0] = new Option('-선택-','', '', 'true');
    }

    else {

    for (var i = 0; i < result.length+1 ; i++){
            
        if (count3 == 0){
            selLocSmall.options[count3] = new Option('-선택-','', '', 'true');
        } else {
            selLocSmall.options[count3] = new Option(result[i-1][0], result[i-1][0]);
        }
            count3++;
        }
    }

});


///////////////// 지역동 선택시 발동
socket.on("select_loc_small_result", function(data){

    var result = JSON.parse(`${data.sr}`);
    var gu = `${data.gu}`;
    var dong = `${data.dong}`;

    locations = [];

    for(var i = 0; i < result.length; i++){
        
        locations[i] = {
            place : result[i][1], lat : parseFloat(result[i][3]), lng : parseFloat(result[i][2]), 
            avgmonth: priceStyle(roundXL(result[i][4]/10000, 0), 1),
            avgmonth2: result[i][4],
            strlat : result[i][3], strlng : result[i][2],
        };
    }

    socket.emit("select_polygon", socket.id, gu, dong);
});

///////////////// 업종 대분류, 소분류, 지역구, 지역동 선택시 발동
socket.on("select_job_loc_small_result", function(data){

    var result = JSON.parse(`${data.result}`);
    var gu = `${data.gu}`;
    var dong = `${data.dong}`;

    if (result.length == 0){
        window.alert('선택된 지역, 업종의 데이터가 없습니다 !');
        stat = false;
    }

    else  {
        locations = [];

        for(var i = 0; i < result.length; i++){
            
            locations[i] = {
                place : result[i][1], lat : parseFloat(result[i][3]), lng : parseFloat(result[i][2]), 
                avgmonth: priceStyle(roundXL(result[i][4]/10000, 0), 1),
                avgmonth2: result[i][4],
                strlat : result[i][3], strlng : result[i][2],
            };
        }

        socket.emit("select_polygon", socket.id, gu, dong);
    }

});




///////////////// 핀 선택시 발동
let last_aa = null;
socket.on("select_pin_result", function(data){
    var result = JSON.parse(`${data.info}`);
    var name = `${data.name}`;
    var add = `${data.add}` + " ("+result[0][4] + " " + result[0][5]+")";
    var avg = `${data.avg}`;
    last_aa  = result[result.length-1][9];
    
    pin_data = [];

    for(var i = 0; i < result.length + 1; i++){

        if(i == 0){
            pin_data[i] = ['Month', '매출(만)', {role: 'style'}, '매출(만)', {role: 'style'}];
        }
        else {
            let str = result[i-1][0];
            pin_data[i] = [
                str.substring(2,4)+"/"+str.substring(4,6), 
                roundXL(result[i-1][8]/10000, 0), 
                '#318688',
                roundXL(result[i-1][8]/10000, 0),
                '#d9eae1',
            ];
        }
    }

    selectedStore[0] = result[0][2];
    selectedStore[1] =  result[0][3];
    selectedStore[6] = result[0][4];
    selectedStore[7] = result[0][5];

    socket.emit("select_marketcode", socket.id, result[0][2], result[0][3], name, add, avg, last_aa);
});

///////////////// 업종 코드 불러오기
socket.on("select_marketcode_result", function(data){
    var result = JSON.parse(`${data.marketcode}`);

    var type = result[0][0] +' '+ result[0][1].toString().padStart(3, '0');
    var name = `${data.name}`;
    var addr = `${data.addr}`;
    var avg = `${data.avg}`;
    var last_aa = `${data.last_aa}`;

    getMarketData(type, name, addr, avg, last_aa);

});

///////////////// 지역이 선택되었을 경우 지도 위 polygon 영역 정하기
socket.on("select_polygon_result", function(data){

    triangleCoords = [];

    var polygon = JSON.parse(`${data.polygon}`);

    for(var i = 0; i < polygon.length; i++){
        triangleCoords[i] = new google.maps.LatLng(polygon[i][0], polygon[i][1]);
    }
    
    stat = true;
    initMap();
    

});

///////////////// 상점 매출 예측 결과
let textLastMonth = null;
socket.on("pred_next_monthly_gain_result", function(data){

    let result = parseInt(`${data.data}`);
    result = roundXL(result/10000, 0);

    let minFlag = true;
    let min = parseInt(`${data.min}`);
    min = roundXL(min/10000, 0);
    if(min == 0) minFlag = false;
    min = priceStyle(min, 1);
    min = min[0]+min[1];

    let max = parseInt(`${data.max}`);
    max = roundXL(max/10000, 0);
    max = priceStyle(max, 1);
    max = max[0]+max[1];
    
    let arrNum = null, arrTitle = null;
    if(!predBtnFlag){
        textLastMonth = null;
        arrNum = pin_data.length;
        var lastTitle = pin_data[arrNum-1][0];
        let lastYear = parseInt(lastTitle.substring(0,2));
        var lastMonth = parseInt(lastTitle.substring(3,5)) + 1;
        
        if (lastMonth > 12){
            lastYear += 1;
            lastMonth = 1;
        }
        lastYear = lastYear.toString()+'/';
        textLastMonth = lastYear;

        if (lastMonth < 10){
            textLastMonth += '0'+lastMonth.toString();
            lastMonth = '0'+lastMonth.toString()+"\n예상 매출";
        }else {
            textLastMonth += lastMonth.toString();
            lastMonth = lastMonth.toString()+"\n예상 매출";
        }
        arrTitle = lastYear+lastMonth;

    } else {
        arrNum = pin_data.length-1;
        arrTitle = pin_data[arrNum][0];
    }

    pin_data[arrNum] = [
        arrTitle, 
        result,
        '#318688',
        result,
        '#95cdc8',
    ];

    for(var i = 0; i < arrNum; i++){

        if (i>=1) {
            pin_data[i][2] = '#95cdc8';
            pin_data[i][4] = '#d9eae1';
        }
    }

    predBtnFlag = true;
    

    var fadeDiv = document.getElementById('fadeDiv');
    var summaryTran = document.getElementsByClassName('summary_translucent')[0];
    fadeDiv.removeChild(summaryTran);


    var summarySec = document.getElementsByClassName('summary_clear')[0];
    var prediction_btn = document.getElementsByClassName('prediction_btn')[0];
    let prediction_text = document.getElementsByClassName('prediction_text')[0];
    summarySec.removeChild(prediction_text);
    summarySec.removeChild(prediction_btn);

    result = priceStyle(result, 1);
    result = result[0]+result[1];

    prediction_text = document.createElement('div');
    prediction_text.className = 'prediction_text fade-in-box-two';
    if (minFlag){
        prediction_text.innerHTML = textLastMonth+" 예상 평균"+' <text id="pred_text_num" class="color">'+result+'</text> '
    +'<text style="color:#d9eae1;">•</text> 최소 '+'<text id="pred_text_num" class="color">'+min+'</text> <text style="color:#d9eae1;">•</text> 최대 '+'<text id="pred_text_num" class="color">'+max+'</text>';
    } else {
        prediction_text.innerHTML = textLastMonth+" 예상 평균"+' <text id="pred_text_num" class="color">'+result+'</text> '
        +'<text style="color:#d9eae1;">•</text> 최대 '+'<text id="pred_text_num" class="color">'+max+'</text>';
    }
    summarySec.appendChild(prediction_text);
    drawChart();
    
});


function getMarketData(markettype, marketname, marketaddr, marketavg, last_aa){

    predFlag = false;
    predBtnFlag = false;
    selectedPredNum = null;

    var centerSec = document.getElementById("centerSec");

    if (document.getElementById('fadeDiv') != null){
        document.getElementById('fadeDiv').remove();
    }

    const fadeDiv = document.createElement('div');
    fadeDiv.id = 'fadeDiv';
    fadeDiv.className = 'fade-in-box-two';


    // 상점명, 위치, 업종코드, 평균매출
    const infoSec = document.createElement('section');
    infoSec.className = 'information';
    const name = document.createElement('h2');
    name.id = 'pin_name';
    name.innerHTML = marketname;
    const loc = document.createElement('h3');
    loc.id = 'pin_loc';
    loc.innerHTML = '위치 : '+marketaddr;
    const type = document.createElement('h3');
    type.id = 'pin_type';
    type.innerHTML = '업종 코드 : '+markettype;
    const avg_price = document.createElement('h3');
    avg_price.id = 'pin_avg_price';
    avg_price.innerHTML = '평균 매출 : '+marketavg;
    infoSec.appendChild(name);
    infoSec.appendChild(loc);
    infoSec.appendChild(type);
    infoSec.appendChild(avg_price);
    
    // pred next month gain
    const summarySec = document.createElement('section');
    summarySec.className = 'summary_clear';

    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper';

    const sliderContainer = document.createElement('div');
    sliderContainer.id = 'sliderContainer';

    const tick_slider = document.createElement('div');
    tick_slider.className = 'tick-slider';

    const tick_slider_header = document.createElement('div');
    tick_slider_header.className = 'tick-slider-header';

    const tick_slider_value_container = document.createElement('div');
    tick_slider_value_container.className = 'tick-slider-value-container';

    const sizeLabelMin = document.createElement('div');
    sizeLabelMin.id = 'sizeLabelMin';
    sizeLabelMin.className = 'tick-slider-label';
    sizeLabelMin.innerHTML = '1';
    const sizeLabelMax = document.createElement('div');
    sizeLabelMax.id = 'sizeLabelMax';
    sizeLabelMax.className = 'tick-slider-label';
    sizeLabelMax.innerHTML = '1,000,000';
    const sizeValue = document.createElement('div');
    sizeValue.id = 'sizeValue';
    sizeValue.className = 'tick-slider-value';

    tick_slider_value_container.appendChild(sizeLabelMin);
    tick_slider_value_container.appendChild(sizeLabelMax);
    tick_slider_value_container.appendChild(sizeValue);

    const tick_slider_background = document.createElement('div');
    tick_slider_background.className = 'tick-slider-background';

    const sizeProgress = document.createElement('div');
    sizeProgress.id = 'sizeProgress';
    sizeProgress.className = 'tick-slider-progress';

    const sizeTicks = document.createElement('div');
    sizeTicks.id = 'sizeTicks';
    sizeTicks.className = 'tick-slider-tick-container';


    const sizeSliderContainer = document.createElement('div');
    sizeSliderContainer.id = 'sizeSliderContainer';
    const sizeSlider = '<input id="sizeSlider" class="tick-slider-input" type="range"'+
    ' min="1" max="39" step="1" value="0" data-tick-step="1" data-tick-id="sizeTicks"'+
    ' data-value-id="sizeValue" data-progress-id="sizeProgress" data-handle-size="18"'+
    ' data-min-label-id="sizeLabelMin" data-max-label-id="sizeLabelMax"/>';
    sizeSliderContainer.innerHTML = sizeSlider;
    
    tick_slider.appendChild(tick_slider_header);
    tick_slider.appendChild(tick_slider_value_container);
    tick_slider.appendChild(tick_slider_background);
    tick_slider.appendChild(sizeProgress);
    tick_slider.appendChild(sizeTicks);
    tick_slider.appendChild(sizeSliderContainer);

    sliderContainer.appendChild(tick_slider);
    wrapper.appendChild(sliderContainer);
    
    var prediction_text = document.createElement('text');
    prediction_text.className = 'prediction_text';
    prediction_text.innerHTML = '마지막 달 평균 단가 <text id="pred_text_num" class="color">'+ priceStyle(roundXL(parseFloat(last_aa), 0),3)+'원</text>';


    summarySec.appendChild(wrapper);
    summarySec.appendChild(prediction_text);

    // fadeDiv appendChild
    fadeDiv.appendChild(infoSec);
    //fadeDiv.appendChild(monthSec);
    fadeDiv.appendChild(summarySec);


    // body appendChild
    centerSec.appendChild(fadeDiv);
    
    drawChart();
    init();
    startFlag = true;
}




/////////////////////////////// Slider Bar
var selectPredNum = [1, 500 ,1000 ,2000 ,3000 ,4000 ,5000 ,6000, 7000, 8000, 9000, 10000,
    15000, 20000, 25000, 30000 ,35000, 40000 ,45000, 50000 ,55000, 60000 ,65000,
    70000, 75000, 80000, 85000 ,90000 ,95000 ,100000 ,200000 ,300000 ,400000,
    500000, 600000 ,700000, 800000, 900000, 1000000];
    
function init() {
    const sliders = document.getElementsByClassName("tick-slider-input");

    for (let slider of sliders) {
        slider.oninput = onSliderInput;

        updateValue(slider);
        updateValuePosition(slider);
        updateLabels(slider);
        updateProgress(slider);

        setTicks(slider);
    }
}

function onSliderInput(event) {
    updateValue(event.target);
    updateValuePosition(event.target);
    updateLabels(event.target);
    updateProgress(event.target);
}

function updateValue(slider) {

    let value = document.getElementById(slider.dataset.valueId);
    value.innerHTML = "<div>" + priceStyle(selectPredNum[slider.value-1], 3)+ "</div>";

//    if (startPredFlag == false){
//        startPredFlag = true;
//    } else {
        if(predFlag == false){
            predFlag = true;
        }
        else {
            selectedPredNum = selectPredNum[slider.value-1];
            var prediction_text = document.getElementsByClassName('prediction_text')[0];
            prediction_text.innerHTML = '평균 단가 <text id="pred_text_num" class="color">'+priceStyle(selectPredNum[slider.value-1], 3)+'원</text>으로';

            var lastBtn = document.getElementsByClassName('prediction_btn')[0];
            if(lastBtn == null){
                var summarySec = document.getElementsByClassName('summary_clear')[0];
                var prediction_btn = document.createElement('button');
                prediction_btn.className = 'prediction_btn';
                prediction_btn.onclick = pred_next_month_price;
                prediction_btn.innerHTML = '예측하기';
                summarySec.appendChild(prediction_btn);
            }
        }
//    }
}

function updateValuePosition(slider) {
    let value = document.getElementById(slider.dataset.valueId);

    const percent = getSliderPercent(slider);

    const sliderWidth = slider.getBoundingClientRect().width;
    const valueWidth = value.getBoundingClientRect().width;
    const handleSize = slider.dataset.handleSize;

    let left = percent * (sliderWidth - handleSize) + handleSize / 2 - valueWidth / 2;

    left = Math.min(left, sliderWidth - valueWidth);
    left = slider.value === slider.min ? 0 : left;

    value.style.left = left + "px";
}

function updateLabels(slider) {
    const value = document.getElementById(slider.dataset.valueId);
    const minLabel = document.getElementById(slider.dataset.minLabelId);
    const maxLabel = document.getElementById(slider.dataset.maxLabelId);

    const valueRect = value.getBoundingClientRect();
    const minLabelRect = minLabel.getBoundingClientRect();
    const maxLabelRect = maxLabel.getBoundingClientRect();

    const minLabelDelta = valueRect.left - (minLabelRect.left);
    const maxLabelDelta = maxLabelRect.left - valueRect.left;

    const deltaThreshold = 32;

    if (minLabelDelta < deltaThreshold) minLabel.classList.add("hidden");
    else minLabel.classList.remove("hidden");

    if (maxLabelDelta < deltaThreshold) maxLabel.classList.add("hidden");
    else maxLabel.classList.remove("hidden");
}

function updateProgress(slider) {
    let progress = document.getElementById(slider.dataset.progressId);
    const percent = getSliderPercent(slider);
    progress.style.width = percent * 100 + "%";
}

function getSliderPercent(slider) {
    const range = slider.max - slider.min;
    const absValue = slider.value - slider.min;

    return absValue / range;
}

function setTicks(slider) {
    let container = document.getElementById(slider.dataset.tickId);
    const spacing = parseFloat(slider.dataset.tickStep);
    const sliderRange = slider.max - slider.min;
    const tickCount = sliderRange / spacing + 1; // +1 to account for 0

    for (let ii = 0; ii < tickCount; ii++) {
        let tick = document.createElement("span");

        tick.className = "tick-slider-tick";

        container.appendChild(tick);
    }
}

function onResize() {
    const sliders = document.getElementsByClassName("tick-slider-input");

    for (let slider of sliders) {
        updateValuePosition(slider);
    }
}

function pred_next_month_price(){

    if(selectedPredNum == null){
        window.alert('단가를 선택해 주세요');
    } else {
        var fadeDiv = document.getElementById('fadeDiv');
        var summaryTran = document.createElement('div');
        summaryTran.className = 'summary_translucent';

        var bouncing_loader = document.createElement('div');
        bouncing_loader.id = 'bouncing-loader';
        bouncing_loader.appendChild(document.createElement('div'));
        bouncing_loader.appendChild(document.createElement('div'));
        bouncing_loader.appendChild(document.createElement('div'));
        summaryTran.appendChild(bouncing_loader);
        fadeDiv.appendChild(summaryTran);

        selectedStore[5] = selectedPredNum;
        
        socket.emit("pred_next_monthly_gain", socket.id, 
        selectedStore[0], selectedStore[1], selectedStore[2], selectedStore[3], selectedStore[4], selectedStore[5], selectedStore[6], selectedStore[7]);
        
    }
}

window.onload = init;
window.addEventListener("resize", onResize);
// window.onload = initMap;
if(!flag[0]&&!flag[1] && !startFlag){
  console.log('not initMap');
  flag[1] = true;
  window.onload = startMarketData;
}