import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "../App.css"
function PostPage() {
  const { userId } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [posts, setPosts] = useState([]);
  const [bulkAddVisible, setBulkAddVisible] = useState(true);
  const [downloadExcelVisible, setDownloadExcelVisible] = useState(false);

  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        const endpoint = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        const response = await endpoint.json();
        const name = response.name;
        const email = response.email;
        const company = response.company.name;
        setName(name);
        setEmail(email);
        setCompany(company);
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchUserInformation();
    fetchPosts();
  }, [userId]);

  const bulkAddPosts = async () => {
    try {
      // Send a POST request to your server to store the posts in the database
      const response = await fetch('http://localhost:3000/api/bulk-add-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, posts }),
      });

      const result = await response.json();

      if (result.success) {
        setBulkAddVisible(false);
        setDownloadExcelVisible(true);
      }
    } catch (error) {
      console.error('Error adding posts:', error);
    }
  };

  const downloadExcel = async () => {
    try {
      // Send a GET request to your server to initiate the download of an Excel file
      const response = await fetch(`http://localhost:3000/api/download-excel?userId=${userId}`);

      // Handle the file download
      // You may need to implement logic for handling the file in your frontend
    } catch (error) {
      console.error('Error downloading Excel:', error);
    }
  };

  return (
    <div className='post-page-container'>
      <h1 className='post-page-heading'>Post Page</h1>
      <p>User ID: {userId}</p>
      <table border="1">
        <thead>
          <tr>
            <th>Title</th>
            <th>Body</th>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post.id}>
              <td>{post.title || 'N/A'}</td>
              <td>{post.body || 'N/A'}</td>
              <td>{name || 'N/A'}</td>
              <td>{email || 'N/A'}</td>
              <td>{company || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {bulkAddVisible && <button onClick={bulkAddPosts}>Bulk Add</button>}
      {downloadExcelVisible && <button onClick={downloadExcel}>Download in Excel</button>}
    </div>
  );
}

export default PostPage;


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// function PostPage() {
//   const { userId } = useParams();
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [company, setCompany] = useState('');

//   const [posts, setPosts] = useState([]);
//   const [bulkAddVisible, setBulkAddVisible] = useState(true);
//   const [downloadExcelVisible, setDownloadExcelVisible] = useState(false);

//   useEffect(() => {
//     // Fetch data from the API for the specific userId
//     const fetchData = async () => {
//       try {
//         const userResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
//         const userData = await userResponse.json();
//         setName(userData.name || 'N/A');
//         setEmail(userData.email || 'N/A');
//         setCompany(userData.company || 'N/A');

//         const postsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
//         const postsData = await postsResponse.json();
//         setPosts(postsData);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, [userId]);

//   const bulkAddPosts = async () => {
//     try {
//       // Send a POST request to your server to store the posts in the database
//       const response = await fetch('http://localhost:3000/api/bulk-add-posts', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ userId, posts }),
//       });

//       // Handle the response from the server
//       const result = await response.json();

//       if (result.success) {
//         setBulkAddVisible(false);
//         setDownloadExcelVisible(true);
//       }
//     } catch (error) {
//       console.error('Error adding posts:', error);
//     }
//   };

//   const downloadExcel = async () => {
//     try {
//       // Send a GET request to your server to initiate the download of an Excel file
//       const response = await fetch(`http://localhost:3000/api/download-excel?userId=${userId}`);
      
//       // Handle the file download
//       // You may need to implement logic for handling the file in your frontend
//     } catch (error) {
//       console.error('Error downloading Excel:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Post Page</h1>
//       <p>User ID: {userId}</p>
//       <table border="1">
//         <thead>
//           <tr>
//             <th>Title</th>
//             <th>Body</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Company</th>
//           </tr>
//         </thead>
//         <tbody>
//           {posts.map(post => (
//             <tr key={post.id}>
//               <td>{post.title || 'N/A'}</td>
//               <td>{post.body || 'N/A'}</td>
//               <td>{name || 'N/A'}</td>
//               <td>{email || 'N/A'}</td>
//               <td>{company && company.name ? company.name : 'N/A'}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {bulkAddVisible && <button onClick={bulkAddPosts}>Bulk Add</button>}
//       {downloadExcelVisible && <button onClick={downloadExcel}>Download in Excel</button>}
//     </div>
//   );
// }

// export default PostPage;





