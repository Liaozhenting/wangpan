import React from 'react';
import reqwest from 'reqwest';
import 'antd/dist/antd.css';
import './App.css';

import { Icon, Checkbox, Breadcrumb, message } from "antd";

export default class DataOprate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedKeys: [],
            dataFileList: [],
            address: "root/",
        }
    }

    changePath = (key, callback) => {
        if (key === '') key = "root/"
        this.setState({ address: key }, () => {
            callback && callback();
        });
    }

    cdForder = (key) => {
        this.setState({ showInfo: true });
        this.changePath(key, this.getFileList);
    }
    getFileList = async () => {
        try {
            let Prefix = this.state.address;
            let data = await reqwest({
                url: `http://localhost:8080/sts`,
                method: 'get',
                data: {
                    prefix: Prefix
                }
            });

            const _this = this;
            if (!(data.status === 200)) {
                message.error(data.message);
                return
            }
            let contents = data.fileList;
            if (Array.isArray(contents)) {
                contents = contents.map((ele, index) => {
                    var obj = {};
                    obj.Key = ele.slice(0, 1) === "/" ? ele.slice(1) : ele;
                    var chain = ele.split("/");
                    if (chain[chain.length - 1] === '') {
                        obj.Title = chain[chain.length - 2];
                        obj.IsForder = true;
                    } else {
                        obj.Title = chain.slice(-1);
                    }
                    return obj;

                })
            } else {
                contents = [];
            }
            _this.setState({ dataFileList: contents });
        }

        catch (err) {
            console.log("Error", err);
            message.error('Get list of files failed');
        }

    }

    componentDidMount() {
        this.getFileList();
    }
    getSelecedKeys = () => {
        let newArr = this.state.dataFileList;
        newArr = newArr.filter((ele, index) => {
            return ele.checked === true
        })
        let selectedKeys = [];
        newArr.forEach((ele) => {
            selectedKeys.push(ele.Key);
        });
        console.log("selectedKeys",selectedKeys);
        this.setState({ selectedKeys: selectedKeys })
    }
    onSelect = (index) => {
        let files = this.state.dataFileList.slice(0);
        files[index].checked = !files[index].checked;
        this.setState({ dataFilesList: files }, this.getSelecedKeys);

    }
    render() {
        return <div className="oprate-table">
            <div className="oprate-table-breadcrumb clearfix">
                <div className="breadcrumb">
                    <Breadcrumb separator=">">
                        {this.state.address.split('/').map((ele, index) => {
                            let stage = this.state.address.split("/");
                            let key = this.state.address.split("/").slice(0, index + 1);
                            key = key.join("/");
                            key = key.slice(-1) === '/' ? key : key + '/';
                            return <Breadcrumb.Item key={key} className="breadcrumb-line" onClick={(ev) => this.cdForder(key)}><a>{ele}</a></Breadcrumb.Item>
                        })}

                    </Breadcrumb>

                </div>
                <p>当前位置共{this.state.dataFileList.length}个内容</p>
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


                {this.state.dataFileList.map((ele, index) => {
                    return (
                        <div className={(ele.checked ? "checked" : "") + " file-list-item clearfix"} key={index}
                            onDoubleClick={ele.IsForder ? () => this.cdForder(ele.Key) : null}>
                            <Checkbox checked={ele.checked} onClick={() => this.onSelect(index)}></Checkbox>
                            <div className="file-list-name"><Icon type={ele.IsForder ? "folder" : "file"} />&nbsp;&nbsp;{ele.Title}</div>
                            <div className="file-list-size">-</div>
                            <div className="file-list-right">-</div>
                            <div className="file-list-edit">-</div>
                            <div className="file-list-final-time">-</div>
                            <div className="file-list-create-time">-</div>
                        </div>
                    )
                })}

            </div>

        </div>

    }
}