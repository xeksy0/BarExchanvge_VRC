import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { uploadToImgBB } from "./imgbb_api.js";

// --- Firebase設定 ---
const firebaseConfig = {
    apiKey: "AIzaSyAZrqpquiGtwOx0Diu4e-KvwVPJtDy7uQ8",
    authDomain: "barexchangevrc.firebaseapp.com",
    projectId: "barexchangevrc",
    storageBucket: "barexchangevrc.firebasestorage.app",
    messagingSenderId: "952975663628",
    appId: "1:952975663628:web:7e41dd93c9854eea1c4429",
    measurementId: "G-1KN16EK0H5"
};

// 内部で初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * キャストを新規登録する関数
 */
export async function registerNewCast(inputData) {
    try {
        // 1. 現在の最大IDを取得
        const querySnapshot = await getDocs(collection(db, "casts"));
        let maxId = 0;

        querySnapshot.forEach((doc) => {
            const idNumber = parseInt(doc.id, 10);
            if (!isNaN(idNumber) && idNumber > maxId) {
                maxId = idNumber;
            }
        });
        const newId = (maxId + 1).toString();

        
        // 2.画像が入力されていればimgbbにアップロードし、urlを取得
        let image_url_f = "";
        let image_url_m = "";
        const image_name_f = `cast-thumb-f-no-${newId}`;
        const image_name_m = `cast-thumb-m-no-${newId}`;
        console.log("imagenames:", image_name_f, image_name_m);
        if (inputData.cast_image_f) {
            image_url_f = await uploadToImgBB(inputData.cast_image_f, image_name_f);
        }
        if (inputData.cast_image_m) {
            image_url_m = await uploadToImgBB(inputData.cast_image_m, image_name_m);
        }

        // activeフィールドを日本語から値に変換
        let active_status = false;
        if (inputData.active === "在籍") {
            // 現役キャストの場合
            active_status = true;
        } else if (inputData.active === "卒業") {
            // 卒業済みの場合
            active_status = false;
        } else {
            // 想定外のステータスが来た場合のデフォルト値
            active_status = false;
        }

        // 3. Firestoreへの書き込み
        const castRef = doc(db, "casts", newId);
        const firestoreData = {
            name: inputData.name,
            active: active_status,
            vrc_id: inputData.vrc_id,
            twitter_id: inputData.twitter_id,
            discord_id: inputData.discord_id,
            image_url_f: image_url_f,
            image_url_m: image_url_m,
            catchphrase: inputData.catchphrase,
            self_introduction: inputData.self_introduction
        };
        await setDoc(castRef, firestoreData);

        // 4. GASへのアクション要求(キャスト一覧の更新)
        const gasUrl = "https://script.google.com/macros/s/AKfycbxxpz_VE9j88HfjBa91L1yvRjPo7ruiSbuSsnzUUXAfVqnXF6raD3azvM7TXqB7-YUncg/exec";

        // 完了を待たずに送信（バックグラウンド処理）
        fetch(`${gasUrl}?mode=casts`, {
            method: "POST",
            mode: "no-cors"
        });

        return newId; // 成功したら新しいIDを返す

    } catch (e) {
        console.error("登録エラー:", e);
        return null; // 失敗したらnullを返す
    }
}

/* キャスト一覧を取得してindex.html二表示する関数 */
export async function fetchCastList(showInactive = false) {
    try {
        const querySnapshot = await getDocs(collection(db, "casts"));
        const container = document.getElementById('cast-list-container');
        if (!container) {
            console.error("要素id:cast-list-container が見つかりません");
            return;
        }
        // キャスト一覧をid昇順にソート
        const sortedDocs = querySnapshot.docs.sort((a, b) => {
            return parseInt(a.id, 10) - parseInt(b.id, 10);
        });

        // キャストのサムネ画像一覧を挿入
        sortedDocs.forEach((doc) => {
            const cast = doc.data();
            // キャストの女性画像またはNoと名前を表示する
            // マウスオーバーすると男性画像に切り替わる
            if (cast.active || showInactive) {
                const castElem = document.createElement('div');
                castElem.className = 'cast-thumb';
                castElem.innerHTML = `
                    <img src="${cast.image_url_f || 'https://via.placeholder.com/150?text=No+Image'}" 
                         alt="${cast.name}"
                            onmouseover="this.src='${cast.image_url_m || (cast.image_url_f || 'https://via.placeholder.com/150?text=No+Image')}'"
                            onmouseout="this.src='${cast.image_url_f || 'https://via.placeholder.com/150?text=No+Image'}'">
                `;
                container.appendChild(castElem);
            } else {
                container.insertAdjacentHTML('beforeend', `<!-- キャストID:${doc.id} ${cast.name} は非表示 -->
            `);
            }
        });
        
        // ローディング表示を削除
        const loadingElem = document.getElementById('cast-thumb-loading');
        if (loadingElem) {
            loadingElem.remove();
        }
    } catch (e) {
        console.error("データの取得に失敗しました", e);
    }
}