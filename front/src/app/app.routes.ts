import { Routes } from "@angular/router";
import { HomeComponent } from "./shared/features/home/home.component";
import { LoginComponent } from "./features/auth/login/login.component";
import { RegisterComponent } from "./features/auth/register/register.component";
import { ProductListComponent } from "./components/product-list/product-list.component";
import { CartComponent } from "./components/cart/cart.component";
import { ContactComponent } from "./components/contact/contact.component";
import { AuthGuard } from "./guards/auth.guard";

export const APP_ROUTES: Routes = [
  { path: "", redirectTo: "/products", pathMatch: "full" },
  { path: "products", component: ProductListComponent },
  { path: "cart", component: CartComponent, canActivate: [AuthGuard] },
  { path: "contact", component: ContactComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "home", component: HomeComponent },
  { path: "**", redirectTo: "/products" }
];
