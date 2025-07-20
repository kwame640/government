import { Routes } from '@angular/router';
import { SignpComponent } from './signp/signp';
import { NewsComponent } from './news/news';
import { LoginComponent } from './login/login';
import { HomeComponent } from './home/home'; 
import { ExecutiveComponent } from './executive/executive'; 
import { ContactComponent } from './contact/contact'; // Assuming you have a contact component 
import { CampaignComponent } from './campaign/campaign'; // Assuming you have a campaign component 
import { AboutComponent } from './about/about'; // Assuming you have an about component
import { ProjectComponent } from './project/project'; // Assuming you have a project component

export const routes: Routes = [
  { path: 'signup', component: SignpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'news', component: NewsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'executive', component: ExecutiveComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'campaign', component: CampaignComponent },
  { path: 'about', component: AboutComponent },
  { path: 'project', component: ProjectComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];
