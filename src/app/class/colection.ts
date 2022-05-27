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
  fbKey;
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
    this.fbKey = this.makeid();
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
  private makeid() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 5; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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
