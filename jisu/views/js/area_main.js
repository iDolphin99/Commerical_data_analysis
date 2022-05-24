let socket = io.connect();
var lastGu = null;

start_data = start_data.replaceAll('&#34;', '\"');
start_data = JSON.parse(start_data);

let area_1 = [['', '구', '서울'], ['평균\n(만)', 0, 0], ['최대\n(억)', 0, 0]];
let area_2 = [['Month', '서울', '구'], ['', 0, 0]];
let area_3 = [['shop_type', 'count'], ['업종', 100]];
let area3_sum = 0, area3_other = 0;
let area_4 = []
let area4_max = 0;

///////////////// 반올림 함수
function roundXL(n, digits) {
    if (digits >= 0) return parseFloat(n.toFixed(digits)); // 소수부 반올림
  
    digits = Math.pow(10, digits); // 정수부 반올림
    var t = Math.round(n * digits) / digits;
  
    return parseFloat(t.toFixed(0));
}

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
                result = res+"억";
            } else {
                result = res.substring(0,4)+"억";
            }

        } else {
            result = th.toString()+"만";
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

function sale_info(data){
    
    var sale_info_rank = document.getElementById('sale_info_rank');
    var sale_info_avg = document.getElementById('sale_info_avg');
    var sale_info_max = document.getElementById('sale_info_max');
    var area_cal = document.getElementsByClassName('area_cal')[0];

    if(document.getElementById('sale_info_avg_text') != null){
        sale_info_avg.removeChild(document.getElementById('sale_info_avg_text'));
        sale_info_max.removeChild(document.getElementById('sale_info_max_text'));
        sale_info_rank.removeChild(document.getElementById('sale_info_rank_text'));
        area_cal.removeChild(document.getElementById('sale_info_count'));
    }

    var sale_info_rank_text = document.createElement('text');
    var sale_info_avg_text = document.createElement('text');
    var sale_info_max_text = document.createElement('text');
    var sale_info_count_text = document.createElement('text');


    sale_info_rank_text.id = 'sale_info_rank_text';
    sale_info_avg_text.id = 'sale_info_avg_text';
    sale_info_max_text.id = 'sale_info_max_text';
    sale_info_count_text.id = 'sale_info_count';

    /*    
    sale_info_rank_text.className = 'fade-in-box-two';
    sale_info_avg_text.className = 'fade-in-box-two';
    sale_info_max_text.className = 'fade-in-box-two';
    */

    sale_info_rank_text.innerText = data[0][0]+"위";
    sale_info_avg_text.innerText = priceStyle(roundXL(data[0][1]/10000, 0), 1);
    sale_info_max_text.innerText = priceStyle(roundXL(data[0][2]/10000, 0), 1);
    sale_info_count_text.innerText = "(총 "+data[0][3]+"개의 데이터)";

    sale_info_rank.appendChild(sale_info_rank_text);
    sale_info_avg.appendChild(sale_info_avg_text);
    sale_info_max.appendChild(sale_info_max_text);
    area_cal.appendChild(sale_info_count_text);

    $('#sale_info_rank_text').slideDown(1000);
    $('#sale_info_avg_text').slideDown(1000);
    $('#sale_info_max_text').slideDown(1000);

    
}

google.charts.load('current', {'packages':['bar', 'corechart']});
google.charts.load('visualization', '1.0', {'packages':['bar', 'corechart']});
let options_bar = null;
let chart_bar = null;
    // 평균, 최대 매출 비교
    google.charts.setOnLoadCallback(startBar);
      function startBar() {

        options_bar = {

            bars: 'horizontal',
            backgroundColor: {
                opacity: 100,
                fill:'transparent',
            },
            width: 277,
            height:155,
            isStacked: false,
            legend : {
                position : 'none',
            },
            axes: {
                x: {
                    0: { side: 'top'}, // Top x-axis.
                  }
              },
                
                hAxis: {

                },
                vAxis: {
                
                },
                    
                series: {
                0: { color: '#318688',},
                1: { color: '#95cdc8',}
                },
                        
                bar: { groupWidth: '75%' , rx:10, ry:10},
                  animation: {
                    startup: true,
                    duration: 1000,
                    easing: 'linear' },
    
        };

      chart_bar = new google.visualization.BarChart(document.getElementById('dual_x_div'));
      drawBar();

    };

    function drawBar(){
        var data = new google.visualization.arrayToDataTable(area_1);
        google.visualization.events.addListener(chart_bar, 'ready', 
        function() {

        });
        chart_bar.draw(data, options_bar);
    }

    // 월별 매출 비교
    let options_curve = null;
    let chart_curve = null;
    google.charts.setOnLoadCallback(startCurve);
    function startCurve() {

      options_curve = {
        curveType: 'function',
        legend: { position: 'none' },

        animation: {
            startup: true,
            duration: 1000,
            easing: 'out' },

        'width':284.5,
        'height':177,
        backgroundColor: { fill:'transparent' },
        series: {
            0: { color: '#95cdc8', lineWidth: 1.5, pointSize:1.5, },
            1: { color: '#318688', lineWidth: 1.5, pointSize:1.5,}
          },
	
      };

      chart_curve = new google.visualization.LineChart(document.getElementById('curve_chart'));
      drawCurve();
    }

    function drawCurve(){

        var data = new google.visualization.arrayToDataTable(area_2);
        google.visualization.events.addListener(chart_curve, 'ready', 
        function() {

        });
        var legend_gu = document.getElementById('this_gu_text');
        legend_gu.innerHTML = area_2[0][2];
        chart_curve.draw(data, options_curve);
    }

    // 인기 업종
    function anyPie(data = null){
        var piechartarea = document.getElementById('anypiechartarea');
        if (document.getElementById('anypiechart') != null){
            piechartarea.removeChild(document.getElementById('anypiechart'));
            var newDiv = document.createElement('div');
            newDiv.id = 'anypiechart';
            piechartarea.appendChild(newDiv);
        }

        if (data == null){
            data = [
                {x: "음식-미분류", 
                value: 3000, 
                normal : {
                    fill:'#318688'
                }},
    
                {x: "한식", 
                value: 2500,
                normal : {
                    fill:'#95cdc8'
                }},
    
                {x: "유흥주점", value: 2000,
                normal : {
                fill : '#d9eae1'
                }},
    
                {x: "Other", value: 5000,
                normal : {
                    fill : '#cccccc'
                },
                hovered: {
                    fill: "#cccccc",
                    outline: {
                       enabled: false
                    }
                  },
                  selected: {outline: {enabled: false}}
                },
              ];
        }

          // create a chart and set the data
          chart = anychart.pie(data);
          chart.selected().explode("2%");
          chart.select([0, 1, 2]);


          var legend = chart.legend();
          var legendItems = [];

          for (var i = 0; i < data.length; i++) {
            var series = data[i];
            legendItems.push({
              index: i,
              text: series.x,
              iconType: "circle",
              iconFill: series.normal.fill,
            });
          }

          legend.itemsSpacing(8);
          legend.iconSize(10);
          legend.fontSize(10);
          legend.fontWeight('lighter');
          legend.fontColor('#000000');
          legend.fontFamily('Noto Sans KR');
          legend.items(legendItems);

          // set the container id


          chart.container("anypiechart");
          chart.animation({enabled: true, duration: 1000});

          chart.labels().fontFamily('Noto Sans KR');
          chart.labels().fontSize(10);
          chart.background().fill("#ffd54f 0.0");
          chart.radius('43%');
          chart.draw();
         
    }
    

/////// 인기 키워드
function anyKeyword(data){
    var wordarea = document.getElementsByClassName('word-area')[0];
    let wordmotion = document.getElementById('word-motion');
    let newDiv = null;
        if (document.getElementById('word-container') != null){
            wordmotion.removeChild(document.getElementById('word-container'));
            newDiv = document.createElement('div');
            newDiv.id = 'word-container'
            wordmotion.appendChild(newDiv);
    }

    var customColorScale = anychart.scales.ordinalColor();
    
    customColorScale.ranges([
      {less: area4_max*0.15},
      {from: area4_max*0.15, to: area4_max*0.4},
      {greater: area4_max*0.4}
    ]);
    
    customColorScale.colors(["#d9eae1", "#95cdc8", "#318688"]);
    
    var chart = anychart.tagCloud();
    chart.data(data, {mode: "by-word"}); 
    chart.angles([0]); 
    chart.animation({enabled: true, duration: 1000});
    
    chart.colorScale(customColorScale);
    
    // chart.angles([-90, 0, 0, 90]);
    chart.angles([0]);
    chart.mode("spiral");
    chart.container("word-container");
    chart.draw();

    wordmotion = document.getElementById('word-motion');
    wordarea.removeChild(wordmotion);
    wordmotion = document.createElement('div');
    wordmotion.id = 'word-motion';

    hidedivmotion = document.createElement('div');
    hidedivmotion.id = 'hide-label-motion';

    wordmotion.appendChild(newDiv);
    wordmotion.appendChild(hidedivmotion);

    wordarea.appendChild(wordmotion);

    
}


function test(id){
    // show selected gu
    if(lastGu == null){
        lastGu = document.getElementById('중구');
    }
    if(lastGu != null) {
        lastGu.classList.remove('gu_selected');
        lastGu.classList.add('gu');
    }
    var currGu = document.getElementById(id);
    currGu.classList.remove('gu');
    currGu.classList.add('gu_selected');
    lastGu = currGu;

    socket.emit("area_sale_info", socket.id, id);   // 매출 정보 (선택한구, 서울시)
    socket.emit("area_sale_contrast", socket.id, id);   // 매출 비교, 월별 매출 (선택한구, 서울시)
    socket.emit("area_best_shop_type", socket.id, id);  // 선택한 구의 업종 순위 (인기)
    socket.emit("area_best_keyword", socket.id, id);
    
}


///////////////// 매출 정보 불러오기 (선택한 구, 서울시)
socket.on("area_sale_info_result", function(data){
    
    var result = JSON.parse(`${data.data}`);
    drawSaleInfo(result);
});

///////////////// 매출 비교, 월별 매출 불러오기 (선택한 구, 서울시)
socket.on("area_sale_contrast_result", function(data){
    var result = JSON.parse(`${data.data}`);
    drawSaleCompare(result);
});

///////////////// 인기 업종 불러오기 (선택한 구의 업종별 순위)
socket.on("area_best_shop_type_result", function(data){
    var result = JSON.parse(`${data.data}`);
    drawBestShopType(result);
});

///////////////// 인기 키워드 불러오기 (선택한 구)
socket.on("area_best_keyword_result", function(data){
    var result = JSON.parse(`${data.data}`);
    drawBestKeyword(result);
});

function drawSaleInfo(data){
    area_1 = [
        ['', data[0][4], '서울'],
        ['평균\n(만)', roundXL(data[0][1]/10000, 0), roundXL(data[1][1]/10000, 0)],
        ['최대\n(억)', roundXL(data[0][2]/100000000, 0), roundXL(data[1][2]/100000000, 0)]
    ];
    sale_info(data);
    drawBar();
}

function drawSaleCompare(data){
    area_2 = [];
    for(var i = 0; i < data.length/2 + 1; i++){

        if(i == 0){
            area_2[i] = ['Month', '서울', data[0][0]];
        } else {
            let str = data[i-1][1];

            area_2[i] = [
                str.substring(2,4)+"/"+str.substring(4,6), 
                roundXL(data[(i-1)+(data.length/2)][2]/10000, 0), 
                roundXL(data[i-1][2]/10000, 0)
            ];
        }
    }
    drawCurve();
}

function drawBestShopType(data){
    area_3 = [];
    area3_sum = 0;
    area3_other = 0;
    area3_top3_sum = 0;

    for(var i = 0; i < data.length + 1; i++){

        if(i == 0){
            area_3[i] = ['shop_type', 'count'];
        } else {
            if (data[i-1][2] != 0){
                if(i>=1 && i<=3){
                    area_3[i] = [data[i-1][1], data[i-1][2]];
                    area3_top3_sum += data[i-1][2];
                }
                area3_sum += data[i-1][2];
            }
        } 
    }

    area3_other = area3_sum - area3_top3_sum;
    if (area3_other != 0){
        area_3[area_3.length] = ['other', area3_other];
    }

    let insertData = [];
    var data_color = ['#318688', '#95cdc8', '#d9eae1', '#cccccc'];

    for(var i=1; i<area_3.length;i++){
    
        insertData[i-1] = {
            x: area_3[i][0],
            value: area_3[i][1],
            normal : {fill: data_color[i-1]}
        };

        if (i == area_3.length-1 && area3_other != 0){
            insertData[i-1] = {
                x: area_3[i][0],
                value: area_3[i][1],
                normal : {fill: data_color[i-1]},
                hovered: {
                    fill: data_color[i-1],
                    outline: {enabled: false}
                },
                selected: {outline: {enabled: false}}
            };
        }
    }
    anyPie(insertData);
}

function drawBestKeyword(data){
    area_4 = [];
    for(var i = 0; i < data.length; i++){
        area_4[i] = {x: data[i][1], value:data[i][2]}
    }
    area4_max = data[0][2];
    anyKeyword(area_4);
}


// drawSaleCompare(start_data[2]);
// drawBestShopType(start_data[1]);
// drawBestKeyword(start_data[3]);

