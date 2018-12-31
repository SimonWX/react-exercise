import JsonP from 'jsonp'
import axios from 'axios'
import { Modal } from 'antd';
import Utils from './../utils/utils'
export default class Axios{
    static requestList(_this,url,params,isMock){
        let data = {
            params: params,
            isMock
        }
        this.ajax({
            url: url,
            data: data
        }).then((data)=>{
            if(data && data.result){
                let list = data.result.item_list.map((item, index)=>{
                    item.key = index;
                    return item;
                })
                _this.setState({
                    list: list,
                    pagination: Utils.pagination(data,(current)=>{
                        _this.params.page = current;
                        _this.requestList();
                    })
                })
            }
        })
    }
    
    static jsonp(options){
        return new Promise((resolve,reject)=>{
            JsonP(options.url,{
                param: 'callback',
            },function(err,response){
                if(response.status == 'success'){
                    resolve(response);
                }else{
                    reject(response.message);
                }
            })
        })
    }

    static ajax(options){
        // 开始加载loading
        let loading;
        if(options.data && options.data.isShowLoading !== false){
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'block';
        }
        // 如果是mock数据的话，
        let baseApi = '';
        if(options.isMock){
            // mock数据的baseApi
            baseApi = 'https://www.easy-mock.com/mock/5c24c271bf2237296ae2e781/mooc.api';
        }else{
            // 服务端的数据的baseApi
            baseApi = 'https://www.easy-mock.com/mock/5c24c271bf2237296ae2e781/mooc.api';
        }
        return new Promise((resolve,reject)=>{
            axios({
                url: options.url,
                method: 'get',
                baseURL: baseApi,
                timeout: 5000,
                params: (options.data && options.data.params) || ''
            }).then((response)=>{
                if(options.data && options.data.isShowLoading !== false){
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                if(response.status == '200'){
                    let res = response.data;
                    if(res.code == '0'){
                        resolve(res);
                    }else{
                        Modal.info({
                            title: '提示',
                            content: res.msg
                        })
                    }
                }else{
                    reject(response.data);
                }
            })
        });
    }
}