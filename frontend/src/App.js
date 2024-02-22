import React, { useState } from 'react';
import FetchUsers from './components/fetchUsers';
import PostPage from './components/PostPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  const [userId, setUserId] = useState();

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FetchUsers />} />
          <Route path="/post/:userId" element={<PostPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
