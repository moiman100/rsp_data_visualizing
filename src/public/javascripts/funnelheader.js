const Button = MaterialUI.Button;
// You can also use MaterialUI.Button directly

const name = 'Josh Perez';
const element =
  <div>
    <h1>Hello, {name}</h1>
    <Button variant="contained" color="primary">
      Hello World
    </Button>
  </div>;

ReactDOM.render(element, document.getElementById('funnel_header'));