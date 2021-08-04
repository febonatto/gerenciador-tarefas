import { Component, OnInit } from '@angular/core';

import { Task } from 'src/app/models/task.model';
import { Ordering } from 'src/app/utils/order.enum';
import { TaskService } from './../../services/task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  // variáveis.
  tasks: Array<Task> = [];
  pages: Array<number> = [];
  task: Task | undefined = undefined;
  orderBy: Ordering = Ordering.ASC;
  filter: string = '';
  currentPage: number = 1;

  // construtor.
  constructor(private taskService: TaskService) { }

  // quando o componente for iniciado ele pegará a quantidade de Task existente e quantas páginas são necessárias para exibi-las.
  ngOnInit(): void {
    this.readTasks();
    this.pages = this.taskService.getPages();
  }

  // método que chama a função do taskService que altera o valor de "concluído" a partir do id da Task.
  markFinished(id: string): void {
    this.taskService.markFinished(id);

    // após alterar no principal puxa a alteração para o Array<Task> local.
    this.readTasks();
  }

  // método que chana a função do taskService que remove a Task a partir do id.
  deleteTask(id: string | undefined): void {
    this.taskService.deleteTask(id);

    // após a remoção verifica se a última página ainda contem elementos, caso a última página fique vazia será retornado uma página.
    if (this.tasks.length === 1) {
      this.currentPage--;
      this.selectedPage();
    }

    // após remover no principal puxa a alteração para o Array<Task> local, e atualiza a quantidade de páginas necessárias para exibição.
    this.readTasks();
    this.pages = this.taskService.getPages();
  }

  // método que abre o modal de remoção com as informações da Task, puxando elas por id.
  callModal(id: string): void {
    this.task = this.taskService.getTaskById(id);
  }

  // método que muda a ordenação das tarefas, sendo ascendente e descendente
  changeOrder(): void {
    this.orderBy = this.orderBy === Ordering.ASC ? Ordering.DESC : Ordering.ASC;
    this.readTasks();
  }

  // método que recebe o filtro e envia para o taskService buscando tarefas com aquele trecho de texto.
  search(event: any): void {
    // atribui a variável "value" o texto digitado pelo usuário.
    const value = event.target.value;

    // altera o valor da variável "filter" local para o valor informado pelo usuário.
    this.filter = value;

    // caso o filtro seja diferente de vazio ele chama novamente a função do taskService que lista as Tasks,
    // passando sempre o valor atual da variável local "filter".
    if(this.filter !== '') {
      this.currentPage = 1;
      this.readTasks();
    } else {
      this.readTasks();
    }

    // após realizar o filtro chama a função "getPages" que retorna a quantidade necessária de páginas para exibir a seleção atual.
    this.pages = this.taskService.getPages();
    this.selectedPage();
  }

  // método que muda de página de acordo com a seleção do usuário.
  changePage(page: number): void {
    // altera a variável local "currentPage" para a seleção do usuário.
    this.currentPage = page;

    // chama o método local para marcar a página ativa.
    this.selectedPage();

    // após a alteração chama a função "readTasks" para atualizar as Tasks a serem exibidas na página selecionada.
    this.readTasks();
  }

  // método que deixa a página atual marcada para melhor entendimento do usuário.
  selectedPage(): void {
    // pega todas as minhas opções da página do HTML.
    const pages = document.querySelectorAll('.pagination .page-option') as NodeListOf<HTMLLIElement>;

    // remove de todas as opções a classe "active", que demarca qual página está ativa.
    pages.forEach((li: HTMLLIElement) => li.classList.remove('active'));

    // adiciona a classe "active" a página selecionada pelo usuário.
    pages[this.currentPage - 1].classList.add('active');
  };

  // método que retorna true para quando a ordenação escolhida for ascendente
  isAsc(): boolean {
    return this.orderBy === Ordering.ASC;
  }

  // método criado para evitar repetição de código, economizando algumas palavras
  readTasks(): void {
    this.tasks = this.taskService.readTasks(this.orderBy, this.filter, this.currentPage);
  }

}
