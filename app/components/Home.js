// @flow
import fs, { Dirent } from 'fs';
import React, { Component } from 'react';
import electron from 'electron';
import {
  Button,
  Layout,
  Input,
  Spin,
  message,
  Modal,
  Progress,
  Table
} from 'antd';
import styles from './Home.css';
import Preview from './Preview';

import { getFramesData } from '../utils';

const { dialog } = electron.remote;
const { Header, Content } = Layout;

type Props = {};

type AppState = {
  rootPath: string,
  isLoading: boolean,
  listData: Array<any>,
  isPreview: boolean,
  previewData: Array<any>,
  progress: number
};

export default class Home extends Component<Props, AppState> {
  props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      rootPath: '',
      listData: [],
      isLoading: false,
      isPreview: false,
      previewData: [],
      progress: 0
    };
    this.columns = [
      {
        title: 'Folder',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        width: 100,
        render: (text, record) => (
          <span>
            <Button onClick={() => this.preview(record)} size="small">
              Preview
            </Button>
          </span>
        )
      }
    ];
  }

  progressCallback = (percent: number) => {
    this.setState({
      progress: percent
    });
  };

  doneCallback = () => {
    this.setState({
      isLoading: false
    });
    message.success(
      'Congratulation! Please check the json files in your folder.',
      2
    );
  };

  converImagesToJson = () => {
    const { rootPath, listData } = this.state;

    this.setState({
      isLoading: true
    });

    getFramesData(rootPath, listData, this.progressCallback, this.doneCallback);
  };

  preview(folder: any) {
    const { rootPath } = this.state;

    try {
      const content = fs.readFileSync(`${rootPath}/${folder.name}.json`);

      const previewData = JSON.parse(content.toString());

      this.setState({
        isPreview: true,
        previewData
      });
    } catch (err) {
      message.error('Please Click Convert First', 1);
    }
  }

  showPreview(isPreview: boolean) {
    this.setState({
      isPreview
    });
  }

  showOpenDialog = () => {
    dialog.showOpenDialog(
      {
        title: 'Choose Directory',
        properties: ['openDirectory']
      },
      filePaths => {
        if (!filePaths) return;

        const rootPath = filePaths[0];

        const contents = fs.readdirSync(rootPath, {
          encoding: 'utf8',
          withFileTypes: true
        });

        const folders =
          contents &&
          contents
            .filter((dirent: Dirent) => dirent.isDirectory())
            .map((dirent: Dirent) => dirent.name);

        const listData = folders.map(folder => ({
          name: folder
        }));

        this.setState({
          rootPath,
          listData
        });
      }
    );
  };

  render() {
    const {
      rootPath,
      isLoading,
      listData,
      previewData,
      isPreview,
      progress
    } = this.state;

    return (
      <div>
        <Spin
          indicator={
            <Progress
              type="circle"
              percent={progress}
              width={100}
              delay={1000}
            />
          }
          spinning={isLoading}
        >
          <Layout>
            <Header className={styles.header}>
              <div>
                <div className={styles.input}>
                  <Input placeholder="Folder Path" value={rootPath} disabled />
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
                    disabled={rootPath === ''}
                    onClick={() => this.converImagesToJson()}
                  >
                    Convert
                  </Button>
                </div>
              </div>
            </Header>
            <Content>
              <div className={styles.list}>
                <Table
                  size="small"
                  rowKey="name"
                  dataSource={listData}
                  columns={this.columns}
                  pagination={false}
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
