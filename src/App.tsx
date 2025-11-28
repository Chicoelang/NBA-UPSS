import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import Standings from './pages/Standings';
import BoxScores from './pages/BoxScores';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Teams />} />
          <Route path="teams/:id" element={<TeamDetail />} />
          <Route path="standings" element={<Standings />} />
          <Route path="box-scores" element={<BoxScores />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;