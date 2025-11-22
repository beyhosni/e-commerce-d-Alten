import {
  Component,
  OnInit,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { CartService } from "./services/cart.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterModule, SplitterModule, ToolbarModule, PanelMenuComponent, CommonModule],
})
export class AppComponent implements OnInit {
  title = "ALTEN SHOP";
  cartItemCount = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.updateCartItemCount();
  }

  updateCartItemCount(): void {
    this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });
    
    // S'abonner aux mises à jour du badge du panier
    this.cartService.cartItemCount$.subscribe(count => {
      this.cartItemCount = count;
    });
  }
}
