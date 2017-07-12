//
// SpendNotify.gs
// Created on 2017-06-27 16:15
// Created by sustny(http://sustny.me/)
//

/* ---------------------------------------- Utility ---------------------------------------- */
var TODAY = Utilities.formatDate(new Date(), 'JST', 'yyyy/MM/dd');

var DAYm1 = new Date(); //DAYm1 = (TO)DAYm(inus)1
DAYm1.setDate(DAYm1.getDate() - 1);
DAYm1 = Utilities.formatDate(DAYm1, 'JST', 'yyyy/MM/dd');

var DAYm2 = new Date();
DAYm2.setDate(DAYm2.getDate() - 2);
DAYm2 = Utilities.formatDate(DAYm2, 'JST', 'yyyy/MM/dd');

var YEAR = new Date();
YEAR.setDate(YEAR.getDate() - 1);
YEAR = parseInt(Utilities.formatDate(YEAR, 'JST', 'yyyy'));
if(YEAR < 4) { YEAR++; }

var FILE = SpreadsheetApp.openById('1oaKob_ycQ49URUd0ox78jrH5-_3ZCiXdDp2IBKdl8SE');
var SHEET = FILE.getSheetByName(String(YEAR));
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
  var money = new Object(); //オブジェクトの宣言
  money.cat1 = 0, money.cat2 = 0, money.cat3 = 0, money.cat4 = 0, money.cat5 = 0, money.cat6 = 0; //数値として初期化
  for(i=sRow;i<DAT.length;i++) {
    target = Utilities.formatDate(DAT[i][1], 'JST', 'yyyy/MM/dd');
    if(target != d) { break; }
    switch (DAT[i][2]) {
      case DAT[2][7]:
        money.cat1 += DAT[i][4];
        break;
      case DAT[2][8]:
        money.cat2 += DAT[i][4];
        break;
      case DAT[2][9]:
        money.cat3 += DAT[i][4];
        break;
      case DAT[2][10]:
        money.cat4 += DAT[i][4];
        break;
      case DAT[2][11]:
        money.cat5 += DAT[i][4];
        break;
      case DAT[2][12]:
        money.cat6 += DAT[i][4];
        break;
    }
  }
  /* ----- 計算 ----- */
  return money;
}

function SpendNotify() {
  var START = new Date();
  
  /* --- 家計簿 --- */
  var money1 = DailySpend(DAYm1);
  var money2 = DailySpend(DAYm2);
  var total1 = Math.round(money1.cat1 + money1.cat2 + money1.cat3 + money1.cat4 + money1.cat5 + money1.cat6); //ここもっと賢く計算できない？
  var total2 = Math.round(money2.cat1 + money2.cat2 + money2.cat3 + money2.cat4 + money2.cat5 + money2.cat6); //ここも
  var diff = Math.round(total1 - total2);
  
  var message = '[自動送信]昨日の支出: ' + Separate(total1) + '円';
  if(diff > 0) {
    message += '(おとといより' + Separate(Math.abs(diff)) + '円増加)';
  } else if(diff < 0) {
    message += '(おとといより' + Separate(Math.abs(diff)) + '円節約)';
  } else {
    message += '(おとといと同額)';
  }
  var i = 0;
  message += '\n【内訳】'
  //ここから下ももっと賢く書けるでしょ
  if(money1.cat1 != 0) {
    if(i != 0) { message += ' / ' };
    i++;
    message += DAT[2][7] + ': ' + Separate(Math.round(money1.cat1)) + '円';
  }
  if(money1.cat2 != 0) {
    if(i != 0) { message += ' / ' };
    i++;
    message += DAT[2][8] + ': ' + Separate(Math.round(money1.cat2)) + '円';
  }
  if(money1.cat3 != 0) {
    if(i != 0) { message += ' / ' };
    i++;
    message += DAT[2][9] + ': ' + Separate(Math.round(money1.cat3)) + '円';
  }
  if(money1.cat4 != 0) {
    if(i != 0) { message += ' / ' };
    i++;
    message += DAT[2][10] + ': ' + Separate(Math.round(money1.cat4)) + '円';
  }
  if(money1.cat5 != 0) {
    if(i != 0) { message += ' / ' };
    i++;
    message += DAT[2][11] + ': ' + Separate(Math.round(money1.cat5)) + '円';
  }
  if(money1.cat6 != 0) {
    if(i != 0) { message += ' / ' };
    i++;
    message += DAT[2][12] + ': ' + Separate(Math.round(money1.cat6)) + '円';
  }
  
  message += ' #sustny_memo';
  
  if(total1 == 0) {
    return 0;
  }
  Twitter(message);
  
  /* --- 家計簿 --- */
  
  Logger.log('=== SCORE : ' + (new Date() - START)/1000 + ' (sec) ===');
}
