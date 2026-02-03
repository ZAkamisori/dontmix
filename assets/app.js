// --- Drawer (hamburger) ---
const menuBtn = document.getElementById("menuBtn");
const drawer = document.getElementById("drawer");
const menuClose = document.getElementById("menuClose");
const backdrop = document.getElementById("backdrop");

function openDrawer(){
  drawer.hidden = false;
  menuBtn.setAttribute("aria-expanded", "true");
  // フォーカスを閉じるボタンへ
  menuClose.focus();
}
function closeDrawer(){
  drawer.hidden = true;
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.focus();
}
menuBtn.addEventListener("click", () => {
  const expanded = menuBtn.getAttribute("aria-expanded") === "true";
  expanded ? closeDrawer() : openDrawer();
});
menuClose.addEventListener("click", closeDrawer);
backdrop.addEventListener("click", closeDrawer);
window.addEventListener("keydown", (e)=>{
  if(e.key === "Escape" && !drawer.hidden) closeDrawer();
});

// drawer内リンクを押したら閉じる
drawer.querySelectorAll("a").forEach(a=>{
  a.addEventListener("click", () => closeDrawer());
});

// submenuで特定カードへ“寄る”
drawer.querySelectorAll("[data-focus]").forEach(a=>{
  a.addEventListener("click", () => {
    const id = a.getAttribute("data-focus");
    // スクロール後、対象カードにフォーカス
    setTimeout(()=>{
      const target = document.querySelector(`[data-card="${id}"]`);
      if(target) target.focus({preventScroll:true});
    }, 250);
  });
});

// --- Collect (軽い収集要素) ---
const dailyCard = document.getElementById("dailyCard");
const getCardBtn = document.getElementById("getCard");
const showCollectionBtn = document.getElementById("showCollection");
const resetCollectionBtn = document.getElementById("resetCollection");
const collection = document.getElementById("collection");

const POOL = [
  "プレス工程", "溶接工程", "塗装工程", "組立工程", "検査工程", "出荷",
  "空力", "衝突安全", "電動化", "リサイクル", "デザインスケッチ", "マーケティング"
];

const KEY = "myCards_v1";

function loadCards(){
  try{
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  }catch{
    return [];
  }
}
function saveCards(cards){
  localStorage.setItem(KEY, JSON.stringify(cards));
}

function renderDaily(label){
  dailyCard.innerHTML = `
    <span>今日のカード：<strong>${label}</strong></span>
    <span style="color:#5b616a;font-weight:800;">GETしてコレクションへ</span>
  `;
}

function pickOne(){
  const idx = Math.floor(Math.random() * POOL.length);
  return POOL[idx];
}

function renderCollection(){
  const cards = loadCards();
  collection.innerHTML = cards.length
    ? cards.map(c => `<span class="pill">${c}</span>`).join("")
    : `<span class="pill">まだ0枚です</span>`;
}

function init(){
  renderDaily("…");
  const first = pickOne();
  renderDaily(first);
}
init();

getCardBtn.addEventListener("click", ()=>{
  const label = pickOne();
  renderDaily(label);

  const cards = loadCards();
  if(!cards.includes(label)) cards.push(label);
  saveCards(cards);

  // さりげなく見える化
  collection.hidden = false;
  renderCollection();
});

showCollectionBtn.addEventListener("click", ()=>{
  collection.hidden = !collection.hidden;
  if(!collection.hidden) renderCollection();
});

resetCollectionBtn.addEventListener("click", ()=>{
  localStorage.removeItem(KEY);
  collection.hidden = true;
  renderDaily(pickOne());
});
