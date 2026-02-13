const video = document.getElementById('webcam');
const statusText = document.getElementById('status');

let modelCoco = undefined; 
let modelApi = undefined;  
let isCooldown = false;

const URL_API = "https://teachablemachine.withgoogle.com/models/eakL4m792/";

async function setupWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = stream;
        return new Promise((resolve) => { 
            video.onloadedmetadata = () => resolve(video); 
        });
    } catch (error) {
        statusText.innerText = "❌ Gagal akses webcam!";
    }
}

function captureSnapshot() {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8); 
}

async function sendAlert(jenis, detail) {
    if (isCooldown) return;
    isCooldown = true;

    statusText.innerText = `🚨 PERINGATAN: ${jenis.toUpperCase()}! Mengirim foto...`;
    statusText.style.color = "red";

    const fotoBase64 = captureSnapshot();

    try {
        await fetch('/api/alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                tipe: jenis, 
                info: detail, 
                image: fotoBase64 
            }) 
        });
    } catch (e) {
        console.error("Gagal kirim alert", e);
    }

    setTimeout(() => {
        isCooldown = false;
        statusText.innerText = "✅ CCTV Memantau...";
        statusText.style.color = "green";
    }, 10000);
}

async function detectFrame() {
    const predictionApi = await modelApi.predict(video);
    const hasilApi = predictionApi.find(p => p.className === "ada api"); 

    if (hasilApi && hasilApi.probability > 0.80 && !isCooldown) {
        sendAlert("KEBAKARAN", ["Api Terdeteksi"]);
        requestAnimationFrame(detectFrame);
        return; 
    }

    const predictions = await modelCoco.detect(video);
    let adaOrang = false;
    let barangBawaan = [];
    const targetBarang = ['cell phone', 'backpack', 'laptop', 'handbag', 'knife'];

    for (let i = 0; i < predictions.length; i++) {
        if (predictions[i].score > 0.60) {
            if (predictions[i].class === "person") {
                adaOrang = true;
            } else if (targetBarang.includes(predictions[i].class)) {
                barangBawaan.push(predictions[i].class);
            }
        }
    }

    if (adaOrang && barangBawaan.length > 0 && !isCooldown) {
        sendAlert("ORANG MENCURIGAKAN", barangBawaan);
    }

    requestAnimationFrame(detectFrame);
}

async function main() {
    statusText.innerText = "⏳ Memuat AI (Orang + Api)...";
    
    modelCoco = await cocoSsd.load();
    modelApi = await tmImage.load(URL_API + "model.json", URL_API + "metadata.json");

    await setupWebcam();
    statusText.innerText = "✅ CCTV Aktif";
    detectFrame();
}

main();
