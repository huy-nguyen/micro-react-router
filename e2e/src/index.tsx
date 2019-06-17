import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import 'sanitize.css/sanitize.css'


const container = document.createElement('div');
document.body.appendChild(container);
ReactDOM.render(<App/>, container);
