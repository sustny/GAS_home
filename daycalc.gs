function daycalc() {
  var day =Moment.moment([2017,1,1]);
  //この日付をベースに仕様を確かめていく
  
  var day0 = day.clone().subtract(1,'days').format('YYYY/MM/DD');
  Logger.log(day0);
  //結果: 2017/01/31 ... 引き算する項目を"日"、引き算する値を"1"と指定すると日が1減る→わかる
  
  var day1 = day.clone().subtract(1,'months').format('YYYY/MM/DD');
  Logger.log(day1);
  //結果: 2017/01/01 ... 引き算する項目を"月"、引き算する値を"1"と指定すると変わらない→わからない
  
  var day2 = day.clone().subtract(2,'months').format('YYYY/MM/DD');
  Logger.log(day2);
  //結果: 2016/12/01 ... 引き算する項目を"月"、引き算する値を"2"と指定すると月が1減る→わかってきた
  
  var day3 = day.clone().subtract(0,'months').format('YYYY/MM/DD');
  Logger.log(day3);
  //結果: 2017/02/01 ... 引き算する項目を"月"、引き算する値を"0"と指定すると月が1増える→ですよね
  
  var day4 = day.clone().subtract(0,'years').format('YYYY/MM/DD');
  Logger.log(day4);
  //結果: 2017/02/01 ... 引き算する項目を"年"、引き算する値を"0"と指定すると月が1増える→おまえもか
  
  /* ----- 試しにnew Date()でもやってみよう ----- */
  var nday = new Date('2017/1/1');
  
  var nday1 = new Date(nday.getYear(), nday.getMonth(), nday.getDate());
  nday1 = Utilities.formatDate(nday1, 'JST', 'yyyy/MM/dd');
  Logger.log(nday1); //結果: 2017/01/01 →想定通りで安心
  
  var mday = new Date(day); //冒頭にMomentで作っておいた'2017/1/1'をnew Dateで取得してみる
  
  var mday1 = new Date(mday.getYear(), mday.getMonth(), mday.getDate());
  mday1 = Utilities.formatDate(mday1, 'JST', 'yyyy/MM/dd');
  Logger.log(mday1); //結果: 2017/02/01 →なんで！！！
  
  var day5 = Moment.moment(nday);
  day5 = day5.clone().subtract(0,'years').format('YYYY/MM/DD');
  Logger.log(day5);
  //結果: 2017/01/01 →new Date()で取得した日付をMoment()の引数にすると思ってたとおりに動く
  
  var day6 = Moment.moment(nday);
  day6 = day6.clone().subtract(1,'months').format('YYYY/MM/DD');
  Logger.log(day6);
  //結果: 2016/12/01 →同上
  
  var day7 = Moment.moment(nday);
  day7 = day7.clone().subtract(1,'days').format('YYYY/MM/DD');
  Logger.log(day7);
  //結果: 2016/12/31 →同上(この方法でやるのが一番混乱しなさそうですね)
}
