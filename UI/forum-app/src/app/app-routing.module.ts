import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/services/auth/auth-guard.service';
import { AuthComponent } from './forum/auth/auth.component';
import { ForumComponent } from './forum/forum.component';

const routes: Routes = [
  { path: '',  canActivate: [AuthGuardService],
    children: [
      { path: '', redirectTo:'forums', pathMatch: 'full' },
      {path: 'forums', component: ForumComponent}
    ]
  },
  { path: 'auth', component: AuthComponent , canActivate: [AuthGuardService]}, 
  { path: '**', redirectTo:'', pathMatch: 'full' },  // Wildcard route for a 404 page
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
