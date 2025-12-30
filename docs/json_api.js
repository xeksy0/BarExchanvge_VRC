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
