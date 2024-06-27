/**
 * Title: employee-route.js
 * Author: Jeremy Lates
 * Date: 06-08-2024
 * Attributions:
 * Code Adapted from Professor Krasso's class material and github resource https://github.com/buwebdev
 */

"use strict";

const express = require("express");
const { mongo } = require("../utils/mongo");
const createError = require("http-errors");

const router = express.Router();

//const { default: Ajv } = require("ajv");
const Ajv = require("ajv");
const { ObjectId } = require("mongodb");

const ajv = new Ajv(); //Create a new instance of the Ajv object from the npm package

/**
 * findEmployeeById
 * @openapi
 * /api/employees/{empId}:
 *   get:
 *     tags:
 *       - Employees
 *     description:  API for returning a employee document
 *     summary: returns a employee document
 *     parameters:
 *       - name: empId
 *         in: path
 *         required: true
 *         description: Employees document empId
 *         schema:
 *           type: number
 *     responses:
 *       '200':
 *         description: Employee document
 *       '400':
 *         description: Input was not a number
 *       '404':
 *         description: Employee not found
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get("/:empId", (req, res, next) => {
  try {
    let { empId } = req.params;
    empId = parseInt(empId, 10);

    //Early return - design pattern
    if (isNaN(empId)) {
      console.error("Input must be a number");
      return next(createError(400, "Input was not a number"));
    }

    //Database query is handled
    mongo(async (db) => {
      const employee = await db.collection("employees").findOne({ empId });

      if (!employee) {
        console.error("Employee not found:", empId);
        return next(createError(404, "Employee not found"));
      }

      res.send(employee);
    }, next);
  } catch (err) {
    console.error("Error: ", err);
    next(err);
  }
});

/**
 * findAllTasks
 * @openapi
 * /api/employees/{empId}/tasks:
 *   get:
 *     tags:
 *       - Employees
 *     description:  API for returning a employee document
 *     summary: returns a employee document
 *     parameters:
 *       - name: empId
 *         in: path
 *         required: true
 *         description: Employees document empId
 *         schema:
 *           type: number
 *     responses:
 *       '200':
 *         description: Employee document
 *       '400':
 *         description: Input was not a number
 *       '404':
 *         description: Employee not found
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get("/:empId/tasks", (req, res, next) => {
  try {
    let { empId } = req.params;
    empId = parseInt(empId, 10);

    //Determine if the returned value from parseInt is NaN
    if (isNaN(empId)) {
      return next(createError(400, "Employee Id must be a number"));
    }

    //Call Mongo module and return a list of tasks by employee Id
    mongo(async (db) => {
      const tasks = await db
        .collection("employees")
        .findOne(
          { empId: empId },
          { projection: { empId: 1, todo: 1, done: 1 } }
        );

      console.log("tasks: ", tasks);

      //If there are no tasks found for the employee id; return 404 error object to our middleware handler
      if (!tasks) {
        return next(
          createError(404, `Tasks not found for employee Id ${empId}`)
        );
      }

      res.send(tasks);
    }, next);
  } catch (err) {
    console.error("err", err);
  }
});

//Create Task API
/**
 * createTask
 * @openapi
 * /api/employees/{empId}/tasks:
 *   post:
 *     tags:
 *       - Employees
 *     name: createTask
 *     summary: Creates a new task document
 *     requestBody:
 *       description: task information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - _id
 *               - text
 *             properties:
 *               _id:
 *                 type: number
 *               text:
 *                 type: string
 *               dependents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: number
 *                     text:
 *                       type: string
 *     responses:
 *       '200':
 *         description: Person added to MongoDB Atlas
 *       '400':
 *         description: Employee ID must be a number
 *       '404':
 *         description: Employee not found with empId
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

const taskSchema = {
  type: "object",
  properties: { text: { type: "string" } },
  required: ["text"],
  additionalProperties: false,
};

router.post("/:empId/tasks", (req, res, next) => {
  try {
    //Check if the empId from the req params is a number
    let { empId } = req.params;
    empId = parseInt(empId, 10);

    //Check to see if the parseInt returns a number of NaN: if NaN it means the empId is not a number
    if (isNaN(empId)) {
      return next(createError(400, "Employee ID must be a number"));
    }

    mongo(async (db) => {
      const employee = await db
        .collection("employees")
        .findOne({ empId: empId });

      //If the employee is not found return 404 error
      if (!employee) {
        return next(createError(404, "Employee not found with empId ", empId));
      }

      const { text } = req.body;

      const validator = ajv.compile(taskSchema);
      const valid = validator({ text });

      //If the pay,oad is not valid return, a 400 error and append the errors to the err.errors property
      if (!valid) {
        return next(createError(400, "Invalid task payload", validator.errors));
      }

      //Create the object literal to add to the employee collection
      const newTask = {
        _id: new ObjectId(),
        text: text,
      };

      //Call the mongo module and update the employee collection with the new task in the todo column
      const result = await db
        .collection("employees")
        .updateOne({ empId: empId }, { $push: { todo: newTask } });

      if (!result.modifiedCount) {
        return next(createError(400, "Unable to create task"));
      }

      res.status(201).send({ id: newTask._id });
    }, next);
  } catch (err) {
    console.error("err ", err);
  }
});

//Update Task API
/**
 * updateTaskByEmpId
 * @openapi
 * /api/employees/{empId}/tasks:
 *   put:
 *     tags:
 *       - Employees
 *     name: updateTaskByEmpId
 *     description: API for updating an existing document in MongoDB.
 *     summary: Updates a document in MongoDB.
 *     parameters:
 *       - name: empId
 *         in: path
 *         required: true
 *         description: Id to filter the collection by.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: employee task information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - empId
 *             properties:
 *               empId:
 *                 type: string*
 *     responses:
 *       '204':
 *         description: task updated
 *       '400':
 *         description: Employee ID must be a number or invalid task payload
 *       '404':
 *         description: Employee not found
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
const tasksSchema = {
  type: "object",
  required: ["todo", "done"],
  additionalProperties: false,
  properties: {
    todo: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _id: { type: "string" },
          text: { type: "string" },
        },
        required: ["_id", "text"],
        additionalProperties: false,
      },
    },
    done: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _id: { type: "string" },
          text: { type: "string" },
        },
        required: ["_id", "text"],
        additionalProperties: false,
      },
    },
  },
};

router.put("/:empId/tasks", (req, res, next) => {
  console.log("Entered update here...");
  try {
    let { empId } = req.params;

    empId = parseInt(empId, 10);

    console.log("empId: ", empId);

    //Check if employee id is a number
    if (isNaN(empId)) {
      return next(createError(400, "Employee ID must be a number"));
    }

    //Make database call
    mongo(async (db) => {
      const employee = await db
        .collection("employees")
        .findOne({ empId: empId });

      console.log("Found employee....");

      //Check to see if employee is found
      if (!employee) {
        console.log("empId: ", empId);
        return next(createError(404, `Employee not found with empId ${empId}`));
      }

      const tasks = req.body;

      console.log("tasks: ", tasks);

      const validator = ajv.compile(tasksSchema);
      const valid = validator(tasks);

      console.log("valid: ", valid);

      //Must be an invalid payload
      if (!valid) {
        return next(
          createError(400, "Invalid task payload ", validator.errors)
        );
      }

      console.log("Valid payload....");

      //Update tasks
      const result = await db
        .collection("employees")
        .updateOne(
          { empId: empId },
          { $set: { todo: tasks.todo, done: tasks.done } }
        );

      //console.log("Made it to send confirmation before 404");
      //Send confirmation
      res.status(204).send();
    }, next);

    //Catch database errors
  } catch (err) {
    console.error("err ", err);
    next(err);
  }
});

//Delete API
/**
 * deleteTaskById
 * @openapi
 * /api/employees/{empId}/tasks/{taskId}:
 *   delete:
 *     tags:
 *       - Employees
 *     name: deleteTaskById
 *     description: API for deleting a document from MongoDB.
 *     summary: Removes a document from MongoDB.
 *     parameters:
 *       - name: empId
 *         in: path
 *         required: true
 *         description: EmpId of the document to remove.
 *         schema:
 *           type: string
 *       - name: taskId
 *         in: path
 *         required: true
 *         description: TaskId of the document to remove.
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: task deleted
 *       '400':
 *         description: Employee ID must be a number
 *       '404':
 *         description: Employee not found
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.delete("/:empId/tasks/:taskId", (req, res, next) => {
  try {
    //Get empId and taskId from call
    let { empId } = req.params;
    let { taskId } = req.params;

    //validate that they do not pass something other than a number in for empId
    empId = parseInt(empId, 10);
    if (isNaN(empId)) {
      return next(createError(400, "Employee ID must be a number"));
    }

    //call database and find employee record
    mongo(async (db) => {
      let emp = await db.collection("employees").findOne({ empId: empId });

      //Can't find employee id passed in
      if (!emp) {
        return next(createError(404, `Employee not found with empId ${empId}`));
      }

      if (!emp.todo) emp.todo = [];
      if (!emp.done) emp.done = [];

      const todo = emp.todo.filter(
        (t) => t._id.toString() !== taskId.toString()
      );
      const done = emp.done.filter(
        (t) => t._id.toString() !== taskId.toString()
      );

      const result = await db
        .collection("employees")
        .updateOne({ empId: empId }, { $set: { todo: todo, done: done } });

      res.status(204).send();
    }, next);

    //Catch any database call errors
  } catch (err) {
    console.error("err ", err);
    next(err);
  }
});

module.exports = router;
