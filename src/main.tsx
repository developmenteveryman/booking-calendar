import { render } from 'preact';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { App } from './app.tsx';

render(<App />, document.getElementById('app')!);
