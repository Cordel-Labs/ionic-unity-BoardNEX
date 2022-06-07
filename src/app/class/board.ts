export class Board {
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
    boardString;
    constructor(forms, createdDate, boardString){
      this.fbKey = this.makeid();
      this.titulo = forms.titulo;
      this.disciplina = forms.disciplina;
      this.curso = forms.curso;
      this.tema = forms.tema;
      this.etapa = forms.etapa;
      this.topico = forms.topico;
      this.createdDate = createdDate;
      this.lastMod = createdDate;
      this.favourited = false;
      this.boardString = boardString;
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