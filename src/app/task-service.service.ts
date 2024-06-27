/**
 * Title: task-service.service.ts
 * Author: Jeremy Lates
 * Date: 06-22-2024
 * Attributions:
 * Code Adapted from Professor Krasso's class material and github resource https://github.com/buwebdev
 */

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Item } from "./tasks/item.interface";

@Injectable({
  providedIn: "root",
})
export class TaskServiceService {
  constructor(private httpClient: HttpClient) {}

  deleteTask(empId: number, taskId: string) {
    return this.httpClient.delete(`/api/employees/${empId}/tasks/${taskId}`);
  }

  updateTask(empId: number, todo: Item[], done: Item[]) {
    console.log("Made it to the updateTask service...");

    return this.httpClient.put("/api/employees/" + empId + "/tasks", {
      todo,
      done,
    });
  }
}
