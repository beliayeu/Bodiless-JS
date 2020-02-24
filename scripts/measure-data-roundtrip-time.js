const io = require('socket.io-client');
const socket = io('http://localhost:8005/');
const axios = require('axios');

const getRandomString = length => {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const generateContent = () => {
  return {
    'text': getRandomString(10),
  }
}

let lastSendTime = null
let lastSendData = null

const sendData = () => {
  const data = generateContent();
  const url = 'http://localhost:8005/___backend/content/pages/rcmenu/test';
  axios.post(url, data).then(() => {
    lastSendTime = process.hrtime()
    lastSendData = data
  });
}

socket.on('connect', () => {
  console.log(`socket connected. socket id: ${socket.id}`); // 'G5p5...'
});

socket.on('connect_error', error => {
  console.error('socket connection error')
  console.error(error);
});


socket.on('message', msg => {
  if (msg.type === 'pageQueryResult' && msg.payload.id === '/rcmenu') {
    const data = msg.payload.result.data
    if (!data.Page.edges[0]) {
      return;
    }
    const node = data.Page.edges[0].node
    const content = JSON.parse(node.content)
    if (content.text === lastSendData.text) {
      const hrend = process.hrtime(lastSendTime)
      console.info('Data roundtrip time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
      lastSendData = null;
      sendData();
    }
  }
});

sendData();