
// 下载本地的东西
import axios from 'axios'

export const downloadfile = (url, name) => {
    fetch(url).then((res) => {
        res.blob().then((blob) => {
            const blobUrl = window.URL.createObjectURL(blob);
            const filename = name;
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `${ filename }.mp4`;
            a.click();
            window.URL.revokeObjectURL(blobUrl);
        });
    });
} 


export const downloadbyurl = (url, name) => {
    axios.get(url, { responseType: "blob" }).then(response => {
        const blob = new Blob([response.data]);
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${ name }.mp4`;
        link.click();
        URL.revokeObjectURL(link.href);
    }).catch(console.error);
}


export const export_excel_form_url = (url) => {
    let href = `./xlsmoulds/${ url }`
    const downLoadEle = document.createElement('a')
    downLoadEle.href = href
    downLoadEle.download = url
    downLoadEle.click()
}

export const downloadCustomFormatFile = (url, name) => {
    fetch(url).then((res) => {
        res.blob().then((blob) => {
            const blobUrl = window.URL.createObjectURL(blob);
            const filename = name;
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(blobUrl);
        });
    });
}