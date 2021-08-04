export class Task {
    public id: string;
    public name: string;
    public isFinished: boolean;

    constructor(id: string, name: string, isFinished: boolean) {
        this.id = id;
        this.name = name;
        this.isFinished = isFinished;
    }
}