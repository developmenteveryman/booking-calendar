import { render } from 'preact';
import './index.css';
import 'jquery';
import 'popper.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { App } from './app.tsx';

render(<App />, document.getElementById('app')!);
