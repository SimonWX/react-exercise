import React from 'react'
import {HashRouter, Route, Link, Switch} from 'react-router-dom'
import Main from './Main'
import About from './about'
import Topic from './topic'

export default class Home extends React.Component{
    render(){
        return (
            <HashRouter>
                <div>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                        <li>
                            <Link to="/topics">Topics</Link>
                        </li>
                    </ul>
                    <hr/>
                    <Switch>  //一旦匹配到路由 ，不在往下匹配
                        
                    </Switch>
                </div>
            </HashRouter>
        );
    }

}