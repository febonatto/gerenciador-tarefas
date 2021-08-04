import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.css']
})
export class UpdateTaskComponent implements OnInit {

  // variáveis.
  task: Task | undefined = undefined;

  // construtor.
  constructor(private formBuilder: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute) { }

    // quando o componente for iniciado esse método irá adquirir o id enviado na URL e chamará a função "getTaskById" do taskService
    // e armazenará o retorno na variável local "task".
  ngOnInit(): void {
    // pegando o id da URL.
    const id = this.route.snapshot.params['id'];
    this.task = this.taskService.getTaskById(id);

    // atribuindo o valor do nome adquirido pela Task retornada pela função "getTaskById" ao campo name dos controles de input.
    this.form.controls['name'].setValue(this.task?.name);
  }

  // variável que conterá todos os controles dos inputs da página.
  form: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(5)]]
  })

  // método que verifica se o campo em questão foi preenchido cumprindo as regras impostas, adicionando classes para cada ocasião.
  validateField(field: string): string {
    const control = this.form.controls[field];
    if(control.touched) {
      return control.errors ? 'is-invalid' : 'is-valid';
    }
    return '';
  }

  // método que chama o taskService passando a alteração necessária para uma Task pelo seu id.
  updateTask(event: any): void {
    // impede que o botão tenha seu comportamento padrão (recarregar a página).
    event.preventDefault();
    event.stopPropagation();

    // pega a variável "name" dos controles de input.
    const { name } = this.form.controls;

    // caso todas as regras forem cumpridas pelo usuário uma nova tarefa será adicionada ao programa.
    if(this.form.valid) {
      // toast customizado criado para exibir quando uma tarefa é alterada com sucesso.
      const toast = document.querySelector('.custom-toast') as HTMLDivElement;

      if(this?.task) this.taskService.updateTask(this.task.id, name.value);
            
      // definindo que o toast será exibido durante 5 segundos.
      toast.style.right = '1rem';
      setTimeout(() => {
        toast.style.right = '-20rem';
      }, 5000)
    }
  }

}
