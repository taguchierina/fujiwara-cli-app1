
const endpoint = "https://connpass.com/api/v1/event/"

// 1. ボタンがクリックされたときのイベントを追加
const button = document.getElementById("main");  // HTML中のボタン（id="main"）を検索
button.addEventListener("click", function () {
  // ユーザIDをテキストフィールド（id="userId"）から取得
  const keyword = document.getElementById("keyword_or").value;

  // ユーザ情報をGitHub APIから取得
  keywordSearch(keyword)
});

// 1. ここまで

// 2. GitHub APIにリクエストを送り、レスポンスを受け取る
function keywordSearch(keyword) {
  // XMLHttpRequest(XHR)オブジェクトの初期化
  const request = new XMLHttpRequest();

  // URLを組み立てて、リクエストを準備する（まだリクエストは未送信）
  const keywordEncoded = encodeURIComponent(keyword);  // URL用にエンコード
  // const url = `https://connpass.com/api/v1/event/?keyword=${keywordEncoded}` ;  // テンプレートリテラルを使用（バッククォートで囲む）
  const url = `https://connpass.com/api/v1/event/?keyword=${keywordEncoded}`
  request.open("GET", url);

  // サーバからレスポンスが返ってきた場合の処理を登録
  request.addEventListener("load", function (event) {
    console.log(event)
    // エラーハンドリング：①HTTPステータスコードが「200 OK」以外の場合
    if (event.target.status !== 200) {
      console.log("Error: HTTPステータスが「200 OK」ではありません");
      console.log(`${event.target.status}: ${event.target.statusText}`);
      return;
    }
    // alert(event)
    // 正常時の処理：3. レスポンス（JSONテキスト）を加工し、DOMに追加する
    showUserInfo(event);
  });

  // エラーハンドリング：②サーバとの通信に際してエラーが発生した場合
  request.addEventListener("error", () => {
    console.error("Error: サーバとの通信に失敗しました");
  });

  // リクエストを実際に送信する
  request.send();
}

// 2. ここまで

// 3. レスポンス（JSONテキスト）を加工し、DOMに追加する
function showUserInfo(event) {

  // コンソールへの出力
  console.log(`HTTPステータスコード: ${event.target.status}`);
  console.log("返ってきたJSONテキスト:");
  console.log(event.target.responseText);

  // レスポンス（JSONテキスト）を、JSON.parseメソッドで連想配列（オブジェクト）に変換する
  const text_json = event.target.responseText;  // レスポンステキスト（JSON）
  const userInfo = JSON.parse(text_json);       // JSONテキストをJavaScriptのオブジェクトに変換

  //forぶんでかく
  // HTMLテキスト（DOM）を組み立てる
  // テンプレートリテラルを使用して、変数を埋め込む（注意：バッククォートを使う！）
  console.log(userInfo.events)
  let viewLog = ""
  for (let index = 0; index < userInfo.events.length; index++) {
    const element = userInfo.events[index];
    console.log(element.title)

    const view = `
          <h4>${element.title} (${element.event_id})</h4>
          <dl>
              <dt>場所</dt>
              <dd>${element.address}</dd>
              <dt>定員</dt>
              <dd>${element.limit}</dd>
              <dt>開催日時</dt>
              <dd>${element.started_at}</dd>
          </dl>
          `;
    viewLog = viewLog + view
  }
  // 追加先の<div id="result">を検索
  const result = document.getElementById("result");

  // HTMLテキスト（DOM）を<div id="result">の下に追加
  result.innerHTML = viewLog;
}

// 3. ここまで
