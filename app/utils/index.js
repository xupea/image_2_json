import Jimp from 'jimp';
import series from 'async/series';

const colGap = 41;
const rowGap = 38;

const leftLastCol = 526;
const rightLastCol = 1078;
const lastRow = 539;

const rowCount = 12;
const colCount = 9;

const excludeLeftIndexs = [108, 107, 98, 97, 96, 86, 85, 84];

const excludeRightIndexs = [1, 2, 11, 12, 13, 24, 36];

export const isInside = rgbColor => {
  return !(rgbColor.r < 10 && rgbColor.g < 10 && rgbColor.b < 10);
};

export const extractData = (image, rowStart, colStart, excludeIds) => {
  const data = [];
  let row = 1;
  let col = 1;

  for (let i = colStart; i > colStart - colGap * colCount; i -= colGap) {
    for (let m = rowStart; m > rowStart - rowGap * rowCount; m -= rowGap) {
      const color = image.getPixelColour(i, m);
      const rgbColor = Jimp.intToRGBA(color);
      // data.push(rgbColor);
      if (isInside(rgbColor)) {
        const index = (col - 1) * rowCount + row;
        if (excludeIds.indexOf(index) < 0) data.push(index);
      }
      row += 1;
      if (row === 13) row = 1;
    }
    col += 1;
  }
  return data;
};

export const getFrameData = image => {
  return {
    fps: 25,
    leftData: extractData(image, lastRow, leftLastCol, excludeLeftIndexs),
    rightData: extractData(image, lastRow, rightLastCol, excludeRightIndexs)
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

const constuctSeries = (path, files, callback2) => {
  const seriesArray = [];
  files.forEach(file => {
    if (file.indexOf('jpg') > -1) {
      seriesArray.push(callback => {
        Jimp.read(`${path}/${file}`, (err, image) => {
          callback(null, getFrameData(image));
          const percent = parseInt(
            (parseInt(file.slice(-7, -4)) / files.length) * 100
          );
          callback2(percent);
        });
      });
    }
  });

  return seriesArray;
};

export const getFramesData = (path, files, callback, callback2) => {
  const seriesArray = constuctSeries(path, files, callback2);
  series(seriesArray, (err, results) => {
    // console.log(results);
    callback(results);
  });
};
