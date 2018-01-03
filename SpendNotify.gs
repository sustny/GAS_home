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
var Now = Moment.moment(); //Now

/* ----- Today's Date ----- */
var year = Now.format('YYYY');
var month = Now.format('M');
var day = Now.format('D');
/* ----- Today's Date ----- */

var today = Now.format('YYYY/MM/DD'); //Today
var Day_m1 = Now.clone().subtract(1,'days').format('YYYY/MM/DD'); //Yesterday
var Day_m2 = Now.clone().subtract(2,'days').format('YYYY/MM/DD'); //2 days ago

var sMonth = Moment.moment([year, month-1, 1]);
var sMonth_m1 = sMonth.clone().subtract(1,'months').format('YYYY/MM/DD'); //Begging the last month
var sMonth_m2 = sMonth.clone().subtract(2,'months').format('YYYY/MM/DD'); //Begging the 2 months ago
sMonth = sMonth.format('YYYY/MM/DD'); //Begging the this month

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
    var target = Moment.moment(DAT[i][1]).clone().format('YYYY/MM/DD');
    if(target == d) {
      var sRow = i; //対象開始行
      break;
    }
  }
  /* ----- 開始行の検索 ----- */
  /* ----- 計算 ----- */
  var money = [0, 0, 0, 0, 0, 0]; //クソダサ初期化
  for(i=sRow;i<DAT.length;i++) {
    target = Moment.moment(DAT[i][1]).clone().format('YYYY/MM/DD');
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

function MonthlySpend(start, end) {
  /* ----- 開始行の検索 ----- */
  for(var i=1;i<DAT.length;i++) {
    var target = Moment.moment(DAT[i][1]).clone().format('YYYY/MM/DD');
    if(target >= start) {
      var sRow = i; //対象開始行
      break;
    }
  }
  /* ----- 開始行の検索 ----- */
  
  /* ----- 終了行の検索 ----- */
  for(var i=sRow;i<DAT.length;i++) {
    target = Moment.moment(DAT[i][1]).clone().format('YYYY/MM/DD');
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

function SpendNotify() {
  /* --- 日報 --- */
  var money1 = DailySpend(Day_m1);
  var money2 = DailySpend(Day_m2);
  
  var total1 = money1.reduce(function(x, y) { return x + y; }); //reduceで配列の全要素の合計を出す
  var total2 = money2.reduce(function(x, y) { return x + y; }); //同上
  var diff = Math.round(total1 - total2);
  
  var message = '[日報]昨日の支出: ' + Separate(total1) + '円';
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
  
  if(total1 != 0) {
    Twitter(message);
  }
  /* --- 日報 --- */
  
  /* --- 月報 --- */
  if(day == 1) { //毎月1日のみ実行
    //1か月前
    money1 = MonthlySpend(sMonth_m1, sMonth);
    //2か月前
    money2 = MonthlySpend(sMonth_m2, sMonth_m1);
    
    total1 = money1.reduce(function(x, y) { return x + y; });
    total2 = money2.reduce(function(x, y) { return x + y; });
    diff = Math.round(total1 - total2);
    
    message = '[月報]先月の支出: ' + Separate(Math.round(total1)) + '円';
    
    if(diff > 0) {
      message += '(先々月より' + Separate(Math.abs(diff)) + '円増加)';
    } else if(diff < 0) {
      message += '(先々月より' + Separate(Math.abs(diff)) + '円節約)';
    } else {
      message += '(先々月と同額)';
    }
    message += '\n【内訳】';
    for(var i=0;i<6;i++) {
      if(money1[i] != 0) {
        if(i != 0) { message += ' / '; }
        message += DAT[2][i+7] + ': ' + Separate(Math.round(money1[i])) + '円';
      }
    }
    message += ' #sustny_memo';
    
    if(total1 != 0) {
      Mstdn(message);
    }
  }
  /* --- 月報 --- */
  
  Logger.log('=== SCORE : ' + (Moment.moment() - Now)/1000 + ' (sec) ===');
}
