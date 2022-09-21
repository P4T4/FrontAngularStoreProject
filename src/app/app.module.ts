import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { ClientComponent } from './client/client.component';
import { ProductComponent } from './product/product.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalClientComponent } from './client/components/modal-client/modal-client.component';
import { ModalProductComponent } from './product/components/modal-product/modal-product.component';
import { ModalPurchaseComponent } from './purchase/components/modal-purchase/modal-purchase.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CardFormComponent } from './purchase/components/card-form/card-form.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    ClientComponent,
    ProductComponent,
    PurchaseComponent,
    ModalClientComponent,
    ModalProductComponent,
    ModalPurchaseComponent,
    CardFormComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'cliente', component: ClientComponent },
      { path: 'product', component: ProductComponent },
      { path: 'purchase', redirectTo: 'cliente' },
      { path: 'purchase/:id_client', component: PurchaseComponent },
    ]),
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
