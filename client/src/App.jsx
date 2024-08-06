import Homepage from "./pages/homepage/Homepage";
import Topbar from "./components/topbar/Topbar";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Settings from "./pages/settings/Settings";
import Single from "./pages/single/Single";
import Write from "./pages/write/Write";
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom'
import { useContext } from "react";
import { Context } from "./context/Context";
import Chat from "./pages/chat/Chat";

function App() {
  const { user } = useContext(Context)
  
  return (
    <Router>
      <Topbar />
      <Routes>
        <Route exact path="/" element={<Homepage />}></Route>
        <Route path="/register" element={user ? <Homepage /> : <Register />}></Route>
        <Route path="/login" element={user ? <Homepage /> : <Login />}></Route>
        <Route path="/write" element={user ? <Write /> : <Register />}></Route>
        <Route path="/chat" element={user ? <Chat /> : <Register />}></Route>
        <Route path="/settings" element={user ? <Settings /> : <Register />}></Route>
        <Route path="/posts/:postId" element={<Single />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
