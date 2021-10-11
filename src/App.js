import IsolationContainer from './components/isolationContainer';
import './css/style.css';

function App() {
  return (
    <div className="container">
      <h1>Isolation Game</h1>
      <IsolationContainer width="3" height="3"></IsolationContainer>
      <div id="graph">

      </div>
    </div>
  );
}

export default App;