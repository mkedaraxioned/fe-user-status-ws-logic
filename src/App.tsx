import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
// replace with wss://BACKEND_URL
const socket = io('ws://127.0.0.1:4000', {
  transports: ['websocket'],
});
//#step1   Either reload the application or (follow the sequence how we reload the login route)
function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  // const [lastPong, setLastPong] = useState(null);
  useEffect(() => {
    // get current user id from state
    const currentLoggedInUserId = '1';
    console.log('data print');
    // Implement this on the respective component
    socket.on('connection', () => {
      setIsConnected(true);
        console.log('isConnected ',isConnected);
    });

    socket.on('allUserStatus', async (allUserStatusData:any, callback:any) => {
      try {
        //compare below var with the current array of users stored in frontend and then check if status of any user is changed
//#step1        //If changed then either reload the application or (the sequence how we reload the login route)
        console.log('allUserStatusData from server ', allUserStatusData);
        callback({
          success: true,
          message: `All Users data received by userId ${currentLoggedInUserId}`,
        });        
      } catch (error) {
        callback({
          success: false,
          message: `User status receive failed for userId ${currentLoggedInUserId}`
        });
      }
    });
    // can add userId or username or can be left optional
    socket.emit('connected','heelo');
    // socket.on('connected', async () => {
    //   setIsConnected(true);
    // });
    // To be sent when a users role is changed on teams page by toggle button with the respective userId and updated role
    // data sent to server
    socket.emit('userRoleChange', {
      userId: currentLoggedInUserId,
      role: 'ADMIN' 
    }
    ,(res:any) => {
      console.log('res: ', res);
    });
    // socket.on('disconnect', () => {
    //   setIsConnected(false);
    // });
    // To use when a role is changed by some admin and that change is broadcasted by server (If it is the current user then follow #step1)
      // create UserRole type where appropriate and then replace role type below with UserRole
    socket.on('userRoleChangeToClient', async (data:{ userId:string; role:'ADMIN' | 'NORMAL'; }, callback:any) => {
      console.log('userRoleChangeToClient from server ', data);
      callback({
        success: true,
        message: `User role change notification received for ${data.userId}`,
      });
    });
    // socket.on('pong', () => {
    //   setLastPong(new Date().toISOString());
    // });

    return () => {
      socket.off('connection');
      // socket.off('connected');
      // socket.off('disconnect');
      socket.off('allUserStatus');
      socket.off('userRoleChangeToClient');      
    };
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
