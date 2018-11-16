// 1. ボタンがクリックされたときのイベントを追加
const button = document.getElementById("main");  // HTML中のボタン（id="main"）を検索
button.addEventListener("click", function () {
  // ユーザIDをテキストフィールド（id="userId"）から取得
  const nameId = document.getElementById("nameId").value;

  // ユーザ情報をGitHub APIから取得
  getUserInfo(nameId);
});

// 1. ここまで

// 2. GitHub APIにリクエストを送り、レスポンスを受け取る
function getUserInfo(nameId) {
  // XMLHttpRequest(XHR)オブジェクトの初期化
  const request = new XMLHttpRequest();

  // URLを組み立てて、リクエストを準備する（まだリクエストは未送信）
  const userIdEncoded = encodeURIComponent(nameId);  // URL用にエンコード
  const url = `https://connpass.com/api/v1/event/`;  // テンプレートリテラルを使用（バッククォートで囲む）、URLをGithubからconnpassに変更
  request.open("GET", url);

  // サーバからレスポンスが返ってきた場合の処理を登録
  request.addEventListener("load", function (event) {
    // エラーハンドリング：①HTTPステータスコードが「200 OK」以外の場合
    if (event.target.status !== 200) {
      console.log("Error: HTTPステータスが「200 OK」ではありません");
      console.log(`${event.target.status}: ${event.target.statusText}`);
      return;
    }

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

  // HTMLテキスト（DOM）を組み立てる
  // テンプレートリテラルを使用して、変数を埋め込む（注意：バッククォートを使う！）
  const view = `
        <h4>${userInfo.name} (@${userInfo.login})</h4>
        <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
        <dl>
            <dt>場所</dt>
            <dd>${userInfo.location}</dd>
            <dt>リポジトリ数</dt>
            <dd>${userInfo.public_repos}</dd>
        </dl>
        `;

  // 追加先の<div id="result">を検索
  const result = document.getElementById("result");

  // HTMLテキスト（DOM）を<div id="result">の下に追加
  result.innerHTML = view;
}

// 3. ここまで
