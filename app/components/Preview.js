/* eslint-disable flowtype/no-weak-types */
/* eslint-disable no-plusplus */
// @flow
import React, { Component } from 'react';
import styles from './Preview.css';

type Props = {
  data: Array<any>
};

export default class Preview extends Component<Props> {
  props: Props;

  intervalId: any;

  componentDidMount() {
    const { data } = this.props;
    const canvas: any = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    let i = 0;
    this.intervalId = setInterval(() => {
      this.drawCircles(33 + 8 * 20, 69 + 11 * 12, ctx, data[i]);
      i++;
      if (i > data.length - 1) i = 0;
    }, 40); // 25 fps
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  // eslint-disable-next-line class-methods-use-this
  drawCircles(
    startX: number,
    startY: number,
    ctx: CanvasRenderingContext2D,
    // eslint-disable-next-line flowtype/no-weak-types
    data: any
  ) {
    const { leftData, rightData } = data;
    const radius = 6;
    const row = 12;
    const col = 9;
    const gap = 14;

    const excludeLeftIndexs = [108, 107, 98, 97, 96, 86, 85, 84, 73];
    const excludeRightIndexs = [108, 107, 98, 97, 96, 86, 85, 84, 73];

    let tempLX;
    let tempLY;

    ctx.clearRect(0, 0, 470, 250);

    for (let i = 0; i < col; i++) {
      tempLX = startX - i * gap;

      for (let m = 0; m < row; m++) {
        const index = i * row + m + 1;
        if (excludeLeftIndexs.indexOf(index) < 0) {
          tempLY = startY - m * gap;
          ctx.beginPath();
          ctx.arc(tempLX, tempLY, radius, 0, Math.PI * 2);
          ctx.closePath();
          if (leftData.indexOf(index) < 0) ctx.fillStyle = 'rgba(0, 0, 0, 1)';
          else ctx.fillStyle = 'rgba(28, 200, 255, 1)';
          ctx.fill();
        }
      }
    }

    let tempRX;
    let tempRY;

    for (let i = 0; i < col; i++) {
      tempRX = startX + 85 + i * gap;

      for (let m = 0; m < row; m++) {
        const index = i * row + m + 1;
        if (excludeRightIndexs.indexOf(index) < 0) {
          tempRY = startY - (row - m - 1) * gap;
          ctx.beginPath();
          ctx.arc(tempRX, tempRY, radius, 0, Math.PI * 2);
          ctx.closePath();
          if (rightData.indexOf(index) < 0) ctx.fillStyle = 'rgba(0, 0, 0, 1)';
          else ctx.fillStyle = 'rgba(28, 200, 255, 1)';
          ctx.fill();
        }
      }
    }
  }

  render() {
    return (
      <div className={styles.background}>
        <canvas id="canvas" height="250" width="470" />
      </div>
    );
  }
}
