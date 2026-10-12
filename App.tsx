import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Subscribe from './pages/Subscribe';
import ArticlePage from './pages/ArticlePage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/article" element={<ArticlePage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/subscribe" element={<Subscribe />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
