/**
 * Title: tasks.component.ts
 * Author: Jeremy Lates
 * Date: 06-08-2024
 * Attributions:
 * Code Adapted from Professor Krasso's class material and github resource https://github.com/buwebdev
 */
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { HttpClient } from "@angular/common/http";
import { TaskServiceService } from "../task-service.service";
/*
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
 */

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";

import { Item } from "./item.interface";

/*
export interface Item {
  _id: string;
  text: string;
}
  */

export interface Employee {
  empId: number;
  todo: Item[];
  done: Item[];
}

@Component({
  selector: "app-tasks",
  templateUrl: "./tasks.component.html",
  styleUrls: ["./tasks.component.css"],
  // imports: [CdkDrag],
  //standalone: true,
})
export class TasksComponent {
  //Local Variables
  empId: number;
  employee: Employee;
  todo: Item[];
  done: Item[];
  errorMessage: string;
  successMessage: string;
  doneList: string;
  todoList: string;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private taskService: TaskServiceService
  ) {
    this.empId = parseInt(this.cookieService.get("session_user"), 10);
    this.employee = {} as Employee;
    this.todoList = "";
    this.todo = [];
    this.doneList = "";
    this.done = [];
    this.errorMessage = "";
    this.successMessage = "";

    this.http.get(`/api/employees/${this.empId}/tasks`).subscribe({
      next: (emp: any) => {
        this.employee = emp;
      },
      error: () => {
        console.log(
          "Unable to get employee data for employee ID: ",
          this.empId
        );
      },
      complete: () => {
        this.todo = this.employee.todo ?? [];
        this.done = this.employee.done ?? [];
      },
    });
  }
  createTask(form: NgForm) {
    if (form.valid) {
      const todoTask = form.value.task;

      this.http
        .post(`/api/employees/${this.empId}/tasks`, { text: todoTask })
        .subscribe({
          next: (result: any) => {
            const newTodoItem = {
              _id: result.id,
              text: todoTask,
            };
            this.todo.push(newTodoItem);
          },
          error: (err) => {
            console.error(
              "Unable to create task for employee: " + this.empId,
              err
            );
          },
        });
    }
  }
  //delete task
  deleteTask(taskId: string) {
    console.log(`Task item to delete: ${taskId}`);

    //confirm dialog
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    this.taskService.deleteTask(this.empId, taskId).subscribe({
      next: (res: any) => {
        console.log("Task deleted with id ", taskId);

        if (!this.todo) this.todo = []; //if the todo array is null set it to an empty array
        if (!this.done) this.done = []; //if this done array is null set it to an empty array

        //We are doing this because we do not know if the task is in the todo or done array
        this.todo = this.todo.filter((t) => t._id.toString() !== taskId); //filter the task array and remove the deleted task
        this.done = this.done.filter((t) => t._id.toString() !== taskId); //filter the task array and remove the deleted task

        this.successMessage = "Task deleted successfully!"; //Set the success message

        this.hideAlert();
      },
      error: (err) => {
        console.log("error ", err);
        this.errorMessage = err.message;
        this.hideAlert();
      },
    });
  }
  //Update Task List
  updateTaskList(empId: number, todo: Item[], done: Item[]) {
    console.log("Made it to the updateTaskList function....");

    this.taskService.updateTask(empId, todo, done).subscribe({
      next: (res: any) => {
        console.log("Task updated successfully");
      },
      error: (err) => {
        console.log("error", err);
        this.errorMessage = err.message;
        this.hideAlert();
      },
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    //Error: Not making it to drop event....

    console.log("Made it to dop function...");

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      //If the item is dropped in a different container, move it to the new container
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      console.log("Moved item in array", event.container.data);

      //Call the updateTaskList() function and pass in the empId, todo, done arrays
      this.updateTaskList(this.empId, this.todo, this.done);
    }
  }
  hideAlert() {
    setTimeout(() => {
      this.errorMessage = "";
      this.successMessage = "";
    }, 3000);
  }
}
