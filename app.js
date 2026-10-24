// Task1: initiate app and run server at 3000
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));
app.use(express.static(path.join(__dirname, 'dist', 'Frontend')));
// Task2: create mongoDB connection 
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb+srv://agna225502_db_user:Agnajyomi9@cluster0.hbwodbo.mongodb.net/EmployeeDB?retryWrites=true&w=majority';

if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
        .then(() => {
            console.log('Successfully connected to MongoDB Atlas');
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err.message);
        });
} else {
    console.warn('Warning: MONGODB_URI is not set in environment or .env file');
}

// Employee Schema & Model
const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    position: {
        type: String,
        required: [true, 'Position is required'],
        trim: true
    },
    salary: {
        type: Number,
        required: [true, 'Salary is required']
    }
}, { versionKey: false });

const Employee = mongoose.model('Employee', employeeSchema);

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below

// Helper to check valid MongoDB ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Handlers supporting both /api/employeelist and /employees
const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve employees', details: err.message });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        let employee = null;
        if (isValidId(id)) {
            employee = await Employee.findById(id);
        } else {
            employee = await Employee.findOne({ name: id });
        }
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve employee', details: err.message });
    }
};

const addEmployee = async (req, res) => {
    try {
        const { name, location, position, salary } = req.body;
        if (!name || !location || !position || salary === undefined || salary === null || salary === '') {
            return res.status(400).json({ error: 'All fields (name, location, position, salary) are required' });
        }
        const newEmployee = new Employee({
            name,
            location,
            position,
            salary: Number(salary)
        });
        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch (err) {
        res.status(400).json({ error: 'Failed to add employee', details: err.message });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const id = req.params.id || req.body._id || req.body.id;
        let deletedEmployee;
        if (id) {
            if (!isValidId(id)) {
                return res.status(400).json({ error: 'Invalid employee ID format' });
            }
            deletedEmployee = await Employee.findByIdAndDelete(id);
        } else if (req.body.name) {
            deletedEmployee = await Employee.findOneAndDelete({ name: req.body.name });
        } else {
            return res.status(400).json({ error: 'Employee ID or name is required' });
        }

        if (!deletedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully', employee: deletedEmployee });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete employee', details: err.message });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const id = req.params.id || req.body._id || req.body.id;
        const updateData = {};
        if (req.body.name !== undefined) updateData.name = req.body.name;
        if (req.body.location !== undefined) updateData.location = req.body.location;
        if (req.body.position !== undefined) updateData.position = req.body.position;
        if (req.body.salary !== undefined) updateData.salary = Number(req.body.salary);

        let updatedEmployee;
        if (id) {
            if (!isValidId(id)) {
                return res.status(400).json({ error: 'Invalid employee ID format' });
            }
            updatedEmployee = await Employee.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
        } else if (req.body.name) {
            updatedEmployee = await Employee.findOneAndUpdate(
                { name: req.body.name },
                updateData,
                { new: true, runValidators: true }
            );
        } else {
            return res.status(400).json({ error: 'Employee ID or name is required for update' });
        }

        if (!updatedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json(updatedEmployee);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update employee', details: err.message });
    }
};

//TODO: get data from db  using api '/api/employeelist'
app.get('/api/employeelist', getAllEmployees);
app.get('/employees', getAllEmployees);

//TODO: get single data from db  using api '/api/employeelist/:id'
app.get('/api/employeelist/:id', getEmployeeById);
app.get('/employees/:id', getEmployeeById);

//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.post('/api/employeelist', addEmployee);
app.post('/employees', addEmployee);

//TODO: delete a employee data from db by using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', deleteEmployee);
app.delete('/api/employeelist', deleteEmployee);
app.delete('/employees/:id', deleteEmployee);
app.delete('/employees', deleteEmployee);

//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.put('/api/employeelist', updateEmployee);
app.put('/api/employeelist/:id', updateEmployee);
app.put('/employees/:id', updateEmployee);
app.put('/employees', updateEmployee);

//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});
