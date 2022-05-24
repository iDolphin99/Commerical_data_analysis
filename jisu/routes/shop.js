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

    let start_data = '';
    var query = "select * from start_table_shop where rownum <= 500";

    oracledb.getConnection(
        config, function(err, conn){
    
            if (err){
                console.error(err.message);
                return;
            }
            
                    conn.execute(query, [] ,function(err, result){

                        if (err){
                            console.error(err.message);
                            doClose(conn);
                            return;
                        }
                        // Async, Promise적으로 처리 ///
                        start_data = result.rows;

                            doClose(conn);
                            res.render("shop", {
                                start_data: JSON.stringify(start_data),
                            });
                        });
            
    
        }
    );

});

// module.exports = router;