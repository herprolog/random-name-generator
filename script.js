
const nameData = {
  modern: {
    last: [
      "佐藤", "鈴木", "高橋", "田中", "伊藤",
      "渡辺", "山本", "中村", "小林", "加藤",
      "吉田", "山田", "佐々木", "山口", "松本",
      "井上", "木村", "林", "清水", "斎藤"
    ],
    first: [
      "陽翔", "蓮", "湊", "悠真", "樹",
      "陽菜", "凛", "結衣", "葵", "美月",
      "大和", "蒼", "莉子", "咲良", "結月",
      "悠", "楓", "光", "千尋", "優"
    ]
  },

  traditional: {
    last: [
      "藤原", "橘", "源", "平", "近衛",
      "一条", "九条", "西園寺", "徳川", "北条",
      "武田", "上杉", "毛利", "島津", "伊達"
    ],
    first: [
      "信長", "秀吉", "家康", "義経", "政宗",
      "小夜", "千代", "菊乃", "梅乃", "桜子",
      "宗一郎", "清正", "直政", "雪乃", "静"
    ]
  },

  neutral: {
    last: [
      "朝倉", "相沢", "水野", "神崎", "黒川",
      "白石", "藤堂", "桐谷", "成瀬", "早瀬",
      "篠原", "月島", "東雲", "結城", "七瀬"
    ],
    first: [
      "蒼", "凪", "光", "悠", "瑞希",
      "千尋", "泉", "薫", "遥", "真琴",
      "翼", "澪", "伊織", "律", "晶"
    ]
  },

  fantasy: {
    last: [
      "アストリア", "エルドラ", "ヴァレン",
      "グランツ", "ルミナス", "ノクターン",
      "フェルゼン", "アルカディア", "セレス",
      "ヴァルハイト", "ミストリア", "ドラグーン"
    ],
    first: [
      "アルト", "ルシア", "レオン", "エリア",
      "シオン", "リリア", "カイル", "セリア",
      "ノア", "フィリア", "クロード", "エル"
    ]
  }
};

let generatedNames = [];

const styleSelect = document.getElementById("style");
const countSelect = document.getElementById("count");
const nameList = document.getElementById("nameList");
const resultCount = document.getElementById("resultCount");
const toast = document.getElementById("toast");

// ランダムな要素を取得
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// 名前を生成
function generateNames() {
  const style = styleSelect.value;
  const count = Number(countSelect.value);
  const data = nameData[style];

  const names = new Set();

  // 重複しない名前を指定人数分生成
  while (names.size < count) {
    const lastName = randomItem(data.last);
    const firstName = randomItem(data.first);

    names.add(lastName + " " + firstName);
  }

  generatedNames = Array.from(names);

  displayNames();
}

// 生成結果を画面に表示
function displayNames() {
  nameList.innerHTML = "";

  resultCount.textContent = `${generatedNames.length}人`;

  generatedNames.forEach((name) => {
    const li = document.createElement("li");
    li.className = "name-item";

    const span = document.createElement("span");
    span.className = "name-text";
    span.textContent = name;

    const button = document.createElement("button");
    button.className = "copy-button";
    button.textContent = "コピー";

    button.addEventListener("click", () => {
      copyText(name);
    });

    li.appendChild(span);
    li.appendChild(button);

    nameList.appendChild(li);
  });
}

// クリップボードにコピー
async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";

      document.body.appendChild(textarea);
      textarea.select();

      const success = document.execCommand("copy");
      textarea.remove();

      if (!success) {
        throw new Error("コピーに失敗しました");
      }
    }

    showToast("コピーしました！");
  } catch (error) {
    showToast("コピーできませんでした。");
  }
}

// 全員分をコピー
function copyAll() {
  if (generatedNames.length === 0) {
    showToast("先に名前を生成してください。");
    return;
  }

  copyText(generatedNames.join("\n"));
}

// CSVファイルとして保存
function downloadCSV() {
  if (generatedNames.length === 0) {
    showToast("先に名前を生成してください。");
    return;
  }

  const rows = [
    ["名前"],
    ...generatedNames.map(name => [name])
  ];

  const csv = "\uFEFF" + rows
    .map(row => row.map(value =>
      `"${String(value).replace(/"/g, '""')}"`
    ).join(","))
    .join("\r\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "生成された名前.csv";

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);

  showToast("CSVを保存しました！");
}

// 通知を表示
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// ボタンのイベント設定
document.getElementById("generateButton")
  .addEventListener("click", generateNames);

document.getElementById("copyAllButton")
  .addEventListener("click", copyAll);

document.getElementById("csvButton")
  .addEventListener("click", downloadCSV);
