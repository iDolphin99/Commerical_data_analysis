// import package
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");
const app = (module.exports = express());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var oracledb = require('oracledb');
oracledb.autoCommit = true;
var dbConfig = require('../config/dbConfig');
var config = {
    user: dbConfig.user,
    password: dbConfig.password,
    connectString: dbConfig.connectString
};

function doClose(conn){
    conn.close(function (err) {
        if(err){
            console.error(err.message);
        }
    });
}

app.get("/", function(req, res){

    let start_data = [];

    var query = [
        "SELECT * from area_1 where gu = '중구' or gu = '서울시' order by rnk desc",
        "select rank, shop_type_big, count from area_2 where gu = '중구' order by rank asc",
        "select * from area_3 where gu = '중구' or gu = '서울시'",
        "select * from area_4_nlp where gu = '중구' order by count desc"
    ];

    oracledb.getConnection(
        config, function(err, conn){
            if (err){
                console.error(err.message);
                return;
            }
            
            for(let i = 0; i < 4; i++){
                conn.execute(query[i], [] ,function(err, result){
                    if (err){
                        console.error(err.message);
                        doClose(conn);
                        return;
                    }
                    // Async, Promise적으로 처리 ///
                    start_data[i] = result.rows;

                    if(i==3){
                        doClose(conn);
                        res.render("area", {
                            start_data: JSON.stringify(start_data),
                        });
                    }

                });

            }
        }
    );            
});
