import IsolationContainer from './components/isolationContainer';
import './css/style.css';

function App() {
  return (
    <div className="container">
      <h1>Isolation Game</h1>
      <IsolationContainer width="4" height="4"></IsolationContainer>
      <div id="graph">

      </div>
    </div>
  );
}

export default App;