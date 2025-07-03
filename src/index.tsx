import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { useTheme, ThemeContext } from './hooks/useTheme'; // Import useTheme and ThemeContext

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const AppWithTheme: React.FC = () => {
  const themeHook = useTheme();
  return (
    <ThemeContext.Provider value={themeHook}>
      <App />
    </ThemeContext.Provider>
  );
};

root.render(
  <React.StrictMode>
    <AppWithTheme />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
