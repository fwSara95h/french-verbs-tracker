# French Verbs Management System

This project implements a simple single-page application (SPA) for managing French verbs, allowing users to add new verbs, view them in alphabetical order, and mark them as conjugated. The front-end is built using plain HTML, CSS, and JavaScript, while the backend uses Node.js and Express to handle CRUD operations with a MySQL database.

## Project Structure

```graphql
project-root/
│
├── public/                      # Public files accessible to the front-end
│   └── index.html               # Single HTML file containing the entire front-end
│
├── sql/                         # Folder containing SQL files
│   ├── create_db_and_table.sql  # SQL script for creating the database and table
│   └── sample_inserts.sql       # SQL script for inserting sample data into the table
│
├── src/                         # Source files for the Node.js server
│   ├── server.js                # Entry point for the Node.js application
│   └── ...                      # Additional backend source files (e.g., controllers, models)
│
├── node_modules/                # Node.js packages (not checked into version control)
│
├── package.json                 # Node.js project manifest with metadata and dependencies
├── package-lock.json            # Automatically generated file for any operations where npm modifies either the node_modules tree or package.json
└── README.md                    # Documentation providing an overview of the project, setup, and usage instructions
```

## Prerequisites

Before setting up the project, ensure you have the following installed:
- Node.js (Download [here](https://nodejs.org/))
- MySQL (Installation guide [here](https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/))

## Setting Up

### Database Setup

1. Start your MySQL server.
2. Run the SQL scripts located in the `sql/` directory:
   - `create_db_and_table.sql` to create the database and the verbs table.
   - `sample_inserts.sql` to populate the table with sample data.

### Application Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd <project-directory>
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the Node.js server:
   ```bash
   npm start
   ```
2. Open a web browser and navigate to `http://localhost:3000` to view the application.

## Features

- **Add New Verbs**: Enter a French verb to add to the database. If the verb already exists, a notification is shown.
- **View Verbs**: All verbs are displayed in alphabetical order with their conjugation status.
- **Mark as Conjugated**: Each verb can be marked as conjugated, which changes its appearance to indicate this status.
- **Conjugation Details**: Hover over any verb to see its meaning. Click on a verb to visit its conjugation link.

## Contributing

Contributions to this project are welcome! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your updates (`git commit -am 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a new Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

This `README.md` is designed to be both functional and user-friendly, covering all the necessary steps to get the project running, along with descriptions of the directory structure and how to contribute to the project. Adjust the `<repository-url>` and `<project-directory>` placeholders according to your actual repository's details.