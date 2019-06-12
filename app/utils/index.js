import Jimp from 'jimp';
import fs from 'fs';
import series from 'async/series';

const leftFirstCol = 206;
const rightFirstCol = 752;
const colGap = 40;
const rowGap = 36;
const firstRow = 135;
const rowCount = 12;
const colCount = 9;

const targetColor = 466616063;
const targetColor2 = 483327743;

export const extractData = (image, rowStart, colStart) => {
  const data = [];
  let row = 1;
  let col = 1;

  for (let m = rowStart; m < rowStart + rowGap * rowCount; m += rowGap) {
    for (let i = colStart; i < colStart + colGap * colCount; i += colGap) {
      const color = image.getPixelColour(i, m);
      // const rgbColor = Jimp.intToRGBA(color);
      if (color === targetColor || color === targetColor2) {
        const index = (row - 1) * colCount + col;
        data.push(index);
      }
      col += 1;
      if (col > 9) col = 1;
    }
    row += 1;
  }

  return data;
};

export const getFrameData = image => {
  return {
    fps: 30,
    leftData: extractData(image, firstRow, leftFirstCol),
    rightData: extractData(image, firstRow, rightFirstCol)
  };
};

export const saveFile = (jsonData, path, callback) => {
  callback(jsonData);
  // const content = JSON.stringify(jsonData);

  // fs.writeFile(`${path}/data.json`, content, err => {
  //   if (err) return;
  //   callback(jsonData);
  // });
};

const constuctSeries = (path, files) => {
  const seriesArray = [];
  files.forEach(file => {
    if (file.indexOf('jpg') > -1) {
      seriesArray.push(callback => {
        Jimp.read(`${path}/${file}`, (err, image) => {
          callback(null, getFrameData(image));
        });
      });
    }
  });

  return seriesArray;
};

export const getFramesData = (path, files, callback) => {
  const seriesArray = constuctSeries(path, files);
  series(seriesArray, (err, results) => {
    // console.log(results);
    callback(results);
  });
};
