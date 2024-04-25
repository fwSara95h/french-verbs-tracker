## Project Overview

This project is a web application for managing a list of French verbs, including their meanings, conjugation statuses, and links to detailed conjugation pages. The application utilizes a Node.js server with an Express framework, interfacing with a MySQL database, and serves a single-page application (SPA) that allows for CRUD operations on the verbs.

## File Structure

```
french-verbs-tracker/
│
├── public/                      # Public files accessible to the front-end
│   ├── index.html               # HTML file containing SPA structure and styling
│   └── script.js                # JavaScript file handling client-side logic
│
├── sql/                         # Folder containing SQL setup scripts
│   ├── create_db_and_table.sql  # SQL script for creating the database and verbs table
│   └── sample_inserts.sql       # SQL script for inserting sample data into the table
│
├── src/                         # Source files for the Node.js server
│   └── server.js                # Main server file with API endpoints
│
├── package.json                 # Node.js project manifest with metadata and dependencies
├── package-lock.json            # Automatically generated for any operations where npm modifies either the node_modules tree or package.json
└── README.md                    # This file; provides an overview and setup instructions
```

## Local Setup Instructions

### Requirements

- Node.js
- npm (Node Package Manager)
- MySQL Server

### Step-by-Step Setup

#### 1. Clone the repository
Clone the repository to your local machine:
```bash
git clone https://github.com/fwSara95h/french-verbs-tracker.git
cd french-verbs-tracker
```

#### 2. Install dependencies
Install Node.js dependencies defined in `package.json`:
```bash
npm install
```

#### 3. Database Setup
Set up the MySQL database using the provided SQL scripts:

- **Create Database and Table**:
  Execute the SQL script `create_db_and_table.sql` to set up the database and the verbs table.
  ```sql
  CREATE DATABASE IF NOT EXISTS francais_db;
  USE francais_db;
  CREATE TABLE IF NOT EXISTS verbs (
      infinitif VARCHAR(255) NOT NULL UNIQUE,
      meaning VARCHAR(255),
      conjugated BOOLEAN DEFAULT FALSE,
      conjugation_link VARCHAR(2048),
      PRIMARY KEY (infinitif)
  );
  ```
- **Insert Sample Data** (optional):
  Populate the database with initial data using `sample_inserts.sql`.

#### 4. Configure Server
Modify `src/server.js` to include the correct database credentials:
```javascript
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'francais_db',
    port: 3306
});
```

#### 5. Run the Server
Start the server with the following command:
```bash
node src/server.js
```
This will start the server on `http://localhost:3000`.

#### 6. Access the Application
Open a web browser and go to `http://localhost:3000` to view and interact with the application.

## Features

- **Create**: Add new verbs with their meanings and conjugation links.
- **Read**: View all verbs in a dynamically updated list.
- **Update**: Mark verbs as conjugated or not.
- **Delete**: Remove verbs from the list.

This setup ensures a functional local development environment for managing the web application. Follow the instructions carefully to set up and start using the application.