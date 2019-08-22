// @flow
import fs, { Dirent } from 'fs';
import Jimp from 'jimp';
import series from 'async/series';

const colGap = 41;
const rowGap = 36;

const leftLastCol = 526;
const firstRow = 134;
const rightFirstCol = 752;
const lastRow = 539;

const rowCount = 12;
const colCount = 9;

export const isInside = (rgbColor: {
  r: number,
  g: number,
  b: number,
  a: number
}) => {
  return !(rgbColor.r < 10 && rgbColor.g < 10 && rgbColor.b < 10);
};

export const extractData = (
  image: Jimp,
  rowStart: number,
  colStart: number
) => {
  const data = [];
  let row = 1;
  let col = 1;

  for (let i = colStart; i > colStart - colGap * colCount; i -= colGap) {
    for (let m = rowStart; m > rowStart - rowGap * rowCount; m -= rowGap) {
      const color = image.getPixelColour(i, m);
      const rgbColor = Jimp.intToRGBA(color);
      if (isInside(rgbColor)) {
        const index = (col - 1) * rowCount + row;
        data.push(index);
      }
      row += 1;
      if (row === 13) row = 1;
    }
    col += 1;
  }
  return data;
};

// left to right, top to bottom
export const extractDataRight = (
  image: Jimp,
  rowStart: number,
  colStart: number
) => {
  const data = [];
  let row = 1;
  let col = 1;

  for (let i = colStart; i < colStart + colGap * colCount; i += colGap) {
    for (let m = rowStart; m < rowStart + rowGap * rowCount; m += rowGap) {
      const color = image.getPixelColour(i, m);
      const rgbColor = Jimp.intToRGBA(color);

      if (isInside(rgbColor)) {
        const index = (col - 1) * rowCount + row;
        data.push(index);
      }
      row += 1;
      if (row === 13) row = 1;
    }
    col += 1;
  }

  return data;
};

export const getFrameData = (image: Jimp) => {
  return {
    fps: 25,
    leftData: extractData(image, lastRow, leftLastCol),
    rightData: extractDataRight(image, firstRow, rightFirstCol)
  };
};

const isJpgOrPng = image => {
  return image.indexOf('.jpg') > -1 || image.indexOf('.png') > -1;
};

export const getFramesData = (
  rootPath: string,
  folders: Array<{ name: string }>,
  callback: (percent: number) => void,
  done: () => void
) => {
  const folderSeries = [];

  folders.forEach((folder, index) => {
    const percent = index / folders.length;

    folderSeries.push(folderCallback => {
      const images = fs.readdirSync(`${rootPath}/${folder.name}`, {
        encoding: 'utf8'
      });

      const imageSeries = [];

      images.forEach((image, imageIndex) => {
        if (!isJpgOrPng(image)) return;

        imageSeries.push(imageCallback => {
          Jimp.read(`${rootPath}/${folder.name}/${image}`, (err, imgData) => {
            const p =
              percent +
              ((1 / folders.length) * (imageIndex + 1)) / images.length;

            callback(Math.ceil(p * 100));
            imageCallback(null, getFrameData(imgData));
          });
        });
      });

      series(imageSeries, (err, results) => {
        const content = JSON.stringify(results);
        fs.writeFileSync(`${rootPath}/${folder.name}.json`, content);
        folderCallback(null);
      });
    });
  });

  series(folderSeries, () => {
    done();
  });
};
