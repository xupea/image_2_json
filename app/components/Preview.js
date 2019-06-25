/* eslint-disable no-plusplus */
// @flow
import React, { Component } from 'react';

type Props = {
  data: Array<any>
};

export default class Preview extends Component<Props> {
  props: Props;

  intervalId: any;

  componentDidMount() {
    const { data } = this.props;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    let i = 0;
    this.intervalId = setInterval(() => {
      this.drawCircles(20 + 8 * 25, 20 + 11 * 25, ctx, data[i]);
      i++;
      if (i > data.length - 1) i = 0;
    }, 40);
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
    let tempLX;
    let tempLY;

    const { leftData, rightData } = data;

    ctx.clearRect(0, 0, 400, 400);

    for (let i = 0; i < 9; i++) {
      tempLX = startX - i * 25;

      for (let m = 0; m < 12; m++) {
        tempLY = startY - m * 25;
        ctx.beginPath();
        ctx.arc(tempLX, tempLY, 10, 0, Math.PI * 2);
        ctx.closePath();
        if (leftData.indexOf(i * 12 + m + 1) < 0)
          ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        else ctx.fillStyle = 'rgba(28, 200, 255, 1)';
        ctx.fill();
      }
    }

    let tempRX;
    let tempRY;

    for (let i = 0; i < 9; i++) {
      tempRX = startX + 8 * 25 + 40 - i * 25;

      for (let m = 0; m < 12; m++) {
        tempRY = startY - m * 25;
        ctx.beginPath();
        ctx.arc(tempRX, tempRY, 10, 0, Math.PI * 2);
        ctx.closePath();
        if (rightData.indexOf(i * 12 + m + 1) < 0)
          ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        else ctx.fillStyle = 'rgba(28, 200, 255, 1)';
        ctx.fill();
      }
    }
  }

  render() {
    return (
      <div>
        <canvas id="canvas" height="400" width="600" />
      </div>
    );
  }
}
