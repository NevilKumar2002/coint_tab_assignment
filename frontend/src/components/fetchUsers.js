import React, { useState } from 'react';
import PostPage from './PostPage';
import {  useNavigate } from 'react-router-dom';

function FetchUsers() {
  const [users, setUsers] = useState([]);
  const [tableVisible, setTableVisible] = useState(false);
//   const history = useHistory();
  const navigate=useNavigate();

  const fetchAllUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/all-users');
      const data = await response.json();
      setUsers(data);
      setTableVisible(true);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  const addUser = async (user) => {
    try {
      const response = await fetch('http://localhost:3000/api/add-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
  
      const result = await response.json();
      console.log(result);
  
      if (result.openButton) {
        // Hide the "Add" button and show the "Open" button if elements exist
        const addButton = document.getElementById(`addButton_${user.id}`);
        const openButton = document.getElementById(`openButton_${user.id}`);
        
        if (addButton && openButton) {
          addButton.style.display = 'none';
          openButton.style.display = 'block';
        }
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };
  

//   const addUser = async (user) => {
//     try {
//       const response = await fetch('http://localhost:3000/api/add-user', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(user),
//       });

//       const result = await response.json();
//       console.log(result);

//       if (result.openButton) {
//         // Hide the "Add" button and show the "Open" button
//         const addButton = document.querySelector(`#addButton_${result.user.id}`);
//         const openButton = document.querySelector(`#openButton_${result.user.id}`);
        
//         addButton.style.display = 'none';
//         openButton.style.display = 'block';
//       }

//     } catch (error) {
//       console.error('Error adding user:', error);
//     }
//   };

  
  const openUser = (userId) => {
    // window.location.href = `http://localhost:3000/post/${userId}`;
    // history.push(`/post/${userId}`);
    navigate(`/post/${userId}`);
    // Implement the openUser functionality here
  };

  return (
    <div>
      <h1>Cointab SE-ASSIGNMENT</h1>
      <button onClick={fetchAllUsers}>All Users</button>

      {tableVisible && (
        <table border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Website</th>
              <th>City</th>
              <th>Company</th>
              <th>Add</th>
              <th>Open</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.website}</td>
                <td>{user.address.city}</td>
                <td>{user.company.name}</td>
                <td>
                  <button
                    id={`addButton_${user.id}`}
                    onClick={() => addUser(user)}
                  >
                    Add
                  </button>
                </td>
                <td>
                  <button
                    id={`openButton_${user.id}`}
                    style={{ display: 'none' }}
                    onClick={() => openUser(user.id)}
                  >
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FetchUsers;
