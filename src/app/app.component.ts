import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Task } from './models/task';
import { TasksService } from './services/tasks.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class AppComponent implements OnInit {
  constructor(private readonly service: TasksService) {}

  readonly loading = signal(false);
  readonly tasks = signal<Task[]>([]);

  readonly empty = computed(() => {
    return !this.loading() && this.tasks().length === 0;
  });

  task = new FormControl('');
  active = new FormControl(false);

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(): void {
    try {
      this.loading.set(true);
      this.service.getTasks().subscribe((tasks) => {
        this.tasks.set(tasks);
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Couldn't load all the tasks! Please try again.",
        confirmButtonText: 'Ok!',
      });
    } finally {
      this.loading.set(false);
    }
  }

  addTask(): void {
    try {
      if (this.task.value == null || this.active.value == null) return;

      if (this.task.value.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Attention!',
          text: 'Fill in the Task field to create a task!',
        });
        return;
      }

      this.loading.set(true);
      this.service
        .addTask(this.task.value, this.active.value)
        .subscribe((task) => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Task successfully created!',
          });
          this.tasks.set([...this.tasks(), task]);
        });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Couldn't create task! Please try again.",
        confirmButtonText: 'Ok!',
      });
    } finally {
      this.loading.set(false);
    }
  }

  toggleTask(task: Task): void {
    try {
      this.loading.set(true);
      task.active = !task.active;

      this.service.updateTask(task).subscribe((t) => {
        this.tasks.set(this.tasks().map((tk) => (tk.id === t.id ? t : tk)));

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Task successfully updated!',
          confirmButtonText: 'Ok!',
        });
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Couldn't update task! Please try again.",
        confirmButtonText: 'Ok!',
      });
    } finally {
      this.loading.set(false);
    }
  }

  deleteTask(id: number): void {
    Swal.fire({
      icon: 'question',
      title: 'Delete task!',
      text: 'Are you ready?',
      confirmButtonText: 'Yes',
      confirmButtonColor: '#008631',
      cancelButtonText: 'No',
      showCancelButton: true,
    }).then((r) => {
      if (r.value) {
        this.loading.set(true);
        this.service.deleteTaskById(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Task successfully deleted!',
            });

            this.loading.set(false);
            this.getTasks();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'We can`t deleted your task! Try again.',
            });

            this.loading.set(false);
          },
        });
      }
    });
  }
}
