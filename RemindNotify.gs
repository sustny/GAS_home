//
// RemindNotify.gs
// Created on 2017-07-11 16:15
// Created by sustny(http://sustny.me/)
//
// Referenced: http://qiita.com/gasakamaki/items/a2ef267a653741eaf569
//

function RemindNotify(){
  var address = '*** Googleアカウントのメールアドレス ***';
  var opt = new Object();
  opt.name = "今日の予定";//メールの送信名・・・特になくてもいい
  opt.cc = "*** 送信先メールアドレス ***";//CCの宛先(ここで携帯に送ってます）
  var events = CalendarApp.getEventsForDay(new Date());//処理当日の予定をeventsに格納
  var eventsText = '今日の予定は以下の通りです。'+'\n'+"------------------------------"+'\n';//本文TOP
  for(var i=0; i < events.length; i++){       //ループ処理　予定リストがなくなるまで
    var stime = Utilities.formatDate(events[i].getStartTime(), "JST", "HH:mm");//予定開始時間
    var etime = Utilities.formatDate(events[i].getEndTime(), "JST", "HH:mm");//予定終了時間
    eventsText += i+1+'件目：'+events[i].getTitle();
    eventsText += '\n' +" 時間："+ stime +"～"+etime;
    eventsText += '\n'+" 場所："+ events[i].getLocation();
    eventsText += '\n'+"------------------------------"+'\n';
  }
  opt.htmlBody = eventsText;//optに本文を格納
  //メール送信
  /*
  MailApp.sendEmail(address,//送信先アドレス
                                '今日のあなたの予定です',//件名
                                '',//本文は空
                                opt//送信オプション
       );  
       */
  
  Logger.log(eventsText);
  //リマインダーは取得できないぽい(泣いている)
  //今後どうしていくか思案中
}
