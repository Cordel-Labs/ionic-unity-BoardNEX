import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseApp } from '@angular/fire';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public forms: FormGroup;
  mode: string = 'login';

  constructor(
    private fbApp: FirebaseApp,
    private auth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private route: Router) { }

  ngOnInit() {
    this.forms = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
    });
  }

  authenticate() {
    if(this.mode == 'login'){
      this.auth.signInWithEmailAndPassword(this.forms.value.email, this.forms.value.senha).then((res) => {
        this.route.navigate(['/home']);
        // console.log(this.fbApp.auth().currentUser.uid);
      });
    }
    else{
      this.auth.createUserWithEmailAndPassword(this.forms.value.email, this.forms.value.senha).then((res) => {
        this.route.navigate(['/home']);
        // console.log(this.fbApp.auth().currentUser.uid);
      });
    }
  }

  changeScreen(){
    this.mode = this.mode == 'login' ? 'register' : 'login';
    if(this.mode == 'login'){
      this.forms = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required]],
      });
      document.getElementById('titleText').innerHTML = "Login";
      document.getElementById('toggleText').innerHTML = "Manter-me Conectado";
    }
    else{
      this.forms = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required]],
        confirmSenha: ['', [Validators.required]],
      });
      document.getElementById('titleText').innerHTML = "Crie uma conta";
      document.getElementById('toggleText').innerHTML = "Li e concordo com os Termos de Uso e Política de Privacidade";
    }
  }
}
