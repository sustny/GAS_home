//
// SpendNotify.gs
// Created on 2017-06-27 16:15
// Created by sustny(http://sustny.me/)
//

/* ------------------------------------ Imported Library ------------------------------------ */
// OAuth: 1CXDCY5sqT9ph64fFwSzVtXnbjpSfWdRymafDrtIZ7Z_hwysTY7IIhi7s
// Moment: MHMchiX6c1bwSqGM1PZiW_PxhMjh3Sh48
/* ------------------------------------ Imported Library ------------------------------------ */

/* ---------------------------------------- Utility ---------------------------------------- */
/* ----- Today ----- */
var year = Utilities.formatDate(new Date(), 'JST', 'yyyy');
var month = Utilities.formatDate(new Date(), 'JST', 'M');
var day = Utilities.formatDate(new Date(), 'JST', 'd');
var today = Utilities.formatDate(new Date(year, month-1, day), 'JST', 'yyyy/MM/dd');
/* ----- Today ----- */

/* ----- Yesterday ----- */
var m1 = new Date();
m1.setDate(m1.getDate() - 1);
var m1year = Utilities.formatDate(m1, 'JST', 'yyyy');
var m1month = Utilities.formatDate(m1, 'JST', 'M');
var m1day = Utilities.formatDate(m1, 'JST', 'd');
m1 = Utilities.formatDate(new Date(m1year, m1month-1, m1day), 'JST', 'yyyy/MM/dd');
/* ----- Yesterday ----- */

/* ----- 2 days ago ----- */
var m2 = new Date();
m2.setDate(m2.getDate() - 2);
var m2year = Utilities.formatDate(m2, 'JST', 'yyyy');
var m2month = Utilities.formatDate(m2, 'JST', 'M');
var m2day = Utilities.formatDate(m2, 'JST', 'd');
m2 = Utilities.formatDate(new Date(m2year, m2month-1, m2day), 'JST', 'yyyy/MM/dd');
/* ----- 2 days ago ----- */

/* ----- last month ----- */
var Month_m1 = Moment.moment([year, month-2, 1]);
if(month == 1) {
  Month_m1 = Moment.moment([year-1, 11, 1]);
}
Month_m1 = Month_m1.format('YYYY/M/D');
/* ----- last month ----- */

/* ----- 2 months ago ----- */
var Month_m2 = Moment.moment([year, month-3, 1]);
if(month == 1) {
  Month_m2 = Moment.moment([year-1, 10, 1]);
} else if(month == 2) {
  Month_m2 = Moment.moment([year-1, 11, 1]);
}
Month_m2 = Month_m2.format('YYYY/M/D');
/* ----- 2 months ago ----- */

/* ----- season ----- */
var season = year;
if(month < 4) {
  season -= 1;
}
/* ----- season ----- */

var FILE = SpreadsheetApp.openById('1oaKob_ycQ49URUd0ox78jrH5-_3ZCiXdDp2IBKdl8SE');
var SHEET = FILE.getSheetByName(String(season));
var DAT = SHEET.getDataRange().getValues();
/* ---------------------------------------- Utility ---------------------------------------- */

function Separate(num) {
    return String(num).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

function DailySpend(d) {
  /* ----- 開始行の検索 ----- */
  for(var i=1;i<DAT.length;i++) {
    var target = Utilities.formatDate(DAT[i][1], 'JST', 'yyyy/MM/dd');
    if(target == d) {
      var sRow = i; //対象開始行
      break;
    }
  }
  /* ----- 開始行の検索 ----- */
  /* ----- 計算 ----- */
  var money = [0, 0, 0, 0, 0, 0]; //クソダサ初期化
  for(i=sRow;i<DAT.length;i++) {
    target = Utilities.formatDate(DAT[i][1], 'JST', 'yyyy/MM/dd');
    if(target != d) { break; }
    
    for(var j=0;j<6;j++) {
      if(DAT[i][2] == DAT[2][j+7]) {
        money[j] += DAT[i][4];
      }
    }
  }
  /* ----- 計算 ----- */
  return money;
}

function MonthlySpend() {
  var start = Utilities.formatDate(new Date(year,month-2,1), 'JST', 'yyyy/MM/dd'); //Test code
  var end = Utilities.formatDate(new Date(year,month-1,1), 'JST', 'yyyy/MM/dd'); //Test code
  /* ----- 開始行の検索 ----- */
  for(var i=1;i<DAT.length;i++) {
    var target = Utilities.formatDate(DAT[i][1], 'JST', 'yyyy/MM/dd');
    if(target >= start) {
      var sRow = i; //対象開始行
      break;
    }
  }
  /* ----- 開始行の検索 ----- */
  
  /* ----- 終了行の検索 ----- */
  for(var i=sRow;i<DAT.length;i++) {
    var target = Utilities.formatDate(DAT[i][1], 'JST', 'yyyy/MM/dd');
    if(target >= end) {
      var eRow = i-1; //対象最終行
      break;
    }
  }
  /* ----- 終了行の検索 ----- */
  
  /* ----- 計算 ----- */
  var money = [0, 0, 0, 0, 0, 0]; //クソダサ初期化
  for(i=sRow;i<=eRow;i++) {
    for(var j=0;j<6;j++) {
      if(DAT[i][2] == DAT[2][j+7]) {
        money[j] += DAT[i][4];
      }
    }
  }
  /* ----- 計算 ----- */
  
  return money;
}

function SpendNotify_Test() {
  var monthSpend = MonthlySpend();
  Logger.log(monthSpend);
  
  var total = monthSpend.reduce(function(x, y) { return x + y; });
  
  Logger.log(Math.round(total));
  
  var m = Moment.moment('2016/1/8');
  Logger.log(m.format('YYYY/M/D'));
  
  Logger.log(Month_m1);
  Logger.log(Month_m2);
}

function SpendNotify() {
  var START = new Date();
  
  /* --- 日報 --- */
  var money1 = DailySpend(m1);
  var money2 = DailySpend(m2);
  
  var total1 = money1.reduce(function(x, y) { return x + y; }); //reduceで配列の全要素の合計を出す
  var total2 = money2.reduce(function(x, y) { return x + y; }); //同上
  var diff = Math.round(total1 - total2);
  
  var message = '[自動送信]昨日の支出: ' + Separate(total1) + '円';
  if(diff > 0) {
    message += '(おとといより' + Separate(Math.abs(diff)) + '円増加)';
  } else if(diff < 0) {
    message += '(おとといより' + Separate(Math.abs(diff)) + '円節約)';
  } else {
    message += '(おとといと同額)';
  }
  
  message += '\n【内訳】';
  for(var i=0;i<6;i++) {
    if(money1[i] != 0) {
      if(i != 0) { message += ' / '; }
      message += DAT[2][i+7] + ': ' + Separate(Math.round(money1[i])) + '円';
    }
  }
  message += ' #sustny_memo';
  
  if(total1 == 0) {
    return 0;
  }
  Twitter(message);
  /* --- 日報 --- */
  
  /* --- 月報 --- */
  if(day == 1) { //毎月1日のみ実行
    //この辺を書いていくんだけど前月との比較をするかどうかが悩みどころ
  }
  /* --- 月報 --- */
  
  Logger.log('=== SCORE : ' + (new Date() - START)/1000 + ' (sec) ===');
}
