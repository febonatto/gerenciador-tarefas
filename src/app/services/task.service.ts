import { Injectable } from '@angular/core';

import { Task } from '../models/task.model';
import { Ordering } from '../utils/order.enum';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  // variáveis.
  tasks: Array<Task> = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasksSize: number = this.tasks.length;
  static readonly LIMIT_PER_PAGE = 3;

  // construtor.
  constructor() { }

  // método que adiciona uma nova tarefa ao local storage e a variável tasks: Array<Task> local.
  createTask(task: Task): void {
    // adiciona a variável task: Array<Task> local a nova tarefa enviada pelo usuário.
    this.tasks.push(task);

    // substitui o Array<Task> do local storage pelo novo que contem a nova tarefa enviada.
    this.updateStorage();
  } 
  
  // método que retorna um Array<Task> baseado na ordenação, filtro e página enviada pelo usuário.
  readTasks(order: Ordering = Ordering.ASC, filter: string = '', page: number = 1): Array<Task> {
    // criando Array<Task> auxiliar.
    let tasks = this.tasks; 

    // se o filtro não estiver vazio é filtrado pelo texto enviado.
    if(filter !== '') {
      tasks = tasks.filter((task: Task) => task.name.toLowerCase().includes(filter.toLowerCase()));
    }

    // ordenando baseado na ordenação enviada pelo usuário (ASC ou DESC).
    if(order === Ordering.ASC) {
      tasks.sort((t1: Task, t2: Task) => t1.name.localeCompare(t2.name));
    } else {
      tasks.sort((t1: Task, t2: Task) => t2.name.localeCompare(t1.name));
    }

    // atribui a variável tasksSize o tamanho total antes de fazer o slice.
    this.tasksSize = tasks.length;

    // retorna os elementos da página informada.
    tasks = tasks.slice((page - 1) * TaskService.LIMIT_PER_PAGE, page * TaskService.LIMIT_PER_PAGE);

    // retorna o Array<Task> auxiliar.
    return tasks;
  }

  // método que altera uma Task existente, localizando a Task certa por id e alterando o seu nome.
  updateTask(id: string, name: string): void {
    // procura o índice no Array<Task> do id enviado e armazena na variável "index".
    const index = this.tasks.findIndex((line: Task) => line.id === id);

    // altera o nome e reatribui "concluído" como false.
    this.tasks[index].name = name;
    this.tasks[index].isFinished = false;

    // substitui o Array<Task> do local storage contendo as alterações efetuadas.
    this.updateStorage();
  }

  // método que remove uma Task baseado no id enviado pelo usuário.
  deleteTask(id: string | undefined): void {
    // atribui ao Array<Task> local todos os elementos que já existem nele com excessão do elemento que tem o id enviado.
    this.tasks = this.tasks.filter((line: Task) => line.id !== id);

    // substitui o Array<Task> do local storage contendo as alterações efetuadas.
    this.updateStorage();
  }

  // método que altera o valor de "concluído" de uma Task baseado no id enviado pelo usuário.
  markFinished(id: string): void {
    // procura o índice no Array<Task> do id enviado e armazena na variável "index".
    const index = this.tasks.findIndex((line: Task) => line.id === id);

    // altera o campo "concluído" para o "!concluído" (FALSE -> TRUE || TRUE -> FALSE).
    this.tasks[index].isFinished = !this.tasks[index].isFinished;

    // substitui o Array<Task> do local storage contendo a alteração efetuada.
    this.updateStorage();
  }

  // método que retorna uma Task baseada em seu id.
  getTaskById(id: string): Task | undefined {
    // encontra e retorna a Task que contem o id enviado pelo usuário.
    return this.tasks.find((line: Task) => line.id == id);
  }

  // método que retorna um array contendo as páginas necessárias para exibir todos os elementos.
  getPages(): Array<number> {
    // divide o tamanho total do tasks: Array<Task> pelo tamanho limite de elemento por página.
    let value = this.tasksSize / TaskService.LIMIT_PER_PAGE;

    // pega o valor encontrado na divisão, arrendonda para cima e gera um array contendo quantas páginas são necessárias
    // para armazenar todos os elementos do Array<Task>.
    let pages: Array<number> = [];
    for(let i = 0; i < Math.ceil(value); i++) {
      pages.push(i + 1);
    }

    // retorna o array auxiliar criado (pages).
    return pages;
  }

  // método criado para economizar repetição de código, serve para persistir os dados no local storage.
  private updateStorage(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

}