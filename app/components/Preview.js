/* eslint-disable no-plusplus */
// @flow
import React, { Component } from 'react';
import styles from './Preview.css';
import { func } from 'prop-types';

type Props = {
  data: Array<any>
};

export default class Preview extends Component<Props> {
  props: Props;

  componentDidMount() {
    const { data } = this.props;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    let i = 0;
    const timer = setInterval(() => {
      this.drawCircles(20, 20, ctx, data[i]);
      i++;
      if (i > 99) i = 0; //clearInterval(timer);
    }, 40);
  }

  componentWillUnmount() {
    // clearInterval();
  }

  // eslint-disable-next-line class-methods-use-this
  drawCircles(
    startX: number,
    startY: number,
    ctx: CanvasRenderingContext2D,
    data
  ) {
    let tempLX;
    let tempLY;

    const { leftData, rightData } = data;

    ctx.clearRect(0, 0, 400, 400);

    for (let m = 0; m < 12; m++) {
      tempLY = startY + m * 25;
      for (let i = 0; i < 9; i++) {
        tempLX = startX + i * 25;
        ctx.beginPath();
        ctx.arc(tempLX, tempLY, 10, 0, Math.PI * 2);
        ctx.closePath();
        if (leftData.indexOf(m * 9 + i + 1) < 0)
          ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        else ctx.fillStyle = 'rgba(28, 200, 255, 1)';
        ctx.fill();
      }
    }

    let tempRX;
    let tempRY;

    for (let m = 0; m < 12; m++) {
      tempRY = startY + m * 25;
      for (let i = 0; i < 9; i++) {
        tempRX = startX + 250 + i * 25;
        ctx.beginPath();
        ctx.arc(tempRX, tempRY, 10, 0, Math.PI * 2);
        ctx.closePath();
        if (rightData.indexOf(m * 9 + i + 1) < 0)
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
