// import package
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = (module.exports = express());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const spawn = require('child_process').spawn;


// db Connection
var oracledb = require('oracledb');
// oracledb.initOracleClient({libDir : "/opt/oracle/instantclient_19_8"});
oracledb.autoCommit = true;
var dbConfig = require('./config/dbConfig');
var config = {
    user: dbConfig.user,
    password: dbConfig.password,
    connectString: dbConfig.connectString
};

// set Router
const indexRouter = require('./routes/index.js');
const shopRouter = require('./routes/shop.js');
const areaRouter = require('./routes/area.js');

// set View Engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use("/images", express.static(path.join(__dirname, "/views/images")));
app.use("/css", express.static(path.join(__dirname, "/views/css")));
app.use("/js", express.static(path.join(__dirname, "/views/js")));

// add use router
app.use("/", indexRouter);
app.use("/shop", shopRouter);
app.use("/area", areaRouter);

// set 404 error page
app.get((req, res) => {
    res.status(400);
    res.render("404page");
  });

// start server
let port = 8081;
const server = app.listen(port, () => {
    console.log(port+" 서버 실행");
});


// do Release
function doRelease(conn){

    conn.release(function (err) {
        if(err){
            console.error(err.message);
        }
    });
}



// 지도 실시간 정보 제공
const io = require("socket.io")(server);
io.sockets.on("connection", (socket) => {

    const req = socket.request;
    const ip = req.headers["x-forwarede-for"] || req.connection.remoteAddress;

    ///////////////////////// 1. 상점별 페이지

    // 업종 대분류 선택
    socket.on("select_job", (socket_id, job) => {
        
        oracledb.getConnection(
            config, function(err, conn){

                if (err){
                    console.error(err.message);
                    return;
                }
                
                    var query = 
                        "select shop_type_small, count(*) from price where shop_type_big = '"+job+"' "+ 
                        "group by shop_type_small order by shop_type_small";

                    
                    conn.execute(query, [] ,function(err, result){
                        if (err){
                            console.error(err.message);

                            doRelease(conn);
                            return;
                        }
                        //console.log(result.metaData); // 테이블 스키마
                        // console.log(result.rows.length); // 데이터
                        
                        num = result.rows.length;
                        
                        doRelease(conn);
                        
                        io.to(socket_id).emit("select_job_result", {
                            job_small: JSON.stringify(result.rows),
                        });

                        // Async, Promise적으로 처리 ///
                        

                    });
                

            }
        );

    });

    // 업종 세분류를 선택했을 경우
    socket.on("select_job_small", (socket_id, job_big, job_small) => {
        
        oracledb.getConnection(
            config, function(err, conn){

                if (err){
                    console.error(err.message);
                    return;
                }
                
                    var query = 

                    "select * from ("+
                    "select A.*, ROW_NUMBER() over (PARTITION BY longitude, latitude order by md desc) as rnk from "+
                    "(select MAX(DATE_) as md, shop_name, longitude, latitude, avg(monthly_gain) as avgm from ("+
                    "select DATE_, shop_name, longitude, latitude, sum(monthly_gain) as monthly_gain from price where shop_type_big = '"+job_big+"' and shop_type_small = '"+job_small+"' "+
                    "group by DATE_, shop_name, longitude, latitude) group by shop_name, longitude, latitude) A "+
                    ") where rnk = 1 and rownum <= 100";

                    
                    conn.execute(query, [] ,function(err, result){
                        if (err){
                            console.error(err.message);

                            doRelease(conn);
                            return;
                        }
                        
                        
                        doRelease(conn);
  
                        io.to(socket_id).emit("select_job_small_result", {
                            job: JSON.stringify(result.rows),
                        });

                    });
                

            }
        );

    });


    // 지역구 선택했을 경우
    socket.on("select_loc", (socket_id, gu) => {
        
        oracledb.getConnection(
            config, function(err, conn){

                if (err){
                    console.error(err.message);
                    return;
                }
                
                    var query = 
                        "select dong, count(*) from price where gu = '"+gu+"' group by dong order by dong";

                    
                    conn.execute(query, [] ,function(err, result){
                        if (err){
                            console.error(err.message);

                            doRelease(conn);
                            return;
                        }
                        
                        num = result.rows.length;
                        
                        doRelease(conn);

                        io.to(socket_id).emit("select_loc_result", {
                            dong: JSON.stringify(result.rows),
                        });

                    });
                

            }
        );

    });


    // 지역 동 선택했을 경우
    socket.on("select_loc_small", (socket_id, gu, dong) => {
        
        oracledb.getConnection(
            config, function(err, conn){

                if (err){
                    console.error(err.message);
                    return;
                }
                
                    var query = 
                    "select * from ("+
                    "select A.*, ROW_NUMBER() over (PARTITION BY longitude, latitude order by md desc) as rnk from "+
                    "(select MAX(DATE_) as md, shop_name, longitude, latitude, avg(monthly_gain) as avgm from ("+
                    "select DATE_, shop_name, longitude, latitude, sum(monthly_gain) as monthly_gain from price where GU = '"+gu+"' and DONG = '"+dong+"' "+
                    "group by DATE_, shop_name, longitude, latitude) group by shop_name, longitude, latitude) A "+
                    ") where rnk = 1";

                    conn.execute(query, [] ,function(err, result){
                        if (err){
                            console.error(err.message);

                            doRelease(conn);
                            return;
                        }
                        
                        doRelease(conn);
                        
                        io.to(socket_id).emit("select_loc_small_result", {
                            gu: gu,
                            dong: dong,
                            sr: JSON.stringify(result.rows),
                        });

                    });
                

            }
        );

    });

    // 지역(동, 구) + 업종(대, 소) 선택했을 경우

    socket.on("select_job_loc_small", (socket_id, gu, dong, job_big, job_small) => {
        
        oracledb.getConnection(
            config, function(err, conn){

                if (err){
                    console.error(err.message);
                    return;
                }
                
                    var query = 
                    "select * from ("+
                    "select A.*, ROW_NUMBER() over (PARTITION BY longitude, latitude order by md desc) as rnk from "+
                    "(select MAX(DATE_) as md, shop_name, longitude, latitude, avg(monthly_gain) as avgm from ("+
                    "select DATE_, shop_name, longitude, latitude, sum(monthly_gain) as monthly_gain from price where shop_type_big = '"+job_big+"' and shop_type_small = '"+job_small+"' and GU = '"+gu+"' and DONG = '"+dong+"' "+
                    "group by DATE_, shop_name, longitude, latitude) group by shop_name, longitude, latitude) A "+
                    ") where rnk = 1";

                    conn.execute(query, [] ,function(err, result){
                        if (err){
                            console.error(err.message);

                            doRelease(conn);
                            return;
                        }
                        
                         doRelease(conn);
                        
                        io.to(socket_id).emit("select_job_loc_small_result", {
                            gu: gu,
                            dong: dong,
                            result: JSON.stringify(result.rows),
                        });


                    });
                

            }
        );

    });



    // 선택된 상점(핀)의 매출 정보를 불러올 경우
    socket.on("select_pin", (socket_id, shop_name, longitude, latitude, name, add, avg) => {
    
        oracledb.getConnection(
            config, function(err, conn){

                if (err){
                    console.error(err.message);
                    return;
                }

                    var query = 
                    "select * from ("+
                    "select DATE_, shop_name, shop_type_big, shop_type_small, gu, dong, longitude, latitude, "+
                    "SUM(monthly_gain) over (partition by DATE_), AVG(average_sale_price) over(partition by DATE_) aa, ROW_NUMBER() over (partition by DATE_ order by DATE_) as rn from ("+
                    "select DATE_, shop_name, shop_type_big, shop_type_small, gu, dong, longitude, latitude, monthly_gain, average_sale_price, ROW_NUMBER() "+
                    "over (PARTITION BY shop_name, longitude, latitude order by DATE_ desc) as rnk from price "+
                    "where shop_name = '"+shop_name+"' and longitude = '"+longitude+"' and latitude = '"+latitude+"'))where rn = 1";


                    conn.execute(query, [] ,function(err, result){
                        if (err){
                            console.error(err.message);

                            doRelease(conn);
                            return;
                        }
                        
                        doRelease(conn);
                        
                        io.to(socket_id).emit("select_pin_result", {
                            info: JSON.stringify(result.rows),
                            name: name,
                            add: add,
                            avg: avg,
                        });
                    });
                

            }
        );

    });
    
    // 선택된 상점(핀)의 업종 코드 정보를 불러올 경우
    socket.on("select_marketcode", (socket_id, job_big, job_small, name, addr, avg, last_aa) => {
        
        oracledb.getConnection(
            config, function(err, conn){

                if (err){
                    console.error(err.message);
                    return;
                }

                    let query = 
                    "select shop_type_big, rn from ("+
                    "select shop_type_big, shop_type_small, ROW_NUMBER() over (PARTITION BY shop_type_big order by shop_type_small) as rn from "+
                    "(select shop_type_big, shop_type_small from price group by shop_type_big, shop_type_small order by shop_type_big, shop_type_small)"+
                    ") where shop_type_big = '"+job_big+"' and shop_type_small = '"+job_small+"'";
                    
                    conn.execute(query, [] ,function(err, result){
                        if (err){
                            console.error(err.message);

                            doRelease(conn);
                            return;
                        }
                        
                        doRelease(conn);
                        
                        io.to(socket_id).emit("select_marketcode_result", {
                            marketcode: JSON.stringify(result.rows),
                            name: name,
                            addr: addr,
                            avg: avg,
                            last_aa: last_aa,
                        });


                    });
                

            }
        );

    });

    // 선택된 지역구, 지역동의 지도위에 표시할 영역 정하기
    socket.on("select_polygon", (socket_id, gu, dong) => {
        
        oracledb.getConnection(
            config, function(err, conn){

                if (err){
                    console.error(err.message);
                    return;
                }

                    let query = 
                    "select latitude, longitude from polygon_detail where gu = '"+gu+"' and dong = '"+dong+"'";
                    //+" group by latitude, longitude";
                    
                    

                    conn.execute(query, [] ,function(err, result){
                        if (err){
                            console.error(err.message);

                            doRelease(conn);
                            return;
                        }
                        
                        doRelease(conn);
                        
                        io.to(socket_id).emit("select_polygon_result", {
                            polygon: JSON.stringify(result.rows),
                        });


                    });
                

            }
        );

    });

    // 다음달 매출 예측 (파이썬 실행)
    socket.on("pred_next_monthly_gain", (socket_id, shop_type_big, shop_type_small, latitude, 
        longitude, shop_name, average_sale_price, gu, dong) => {

        let num = 0;
        // console.log(shop_type_big+", "+shop_type_small+", "+latitude+", "+longitude+", "+shop_name+", "+average_sale_price+", "+gu+", "+dong);

        // 2. spawn을 통해 "python 파이썬파일.py" 명령어 실행
        const respy = spawn('python3', ['baseline.py', shop_type_big, shop_type_small, latitude, longitude, shop_name, average_sale_price, gu, dong]);
        // const respy = spawn('python3', ['test.py']);
        
        // 3. stdout의 'data'이벤트리스너로 실행결과를 받는다.
        respy.stdout.on('data', function(d) {
            var res = d.toString();
            num += 1;
            if(num == 3){
              res = res.split(' ');
              // console.log(res);
              io.to(socket_id).emit("pred_next_monthly_gain_result", {
                  data: res[0],
                  min : res[1],
                  max: res[2],
              });
            }
        });

    });
    

    ///////////////////////// 2. 지역별 페이지

    ///////////////// 매출 정보 불러오기 (선택한 구, 서울시)
    socket.on("area_sale_info", (socket_id, gu) => {
        
        oracledb.getConnection(
            config, function(err, conn){

                if (err){
                    console.error(err.message);
                    return;
                }

                    let query = 
                    "SELECT * from area_1 where gu = '"+gu+"' or gu = '서울시' order by rnk desc";

                    conn.execute(query, [] ,function(err, result){
                        if (err){
                            console.error(err.message);

                            doRelease(conn);
                            return;
                        }
                        
                        doRelease(conn);
                        
                        io.to(socket_id).emit("area_sale_info_result", {
                            data: JSON.stringify(result.rows),
                        });


                    });
                

            }
        );

    });

    ///////////////// 매출 비교, 월별 매출 불러오기 (선택한 구, 서울시)
    socket.on("area_sale_contrast", (socket_id, gu) => {
        
        oracledb.getConnection(
            config, function(err, conn){

                if (err){
                    console.error(err.message);
                    return;
                }

                    let query = 
                    "select * from area_3 where gu = '"+gu+"' or gu = '서울시'";

                    conn.execute(query, [] ,function(err, result){
                        if (err){
                            console.error(err.message);

                            doRelease(conn);
                            return;
                        }
                        
                        doRelease(conn);
                        
                        io.to(socket_id).emit("area_sale_contrast_result", {
                            data: JSON.stringify(result.rows),
                        });


                    });
                

            }
        );

    });

    ///////////////// 인기 업종 불러오기 (선택한 구의 업종별 순위)
    socket.on("area_best_shop_type", (socket_id, gu) => {
        
        oracledb.getConnection(
            config, function(err, conn){

                if (err){
                    console.error(err.message);
                    return;
                }

                    let query = 
                    "select rank, shop_type_big, count from area_2 where gu = '"+gu+"' order by rank asc";

                    conn.execute(query, [] ,function(err, result){
                        if (err){
                            console.error(err.message);

                            doRelease(conn);
                            return;
                        }
                        
                        doRelease(conn);
                        
                        io.to(socket_id).emit("area_best_shop_type_result", {
                            data: JSON.stringify(result.rows),
                        });


                    });
                

            }
        );

    });


    ///////////////// 인기 키워드 불러오기 (선택한 구)
    socket.on("area_best_keyword", (socket_id, gu) => {
        
        oracledb.getConnection(
            config, function(err, conn){

                if (err){
                    console.error(err.message);
                    return;
                }

                    let query = 
                    "select * from area_4_nlp where gu = '"+gu+"' order by count desc";

                    conn.execute(query, [] ,function(err, result){
                        if (err){
                            console.error(err.message);

                            doRelease(conn);
                            return;
                        }
                        
                        doRelease(conn);
                        
                        io.to(socket_id).emit("area_best_keyword_result", {
                            data: JSON.stringify(result.rows),
                        });


                    });
                

            }
        );

    });


    
    // 소켓 연결 해제
    socket.on("disconnect", () => {
        
    });

});
