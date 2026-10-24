# Employee App - Backend Integration (Assignment 3)

A full-stack Node.js, Express, and MongoDB Atlas application integrating a pre-built Angular frontend for managing employee records.

---

## 📋 Features & Implemented APIs

| HTTP Method | Endpoint | Description | Request Body |
|-------------|----------|-------------|--------------|
| `GET` | `/api/employeelist` | Fetch all employees | None |
| `GET` | `/api/employeelist/:id` | Fetch single employee by ID | None |
| `POST` | `/api/employeelist` | Add a new employee | `{ "name": "...", "location": "...", "position": "...", "salary": 50000 }` |
| `PUT` | `/api/employeelist` | Update employee | `{ "_id": "...", "name": "...", "location": "...", "position": "...", "salary": 60000 }` |
| `DELETE` | `/api/employeelist/:id` | Delete employee by ID | None |

> The application also serves the built Angular frontend directly at `http://localhost:3000`.

---

## 🛠️ Tech Stack & Dependencies

- **Node.js**
- **Express.js** (`express`)
- **Mongoose** (`mongoose`) - MongoDB ODM
- **CORS** (`cors`) - Cross-Origin Resource Sharing
- **Dotenv** (`dotenv`) - Environment variable management
- **MongoDB Atlas** - Cloud database

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/agna0247/employee-app-backend.git
cd employee-app-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (or use the pre-configured fallback in `app.js`):
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.hbwodbo.mongodb.net/EmployeeDB?retryWrites=true&w=majority
```

### 4. Run the Application
```bash
npm start
```
or
```bash
node app.js
```

### 5. Access the Application
Open your web browser and navigate to:
```
http://localhost:3000
```
