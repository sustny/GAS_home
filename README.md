# GAS_home

## SpendNotify.gs

家計簿に入力された支出データを自身のTwitterへ毎朝9時過ぎに通知し、その日の節約意識を高めるプログラムです。

通知する情報は以下。

### 日報
1. 前日の合計使用金額
2. 前々日の合計使用金額との比較
3. 前日の使用金額の内訳

###月報(月初に実行される)
1. 前月の合計使用金額
2. 前々月の合計使用金額との比較
3. 前月の使用金額の内訳

最終的に、SpendNotify.gsで算出・記述した上記それぞれの情報をTwitter()という関数へ渡して通知を行います。

Twitter()関数は別ファイル(Twitter.gs)に記述していますが、ほぼネットからのコピペなのでGitHubには載せないでおきます。

ちなみにTwitterへの通知は、以下を参考にしました。

- http://yoshiyuki-hirano.hatenablog.jp/entry/2015/10/13/010317
- http://qiita.com/koba0124/items/82276dc0219ad015a7a1

## RemindNotify.gs

迷走中。

元々はGoogle Keepに追加したリマインダーの情報をTwitterに通知させる予定でしたが、KeepApp.getナントカ的なことができなかったのでどうすっかなあって感じ。
