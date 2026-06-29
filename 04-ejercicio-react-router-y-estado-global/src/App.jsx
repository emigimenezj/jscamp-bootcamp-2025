import { MainLayout } from "./components/MainLayout.jsx";

import { Routes, Route } from "react-router";
import { lazy } from "react";

const HomePage = lazy(() => import("./pages/Home.jsx"));
const SearchPage = lazy(() => import("./pages/Search.jsx"));
const DetailPage = lazy(() => import("./pages/Detail.jsx"));
const NotFoundPage = lazy(() => import("./pages/404.jsx"));

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/job/:id" element={<DetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
