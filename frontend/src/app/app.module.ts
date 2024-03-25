import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './Shared/header/header.component';
import { FooterComponent } from './Shared/footer/footer.component';
import { GroundZeroComponent } from './Shared/ground-zero/ground-zero.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { ItemsListAdminComponent } from './items/items-list-admin/items-list-admin.component';
import { CategoryListComponent } from './category/category-list/category-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { CategoryDialogComponent } from './dialogs/category-dialog/category-dialog.component';
import { CategoryFormComponent } from './category/category-form/category-form.component';
import { MatInputModule } from '@angular/material/input';
import { ItemListComponent } from './items/item-list/item-list.component';
import { ItemFormComponent } from './items/item-form/item-form.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { SignleItemComponent } from './items/signle-item/signle-item.component';
import { LoginComponent } from './users/login/login.component';
import { RegisterComponent } from './users/register/register.component';
import { InterInterceptor } from './services/inter.interceptor';
import { GuardService } from './services/guard.service';
import { MatBadgeModule } from '@angular/material/badge';
import { CartComponent } from './cart/cart/cart.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserDialogComponent } from './dialogs/user-dialog/user-dialog.component';
import { UserFormComponent } from './users/user-form/user-form.component';
import { ItemDialogComponent } from './dialogs/item-dialog/item-dialog.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CarousalComponent } from './Shared/carousal/carousal.component';
import { MatStepperModule } from '@angular/material/stepper';
import { AboutComponent } from './About/about/about.component';
import { ContactComponent } from './About/contact/contact.component';
import { NewArrivalComponent } from './items/new-arrival/new-arrival.component';
import { UserProfileUpdateComponent } from './users/user-profile-update/user-profile-update.component';
import { AdminOrdersComponent } from './cart/admin-orders/admin-orders.component';
import { UsersProfileUpdateComponent } from './users/users-profile-update/users-profile-update.component';
import { MatSliderModule } from '@angular/material/slider';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { UserOrdersComponent } from './cart/user-orders/user-orders.component';
import { PolicyComponent } from './About/policy/policy.component';
const material = [
  MatIconModule,
  MatButtonModule,
  MatSnackBarModule,
  MatSelectModule,
  MatCardModule,
  MatTableModule,
  MatFormFieldModule,
  MatDialogModule,
  MatInputModule,
  TextFieldModule,
  MatBadgeModule,
  MatSlideToggleModule,
  MatPaginatorModule,
  MatStepperModule,
  MatSliderModule,
];

const routes: Routes = [
  {
    path: '',
    component: GroundZeroComponent,
    children: [
      //Categories
      {
        path: 'categories/list',
        component: CategoryListComponent,
        canActivate: [GuardService],
      },
      {
        path: 'categories/form',
        component: CategoryFormComponent,
        canActivate: [GuardService],
      },
      {
        path: 'categories/form/:id',
        component: CategoryFormComponent,
        canActivate: [GuardService],
      },

      //Items
      { path: '', component: ItemListComponent },
      {
        path: 'items/list',
        component: ItemsListAdminComponent,
        canActivate: [GuardService],
      },
      {
        path: 'items/form',
        component: ItemFormComponent,
        canActivate: [GuardService],
      },
      { path: 'new-arrival', component: NewArrivalComponent },
      {
        path: 'items/form/:id',
        component: ItemFormComponent,
        canActivate: [GuardService],
      },
      { path: 'items/single-item/:id', component: SignleItemComponent },

      //Users
      { path: 'users/login', component: LoginComponent },
      { path: 'users/register', component: RegisterComponent },
      {
        path: 'users/list',
        component: UsersListComponent,
        canActivate: [GuardService],
      },
      {
        path: 'users/form',
        component: UserFormComponent,
        canActivate: [GuardService],
      },
      {
        path: 'users/form/:id',
        component: UserFormComponent,
        canActivate: [GuardService],
      },
      { path: 'user/profile-edit', component: UserProfileUpdateComponent },
      {
        path: 'user/profile-edit/:id',
        component: UserProfileUpdateComponent,
      },
      { path: 'users/profile-edit', component: UsersProfileUpdateComponent },
      {
        path: 'users/profile-edit/:id',
        component: UsersProfileUpdateComponent,
        canActivate: [GuardService],
      },
      { path: 'user/profile', component: UserProfileComponent },
      {
        path: 'user/profile/:id',
        component: UserProfileComponent,
        canActivate: [GuardService],
      },

      //Cart
      { path: 'cart', component: CartComponent },
      {
        path: 'cart/admin',
        component: AdminOrdersComponent,
        canActivate: [GuardService],
      },
      {
        path: 'cart/user',
        component: UserOrdersComponent,
      },

      // About
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      {path: 'policy', component: PolicyComponent},
    ],
  },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    GroundZeroComponent,
    ItemsListAdminComponent,
    CategoryListComponent,
    CategoryDialogComponent,
    CategoryFormComponent,
    ItemListComponent,
    ItemFormComponent,
    SignleItemComponent,
    LoginComponent,
    RegisterComponent,
    CartComponent,
    UsersListComponent,
    UserDialogComponent,
    UserFormComponent,
    ItemDialogComponent,
    CarousalComponent,
    AboutComponent,
    ContactComponent,
    NewArrivalComponent,
    UserProfileUpdateComponent,
    AdminOrdersComponent,
    UsersProfileUpdateComponent,
    UserProfileComponent,
    UserOrdersComponent,
    PolicyComponent,
  ],
  imports: [
    ...material,
    BrowserModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterInterceptor, multi: true }, // The InterInterceptor service is provided as an HTTP interceptor using the HTTP_INTERCEPTORS token. It allows intercepting and modifying HTTP requests and responses.
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
