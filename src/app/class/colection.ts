export class Colection {
  titulo;
  disciplina;
  curso;
  tema;
  etapa;
  topico;
  createdDate;
  lastMod;
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
  }
}

export class Question {
  public enunciado: string;
  public alter: string[];
  constructor(enunciado, alter){
    this.enunciado = enunciado;
    this.alter = alter;
  }
}
