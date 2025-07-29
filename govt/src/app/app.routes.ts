import { Routes } from '@angular/router';
import { SignupComponent } from './signp/signup'; // ✅ correct
import { NewsComponent } from './news/news';
import { LoginComponent } from './login/login';
import { HomeComponent } from './home/home'; 
import { ExecutiveComponent } from './executive/executive'; 
import { ContactComponent } from './contact/contact'; // Assuming you have a contact component 
import { CampaignComponent } from './campaign/campaign'; // Assuming you have a campaign component 
import { AboutComponent } from './about/about'; // Assuming you have an about component
import { ProjectComponent } from './project/project'; // Assuming you have a project component
import { ProfileComponent } from './profile/profile'; // Assuming you have a profile component
import { MemberComponent } from './member/member'; // Assuming you have a member component
import { MessagesComponent } from './messages/messages'; // Assuming you have a messages component
import { ForgetComponent } from './forget/forget';
import { ResetComponent } from './reset/reset';
import { DonateComponent } from './donate/donate';

export const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'news', component: NewsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'executive', component: ExecutiveComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'campaign', component: CampaignComponent },
  { path: 'about', component: AboutComponent },
  { path: 'project', component: ProjectComponent },
  { path: 'member', component: MemberComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'forget', component: ForgetComponent },
  { path: 'reset-password', component: ResetComponent }, // ✅ Add this route
  { path: 'donate', component: DonateComponent },
  {
    path: 'newsletter',
    loadComponent: () =>
      import('./newsletter/newsletter').then((m) => m.NewsletterComponent)
  },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];
