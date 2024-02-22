const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); // Import cors module
const axios= require('axios');
const excel = require('exceljs');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Set up SQLite database
const db = new sqlite3.Database('./users.db');
// const db = new sqlite3.Database('./users.db');

// Create users table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    city TEXT,
    company TEXT
  )
`);

app.get('/api/all-users', async (req, res) => {
    console.log('Request received to /api/all-users');
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      const usersFromAPI = response.data;
  
      // Instead of sending an empty array, send the fetched data
      res.json(usersFromAPI);
    } catch (error) {
      console.error('Failed to fetch data from API:', error);
      res.status(500).json({ error: 'Failed to fetch data from API' });
    }
  });
  
  

app.post('/api/add-user', (req, res) => {
    const user = req.body;
    console.log(user);
  
    // Check if the user already exists in the database
    db.get('SELECT * FROM users WHERE email = ?', [user.email], (err, existingUser) => {
      if (err) {
        console.error('Error checking user existence:', err);
        res.status(500).json({ error: 'Failed to check user existence' });
      } else if (existingUser) {
        // User exists, send a response to show "Open" button
        res.json({ openButton: true, user: existingUser });
      } else {
        // User doesn't exist, insert into the database
        db.run('INSERT INTO users (name, email, phone, website, city, company) VALUES (?, ?, ?, ?, ?, ?)',
          [user.name, user.email, user.phone, user.website, user.city, user.company.name], (err) => {
            if (err) {
              console.error('Error adding user to the database:', err);
              res.status(500).json({ error: 'Failed to add user to the database' });
            } else {
              // User added successfully, send a response to show "Open" button
              res.json({ openButton: true, user });
            }
        });
      }
    });
  });
  
// Express route to open the Post page
app.get('/post/:userId', (req, res) => {
  const userId = req.params.userId;

  // Fetch user data from the database based on the userId
  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Render the Post page with user data
    res.json({ user: row });
  });
});
app.post('/api/bulk-add-posts', (req, res) => {
    const { userId, posts } = req.body;
    console.log(req.body);
  
    // Your logic to store posts in the database
  
    // For demonstration purposes, assume the posts were successfully stored
    const result = { success: true };
  
    res.json(result); // Send a JSON response
  });
  
  // Add this endpoint to your server code

//   app.get('/api/download-excel', (req, res) => {
//     const userId = req.query.userId;
//     console.log("doenload", userId);
  
//     // Your logic to fetch data and generate Excel content
//     const workbook = new excel.Workbook();
//     const worksheet = workbook.addWorksheet('Sheet 1');
//     worksheet.columns = [
//       { header: 'Title', key: 'title' },
//       { header: 'Body', key: 'body' },
//       // Add more columns as needed
//     ];
  
//     // Your logic to populate worksheet with data
  
//     // Save the Excel file to the specified path
//     const filePath = `D:\\path\\to\\your\\generated\\excel\\file.xlsx`;
//     workbook.xlsx.writeFile(filePath)
//       .then(() => {
//         // Send the file to the client for download
//         res.sendFile(filePath, { headers: { 'Content-Disposition': 'attachment; filename=file.xlsx' } });
//       })
//       .catch((error) => {
//         console.error('Error writing Excel file:', error);
//         res.status(500).json({ error: 'Failed to generate Excel file' });
//       });
//   });
app.get('/api/download-excel', async (req, res) => {
    const userId = req.query.userId;
    console.log("download", userId);
  
    try {
      // Your logic to fetch posts for the given userId from the database
      const posts = await fetchPostsFromDatabase(userId);
  
      // Create a new workbook and add a worksheet
      const workbook = new excel.Workbook();
      const worksheet = workbook.addWorksheet('Posts');
  
      // Define columns in the worksheet
      worksheet.columns = [
        { header: 'Title', key: 'title' },
        { header: 'Body', key: 'body' },
        // Add more columns as needed
      ];
  
      // Add posts data to the worksheet
      posts.forEach((post) => {
        worksheet.addRow(post);
      });
  
      // Save the Excel file to the specified path
      const filePath = `D:\\path\\to\\your\\generated\\excel\\file.xlsx`;
  
      // Ensure the directory exists before attempting to write the file
      await ensureDirectoryExistence(filePath);
  
      // Write the workbook to the file
      await workbook.xlsx.writeFile(filePath);
  
      // Send the file to the client for download
      res.sendFile(filePath, { headers: { 'Content-Disposition': 'attachment; filename=file.xlsx' } });
    } catch (error) {
      console.error('Error generating or sending Excel file:', error);
      res.status(500).json({ error: 'Failed to generate or send Excel file' });
    }
  });
  
  async function ensureDirectoryExistence(filePath) {
    const directory = filePath.substring(0, filePath.lastIndexOf('\\'));
    await fs.mkdir(directory, { recursive: true });
  }
  
  async function fetchPostsFromDatabase(userId) {
    // Your logic to fetch posts for the given userId from the database
    // Example: return an array of posts
    return [
      { title: 'Post 1 Title', body: 'Post 1 Body' },
      { title: 'Post 2 Title', body: 'Post 2 Body' },
      // Add more posts as needed
    ];
  }
  
  
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
