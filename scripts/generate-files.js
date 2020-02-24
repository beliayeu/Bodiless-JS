const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const targetDir = 'examples/test-site/src/data/pages/list';

const getRandomString = length => {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const files = []

const generateContent = () => {
  return {
    'text': getRandomString(10),
  }
}

const createFiles = (count) => {
  console.log(`creating ${count} files`);
  let ind = 0;
  while (ind++ < count) {
    const fileName = getRandomString(5) + '.json';
    const filePath = path.resolve(targetDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(generateContent()));
    files.push(filePath);
  }
}

const updateFiles = (count) => {
  console.log(`updating ${count} files`);
  let ind = 0;
  while (ind++ < count) {
    const randomFile = files[Math.floor(Math.random() * files.length)];
    fs.writeFileSync(randomFile, JSON.stringify(generateContent()));
  }
}

const deleteFiles = (count) => {
  console.log(`deleting ${count} files`);
  let ind = 0;
  while (ind++ < count) {
    //const randomIndex = Math.floor(Math.random() * files.length);
    const randomIndex = 0;
    const randomFile = files[randomIndex];
    files.splice(randomIndex, 1);
    fs.unlinkSync(randomFile);
  }
}

const main = async () => {
  if (shouldClean) {
    await spawn('git', ['clean', '-fd', `${targetDir}`], {
      stdio: 'inherit',
    })
  }
  let ind = 0;
  let count = 1000;
  const intervalID = setInterval(() => {
    if (++ind >= count) {
      clearInterval(intervalID);
    }
    createFiles(10);
    updateFiles(10);
    if (ind >= 5) {
      deleteFiles(2);
    }
  }, 5000)
}

const shouldClean = false;

(async () => {
  await main();
})().catch(e => {
  // Deal with the fact the chain failed
});