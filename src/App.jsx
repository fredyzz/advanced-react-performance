// In SSR mode, createRoot has to be imported in ClientApp
// import { createRoot } from "react-dom/client";
// In SSR mode, BrowserRouter has to be imported in ClientApp
import {Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState,lazy, Suspense } from "react";
import AdoptedPetContext from "./AdoptedPetContext";

const Details = lazy(() => import('./Details'))
const SearchParams = lazy(() => import('./SearchParams'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
      suspense: true,
    },
  },
});

const App = () => {
  const adoptedPet = useState(null);
  return (
    <div>
      {/* <BrowserRouter> */}
        <AdoptedPetContext.Provider value={adoptedPet}>
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={<div className="loading-pane"><h2 className="loader">😀</h2></div>}>
              <header>
                <Link to="/">Adopt Me!</Link>
              </header>
              <Routes>
                <Route path="/details/:id" element={<Details />} />
                <Route path="/" element={<SearchParams />} />
              </Routes>
            </Suspense>
          </QueryClientProvider>
        </AdoptedPetContext.Provider>
      {/* </BrowserRouter> */}
    </div>
  );
};

//This is not needed in SSR mode, we are making App runneable in client and server
// const container = document.getElementById("root");
// const root = createRoot(container);
// root.render(<App />);

export default App;
