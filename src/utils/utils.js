import React from 'react';
import {Select} from 'antd'
const Option = Select.Option;
export default {
    formateDate(time){
        if(!time) return '';
        let date = new Date(time);
        // 时间长度格式统一 补零占位
        let currentMonth = date.getMonth() < 9 ? (String(date.getMonth()+1)).padStart(2,'0') : date.getMonth()+1;
        let currentDate = date.getDate() < 10 ? (String(date.getDate())).padStart(2, '0'): date.getDate();
        let currentHours = date.getHours() < 10 ? (String(date.getHours())).padStart(2, '0'): date.getHours();
        let currentMinutes = date.getMinutes() < 10 ? (String(date.getMinutes())).padStart(2, '0'): date.getMinutes();
        let currentSeconds = date.getSeconds() < 10 ? (String(date.getSeconds())).padStart(2, '0'): date.getSeconds();
        return `${date.getFullYear()}-${currentMonth}-${currentDate}  ${currentHours}:${currentMinutes}:${currentSeconds}`;
    },
    pagination(data,callback){
        return {
            onChange:(current)=>{
                callback(current)
            },
            current:data.result.page,
            pageSize:data.result.page_size,
            total: data.result.total_count,
            showTotal:()=>{
                return `共${data.result.total_count}条`
            },
            showQuickJumper: true
        }
    },
    getOptionList(data){
        if(!data){
            return [];
        }
        let options =  [];          // <Option value="0" key="all_key"></Option>
        data.map((item)=>{
            options.push(<Option value={item.id} key={item.id}>{item.name}</Option>)
        })
        return options;
    },

    /**
     * ETable 行点击通用函数
     * @param {*选中行的索引} selectedRowKeys
     * @param {*选中行对象} selectedItem 
     * */
    updateSelectedItem(selectedRowKeys, selectedRows, selectedIds){
        if (selectedIds) {
            this.setState({
                selectedRowKeys,
                selectedIds: selectedIds,
                selectedItem: selectedRows
            })
        } else {
            this.setState({
                selectedRowKeys,
                selectedItem: selectedRows
            })
        }
    }
    
}