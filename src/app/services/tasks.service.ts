import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly baseApiUrl: string = 'http://localhost:8080/tasks';

  constructor(private readonly http: HttpClient) {}

  addTask(description: string, active: boolean): Observable<Task> {
    return this.http.post<Task>(this.baseApiUrl, {
      description,
      active
    });
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseApiUrl);
  }

  getTaskById(id: number): Observable<Task | null> {
    return this.http.get<Task | null>(`${this.baseApiUrl}/${id}`);
  }

  deleteTaskById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseApiUrl}/${id}`);
  }
}
