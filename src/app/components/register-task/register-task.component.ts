import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-register-task',
  templateUrl: './register-task.component.html',
  styleUrls: ['./register-task.component.css']
})
export class RegisterTaskComponent {

  // construtor.
  constructor(private formBuilder: FormBuilder,
    private taskService: TaskService) { }

  // variável que conterá todos os controles dos inputs da página.
  form: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(5)]]
  });

  // método que verifica se o campo em questão foi preenchido cumprindo as regras impostas, adicionando classes para cada ocasião.
  validateField(field: string): string {
    const control = this.form.controls[field];
    if(control.touched) {
      return control.errors ? 'is-invalid' : 'is-valid';
    }
    return '';
  }

  // método que chama o taskService passando uma nova Task para ser armazenada.
  createTask(event: any): void {
    // impede que o botão tenha seu comportamento padrão (recarregar a página).
    event.preventDefault();
    event.stopPropagation();

    // pega a variável "name" dos controles de input.
    const { name } = this.form.controls;

    // caso todas as regras forem cumpridas pelo usuário uma nova tarefa será adicionada ao programa.
    if(this.form.valid) {
      // toast customizado criado para exibir quando uma tarefa é adicionada com sucesso.
      const toast = document.querySelector('.custom-toast') as HTMLDivElement;

      this.taskService.createTask(new Task(new Date().getTime().toString(), name.value, false));
      this.form.reset();
      
      // definindo que o toast será exibido durante 5 segundos.
      toast.style.right = '1rem';
      setTimeout(() => {
        toast.style.right = '-20rem';
      }, 5000)
    }
  }

}
