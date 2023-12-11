const WebSocket = require('ws');
const path = require("path");
const crypto = require('crypto');
const { get } = require('https');

const startServerApp = ({interval, file}) => {
    const port = 8081;
    const wss = new WebSocket.WebSocketServer({ port: port });
    
    wss.on('connection', (ws) => {
        ImagesUtil.loadData(file);
    
        ws.on('pong', () => { ws.isAlive = true; });
        ws.on('message',  async (data) => {
            const img = JSON.parse(data.toString());
            const same = await ImagesUtil.compareTo(img);
            if (same) {
                console.log('\x1b[32m%s\x1b[0m', JSON.stringify(img));
            } else {
                console.log('\x1b[31m%s\x1b[0m', JSON.stringify(img));

                const result = ImagesUtil.searchById(data.id);
                console.log('\x1b[31m%s\x1b[0m', JSON.stringify(result));
            }
        });
        ws.on('error', console.error);
    });
    
    const ping = (ws) => {
        if (ws.isAlive === false) {
            return ws.terminate();
        }
        ws.ping();
        ws.isAlive === false;
    }
    const intervalTimer = setInterval(() => {
        wss.clients.forEach((ws) => {
            if (ws.readyState === WebSocket.OPEN) {
                ping(ws);
                ws.send(JSON.stringify(ImagesUtil.getImg()));
            }
        });
    }, parseInt(interval) * 1000);
    
    wss.on('close', function close() {
        clearInterval(intervalTimer);
    });
    
    class ImagesUtil {
        static data = [];
        static index = 0;
        static loadData(file) {
            ImagesUtil.data = require(path.join(__dirname, file));
        }
    
        static getImg() {
            if (ImagesUtil.index === ImagesUtil.data.length - 1) {
                ImagesUtil.data = require(path.join(__dirname, file));
                ImagesUtil.index = 0;
            }
    
            return ImagesUtil.data[ImagesUtil.index++];
        }
        static searchById(id) {
            return ImagesUtil.data.find(d => d.id === id);
        }
     
        static async compareTo({id, digest}) {
            const item = ImagesUtil.searchById(id);

            const promise = new Promise((resolve, reject) => {
                const data = [];
                get(item.image, (res) => {
                    res.on("data", (chunk) => {
                        data.push(chunk);
                    }).on("end", () => {
                        const hash = crypto.createHash('sha256');
                        hash.update(Buffer.concat(data));
                        const digestCode = hash.digest('hex');
                        Object.assign(data, {hash: digestCode});

                        resolve(`${digest === digestCode}`);
                    }).on("error", (err) => {
                        reject(err);
                    });
                });
            });
    
            return promise;
        }
    }
    console.log(`Server application URL ws://localhost: ${port}`);
};

module.exports = startServerApp;