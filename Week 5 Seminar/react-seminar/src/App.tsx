import Greeting from "./components/Greeting";

function App() {
  return (
  <div>
  <h1>Hello React World with Vite!</h1>
    <Greeting firstname="James" lastname="Brown" age={17} colour="yellow" />
  </div>  
)
}

export default App;