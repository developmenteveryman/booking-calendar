import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Experiences } from '@/pages/home';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Experiences />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
