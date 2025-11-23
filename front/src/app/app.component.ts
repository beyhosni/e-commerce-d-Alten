import {
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { ProductListComponent } from "./components/product-list/product-list.component";
import { CartComponent } from "./components/cart/cart.component";
import { ContactComponent } from "./components/contact/contact.component";
import { CartService } from "./services/cart.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterModule, SplitterModule, ToolbarModule, PanelMenuComponent, ProductListComponent, CartComponent, ContactComponent, CommonModule],
})
export class AppComponent implements OnInit {
  title = "ALTEN SHOP";
  cartCount = inject(CartService).cartCount;

  constructor() { }

  ngOnInit(): void {
  }
}
