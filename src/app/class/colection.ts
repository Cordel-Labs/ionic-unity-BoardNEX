export class Colection {
  titulo;
  disciplina;
  curso;
  tema;
  etapa;
  topico;
  createdDate;
  lastMod;
  constructor(forms, createdDate){
    this.titulo = forms.titulo;
    this.disciplina = forms.disciplina;
    this.curso = forms.curso;
    this.tema = forms.tema;
    this.etapa = forms.etapa;
    this.topico = forms.topico;
    this.createdDate = createdDate;
    this.lastMod = createdDate;
  }
}
