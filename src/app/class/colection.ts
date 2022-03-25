export class Colection {
  titulo;
  disciplina;
  curso;
  tema;
  etapa;
  topico;
  createdDate;
  lastMod;
  favourited;
  questoes: Question[];
  constructor(forms, createdDate, questoes){
    this.titulo = forms.titulo;
    this.disciplina = forms.disciplina;
    this.curso = forms.curso;
    this.tema = forms.tema;
    this.etapa = forms.etapa;
    this.topico = forms.topico;
    this.createdDate = createdDate;
    this.lastMod = createdDate;
    this.questoes = questoes;
    this.favourited = false;
  }
  editColection(forms, editedDate, questoes){
    this.titulo = forms.titulo;
    this.disciplina = forms.disciplina;
    this.curso = forms.curso;
    this.tema = forms.tema;
    this.etapa = forms.etapa;
    this.topico = forms.topico;
    this.lastMod = editedDate;
    this.questoes = questoes;
  }
}

export class Question {
  public enunciado: string;
  public alter: string[];
  public rightAnswer: number;
  public image: string;
  constructor(enunciado, alter, rightAnswer, image = ''){
    this.enunciado = enunciado;
    this.alter = alter;
    this.rightAnswer = rightAnswer;
    this.image = image;
  }
}
