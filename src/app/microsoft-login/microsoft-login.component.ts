import { Component, OnInit, Input } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-common';
import { User } from '../Models/user';
import { UserService } from '../Services/user.service';
import { HttpClient } from '@angular/common/http';
import { RegistrationService } from '../Services/registration.service';
import { AppRoutingModule } from '../app-routing.module';
import { Router } from '@angular/router';


@Component({
  selector: 'app-microsoft-login',
  templateUrl: './microsoft-login.component.html',
  styleUrls: ['./microsoft-login.component.css']
})

export class MicrosoftLoginComponent implements OnInit {

  //Properties
  public logincheck : boolean = false; 
  private newUser : User = {} as User;

  constructor(
     private msalService: MsalService,
     private userService: UserService, 
     private http: HttpClient,
     private registration: RegistrationService,
     private router:Router
     ) {
    
  }

  ngOnInit(): void {
    //Checking for account from popup, when redirected this is called
    this.msalService.instance.handleRedirectPromise().then(
      res => {
        if (res != null && res.account != null) {
          this.msalService.instance.setActiveAccount(res.account)
        } 
      })  
  }

  public btnLogin() {
    this.router.navigateByUrl('/quests')
  }

  public login() : void {
    this.msalService.loginPopup().subscribe((response: AuthenticationResult) => 
    {
      this.msalService.instance.setActiveAccount(response.account)
      this.logincheck = true     
      this.newUser.email = this.msalService.instance.getActiveAccount()!.username
      this.addUser()
      this.btnLogin()
    } )
  }

  public logout() : void {
    this.msalService.logout();
    this.logincheck = false
  }

  public addUser() : void{
    this.userService.verifyIfUserExists(this.newUser)
    .subscribe((user) => 
    {
      this.newUser = user
    },
    (error) => 
    {     
      this.registration.popup.next('open')      
    })
  } 
}
