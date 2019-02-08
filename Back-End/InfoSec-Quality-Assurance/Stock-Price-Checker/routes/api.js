/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var rp = require('request-promise');
const mongoose = require('mongoose');
mongoose.connect(process.env.DB, { useMongoClient: true });

var Schema = mongoose.Schema;
var stockSchema = new Schema({
  ticker : {type: String, required: true},
  ips    : [String],
})                            
var Stock = mongoose.model('Stock', stockSchema)

module.exports = function (app) {
  app.enable('trust proxy');          ////////// for ip
  app.route('/api/stock-prices') 
    .get(function (req, res){ 
      if (!req.query.stock) {return res.json('Invalid input')}
      if (Array.isArray(req.query.stock)) {
        var stock1 = req.query.stock[0].toUpperCase();
        var stock2 = req.query.stock[1].toUpperCase();
      } else {
        var stock1 = req.query.stock.toUpperCase();
      }
      var ip = req.ip
      var like = req.query.like
      like === 'true' ? like = true : like = false;
      var api1 = "https://api.iextrading.com/1.0/stock/" + stock1 + "/price";
      var api2 = "https://api.iextrading.com/1.0/stock/" + stock2 + "/price";
      
      async function doRequests() {
        let response
        response = await rp(api1)
        var x = response 
        if (stock2 !== undefined) {
          response = await rp(api2)
          var y = response
        }                             
          Stock.findOne({ticker: stock1}, (err, db) => {                             /////////////////   DB below  ///////////////////
            var likes1, likes2;
            if (db) {                                                                   ////////// old stock (previously searched)
              if (like && !db.ips.includes(ip)) {                                       ////////// add ip (like)
                likes1 = db.ips.length +1;
                db.update({ $push: { ips: ip } }, (err, data) => { 
                  if (err) throw err
                });  
              } else { 
                likes1 = db.ips.length ;
              }
            } else { 														                                        ////////// add new stock
			        if (like) {	                                                              ////////// with ip
                likes1 = 1;
				        Stock.create({ ticker: stock1, ips: ip}, (err, data) => {
				          if (err) throw err
                });
			        } else {
                likes1 = 0;
                Stock.create({ ticker: stock1}, (err, data) => {                        ///////// add new stock
				          if (err) throw err
				        });
              }
            }            
            if (stock2 === undefined) {                                                 ///////// return 1 stock
              res.json({stockData:{stock:stock1,price:x,likes:likes1}})
            } else { 
              Stock.findOne({ticker: stock2}, (err, db) => {                           ////////// 2nd stock
                if (db) { 
                  if (like && !db.ips.includes(ip)) {  
                    likes2 = db.ips.length +1;
                    db.update({ $push: { ips: ip } }, (err, data) => { 
                      if (err) throw err
                    }); 
                  } else { 
                    likes2 = db.ips.length;
                  }
                } else { 
			            if (like) {	
				            likes2 = 1;
                    Stock.create({ ticker: stock2, ips: ip}, (err, data) => {
				              if (err) throw err
				            });
			            } else {
                    likes2 = 0;
                    Stock.create({ ticker: stock2}, (err, data) => {
				              if (err) throw err
				            });
                  }
                } 
                var rel1 = likes1-likes2, rel2 = likes2-likes1;
                res.json({stockData:[{stock:stock1,price:x,rel_likes:rel1},{stock:stock2,price:y,rel_likes:rel2}]})
              });
            }
          });
      }
      doRequests()
      .catch(err => res.json('Error'))   
    });
    
};
