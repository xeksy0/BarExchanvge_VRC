export async function uploadToImgBB(file, customFileName) {
    const apiKey = '6d5930bc16dce6710d9e6e4e8a08c83c'; // ImgBBで無料取得するキー
    const formData = new FormData();
    formData.append('image', file, customFileName);

    // 1. ImgBBへアップロード
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    
    if (result.success) {
        // 2. アップロードされた画像のURLを返す
        return result.data.url;
    } else {
        throw new Error('アップロード失敗');
    }
}
