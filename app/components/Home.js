// @flow
import fs from 'fs';
import React, { Component } from 'react';
import electron from 'electron';
import { Button, List, Layout, Input, Spin, message, Modal } from 'antd';
import { saveAs } from 'file-saver';
import styles from './Home.css';
import Preview from './Preview';
import { getFramesData, saveFile } from '../utils';

const { dialog } = electron.remote;
const { Header, Content } = Layout;

type Props = {};

type AppState = {
  path: string,
  isLoading: boolean,
  listData: Array<any>,
  canConvert: boolean,
  isPreview: boolean,
  previewData: Array<any>
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
      canConvert: false,
      isPreview: false,
      previewData: null
    };
  }

  saveFileHandler(previewData: Array<any>) {
    this.setState({
      isLoading: false,
      previewData
    });

    message.success('Images are converted successfully', 1);
  }

  saveData(path: string) {
    return (results: any) => saveFile(results, path, this.saveFileHandler);
  }

  saveExpressionFileAs() {
    const { previewData } = this.state;
    const blob = new Blob([JSON.stringify(previewData)], {
      type: 'text/plain;charset=utf-8'
    });
    saveAs(blob, 'export.json');
  }

  converData() {
    const { path, listData } = this.state;

    this.setState({
      isLoading: true
    });

    getFramesData(path, listData, this.saveData(path));
  }

  showPreview(isPreview: boolean) {
    this.setState({
      isPreview
    });
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
    const {
      path,
      isLoading,
      canConvert,
      listData,
      previewData,
      isPreview
    } = this.state;
    return (
      <div>
        <Spin tip="Converting" spinning={isLoading}>
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
                    className={styles.button}
                    disabled={!canConvert}
                    onClick={() => this.converData()}
                  >
                    Convert
                  </Button>
                  <Button
                    type="primary"
                    disabled={!previewData}
                    className={styles.button}
                    onClick={() => this.showPreview(true)}
                  >
                    Preview
                  </Button>
                  <Button
                    type="primary"
                    disabled={!previewData}
                    onClick={() => this.saveExpressionFileAs()}
                  >
                    Save As
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
        <Modal
          destroyOnClose
          title="Preview"
          centered
          visible={isPreview}
          onCancel={() => this.showPreview(false)}
          onOk={() => this.showPreview(false)}
        >
          <Preview data={previewData} />
        </Modal>
      </div>
    );
  }
}
