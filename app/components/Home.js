// @flow
import fs from 'fs';
import React, { Component } from 'react';
import electron from 'electron';
import { Button, List, Layout, Input, Spin, message } from 'antd';
import styles from './Home.css';
import { getFramesData, saveFile } from '../utils';

const { dialog } = electron.remote;
const { Header, Content } = Layout;

type Props = {};

type AppState = {
  path: string,
  isLoading: boolean,
  listData: Array<any>,
  canConvert: boolean
};

export default class Home extends Component<Props, AppState> {
  props: Props;

  constructor(props: Props) {
    super(props);
    this.saveFileHandler = this.saveFileHandler.bind(this);
    this.state = {
      path: '',
      listData: [],
      isLoading: false,
      canConvert: false
    };
  }

  saveFileHandler() {
    this.setState({
      isLoading: false
    });

    message.success('JSON file is saved successfully');
  }

  saveData(path: string) {
    return (results: any) => saveFile(results, path, this.saveFileHandler);
  }

  converData() {
    const { path, listData } = this.state;

    this.setState({
      isLoading: true
    });

    getFramesData(path, listData, this.saveData(path));
  }

  // eslint-disable-next-line class-methods-use-this
  showOpenDialog() {
    dialog.showOpenDialog(
      {
        title: '选择文件夹',
        properties: ['openDirectory']
      },
      filePaths => {
        // filePaths:用户选择的文件路径的数组
        if (!filePaths) return;

        const path = filePaths[0];

        this.setState({
          path
        });

        fs.readdir(path, (err, files) => {
          this.setState({
            listData: files,
            canConvert: true
          });
        });
      }
    );
  }

  render() {
    const { path, isLoading, canConvert, listData } = this.state;
    return (
      <div>
        <Spin tip="Saving Data" spinning={isLoading}>
          <Layout>
            <Header className={styles.header}>
              <div>
                <div className={styles.input}>
                  <Input value={path} disabled />
                </div>

                <div className={styles.buttonGroup}>
                  <Button
                    className={styles.button}
                    type="primary"
                    onClick={() => this.showOpenDialog()}
                  >
                    Choose Folder
                  </Button>
                  <Button
                    type="primary"
                    disabled={!canConvert}
                    onClick={() => this.converData()}
                  >
                    Convert
                  </Button>
                </div>
              </div>
            </Header>
            <Content>
              <div className={styles.list}>
                <List
                  size="large"
                  bordered
                  dataSource={listData}
                  renderItem={item => <List.Item>{item}</List.Item>}
                />
              </div>
            </Content>
          </Layout>
        </Spin>
      </div>
    );
  }
}
