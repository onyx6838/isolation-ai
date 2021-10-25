import React from 'react'
import IsolationContainer from './components/isolationContainer';
import './App.css'

export default function App() {
  return (
    <div className='container'>
      <IsolationContainer width="4" height="4" />
      <div id="graph"></div>
    </div>
  )
}