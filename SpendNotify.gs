//
// SpendNotify.gs
// Created on 2017-06-27 16:15
// Created by sustny(http://sustny.me/)
//

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

var FILE = SpreadsheetApp.openById('1oaKob_ycQ49URUd0ox78jrH5-_3ZCiXdDp2IBKdl8SE');
if(month > 3) {
  var SHEET = FILE.getSheetByName(String(year));
} else {
  var SHEET = FILE.getSheetByName(String(year-1));
}
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
  var d = Utilities.formatDate(new Date(2017,month-2,1), 'JST', 'yyyy/MM/dd'); //Test code
  /* ----- 開始行の検索 ----- */
  for(var i=1;i<DAT.length;i++) {
    var target = Utilities.formatDate(DAT[i][1], 'JST', 'yyyy/MM/dd');
    if(target >= d) {
      var sRow = i; //対象開始行
      break;
    }
  }
  /* ----- 開始行の検索 ----- */
  
  /* ----- 計算 ----- */
  /* ----- 計算 ----- */
  
  return 0; //あとでなんか返させる
}

function SpendNotify() {
  var START = new Date();
  
  /* --- 家計簿 --- */
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
  /* --- 家計簿 --- */
  
  Logger.log('=== SCORE : ' + (new Date() - START)/1000 + ' (sec) ===');
}
