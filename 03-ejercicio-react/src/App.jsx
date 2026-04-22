import { Header } from "./components/header";
import { Footer } from "./components/footer";

import { HomePage } from "./pages/Home";
import { SearchPage } from "./pages/Search";
import { NotFoundPage } from "./pages/404";

import { Route } from "./components/route";

function App() {
  return (
    <>
      <Header />
      <Route path="/" component={HomePage} />
      <Route path="/search" component={SearchPage} />
      <Route component={NotFoundPage} />
      <Footer />
    </>
  );
}

export default App;
