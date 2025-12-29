
/*
const API_URL_GET_CAST_LIST = "https://script.google.com/macros/s/AKfycbywI6J-Lno5D5galSKruU2yX8wRdl_d8piB1q_-s4bByo1iRNpbx3n6521OIQxqXMNWeQ/exec?action=getCastList";

async function LoadCastThumbListFromGas() {
    try {
        const response = await fetch(API_URL_GET_CAST_LIST);
        const data = await response.json();

        const container = document.getElementById('cast-list-container');
        if (!container) {
            console.error("要素id:cast-list-container が見つかりません");
            return;
        }

        // キャストのサムネ画像一覧を挿入
        container.insertAdjacentHTML('beforeend', data.map(cast => `
        <div class="cast-thumb">No.${cast.id}<br>${cast.name}</div>
    `).join(''));

        // ローディング表示を削除
        const loadingElem = document.getElementById('cast-thumb-loading');
        if (loadingElem) {
            loadingElem.remove();
        }
    } catch (e) {
        console.error("データの取得に失敗しました", e);
    }
}
LoadCastThumbListFromGas();
*/

async function LoadCastThumbList() {
    try {
        const response = await fetch('./json/gas_cast_list.json');
        const data = await response.json();

        const container = document.getElementById('cast-list-container');
        if (!container) {
            console.error("要素id:cast-list-container が見つかりません");
            return;
        }

        // キャストのサムネ画像一覧を挿入
        container.insertAdjacentHTML('beforeend', data.map(cast => `
        <div class="cast-thumb">No.${cast.id}<br>${cast.name}</div>
    `).join(''));

        // ローディング表示を削除
        const loadingElem = document.getElementById('cast-thumb-loading');
        if (loadingElem) {
            loadingElem.remove();
        }
    } catch (e) {
        console.error("データの取得に失敗しました", e);
    }
}
LoadCastThumbList()
