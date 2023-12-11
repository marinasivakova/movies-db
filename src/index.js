import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import MoviesList from './components/MoviesList';

function App() {
  return (
    <div className="App">
      <MoviesList />
    </div>
  );
}

let container = null;

document.addEventListener('DOMContentLoaded', function () {
  if (!container) {
    container = document.getElementById('root');
    const root = createRoot(container);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
});