import React from 'react';
import reqwest from 'reqwest';
import 'antd/dist/antd.css';
import './App.css';
import {Icon, Checkbox, Breadcrumb, message} from 'antd';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.address = 'root/'; // 当前目录地址
    this.state = {
      selectedKeys: [], // ['root/app/']
      dataList: [] // 该目录下的文件及文件夹 [{Key: 'root/app/',Title: 'app',isFolder: true}]
    };
  }

  /**
   * 进入另一个目录
   * @param {string} key
   */
  cdFolder = (key) => {
    if (key === '') {
      this.address = 'root/';
    } else {
      this.address = key;
    }
    this.getFileList();
  };

  /**
   * 获取当前目录的文件和文件夹
   */
  getFileList = async () => {
    try {
      let Prefix = this.address;
      let data = await reqwest({
        url: `http://localhost:8080/sts`,
        method: 'get',
        data: {
          prefix: Prefix
        }
      });
      if (!(data.status === 200)) {
        message.error(data.message);
        return;
      }
      let contents = data.fileList;
      if (Array.isArray(contents)) {
        contents = this.tags(contents);
      } else {
        contents = [];
      }
      this.setState({dataList: contents});
    } catch (err) {
      console.log('Error', err);
      message.error('Get list of files failed');
    }
  };

  /**
   * 区分文件和文件夹，并提取名字
   * @param {string[]} fileList ["/root/app/"]
   */
  tags(fileList) {
    return fileList.map((ele, index) => {
      var obj = {};
      // 去掉最前面的'/'
      obj.Key = ele.slice(0, 1) === '/' ? ele.slice(1) : ele;
      var chain = ele.split('/');
      // 是文件夹
      if (chain[chain.length - 1] === '') {
        obj.Title = chain[chain.length - 2];
        obj.isFolder = true;
        // 是文件
      } else {
        obj.Title = chain.slice(-1);
      }
      return obj;
    });
  }

  componentDidMount() {
    this.getFileList();
  }

  getSelectedKeys = () => {
    let newArr = this.state.dataList;
    newArr = newArr.filter((ele, index) => {
      return ele.checked === true;
    });
    let selectedKeys = [];
    newArr.forEach((ele) => {
      selectedKeys.push(ele.Key);
    });
    console.log('selectedKeys', selectedKeys);
    this.setState({selectedKeys: selectedKeys});
  };

  onSelect = (index) => {
    let files = this.state.dataList.slice(0);
    files[index].checked = !files[index].checked;
    this.setState({dataFilesList: files}, this.getSelectedKeys);
  };

  /**
   * 头部地址栏
   */
  renderHeader() {
    return this.address.split('/').map((ele, index) => {
      let key = this.address.split('/').slice(0, index + 1);
      key = key.join('/');
      // 保证最有'/'结尾
      key = key.slice(-1) === '/' ? key : key + '/';
      return (
        <Breadcrumb.Item
          key={key}
          className="breadcrumb-line"
          onClick={(ev) => this.cdFolder(key)}>
          <a>{ele}</a>
        </Breadcrumb.Item>
      );
    });
  }

  render() {
    const {dataList} = this.state;
    return (
      <div className="oprate-table">
        <div className="oprate-table-breadcrumb clearfix">
          <div className="breadcrumb">
            <Breadcrumb separator=">">{this.renderHeader()}</Breadcrumb>
          </div>
          <p>当前位置共{dataList.length}个内容</p>
        </div>
        <div className="file-list clearfix">
          <ul>
            <li className="file-name">名字</li>
            <li className="file-size">大小</li>
            <li className="file-right">权限</li>
            <li className="file-edit">编辑</li>
            <li className="file-final-time">最后修改日期</li>
            <li className="file-create-time">创建日期</li>
          </ul>
          {this.renderList(dataList)}
        </div>
      </div>
    );
  }

  /**
   * 文件及文件夹列表
   * @param {[{Key: 'root/app/',Title: 'app',isFolder: true}]} dataList
   */
  renderList(dataList) {
    return dataList.map((ele, index) => {
      return (
        <div
          className={
            (ele.checked ? 'checked' : '') + ' file-list-item clearfix'
          }
          key={index}
          onDoubleClick={ele.isFolder ? () => this.cdFolder(ele.Key) : null}>
          <Checkbox
            checked={ele.checked}
            onClick={() => this.onSelect(index)}
          />
          <div className="file-list-name">
            <Icon type={ele.isFolder ? 'folder' : 'file'} />
            &nbsp;&nbsp;{ele.Title}
          </div>
          <div className="file-list-size">-</div>
          <div className="file-list-right">-</div>
          <div className="file-list-edit">-</div>
          <div className="file-list-final-time">-</div>
          <div className="file-list-create-time">-</div>
        </div>
      );
    });
  }
}
