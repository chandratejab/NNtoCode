import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { GraphComponent } from './graph/graph.component';
import { FullyConnectedLayersComponent } from './fully-connected-layers/fully-connected-layers.component';
import { Conv2DComponent } from './conv2-d/conv2-d.component';
import { CodeGenComponent } from './code-gen/code-gen.component';

@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    FullyConnectedLayersComponent,
    Conv2DComponent,
    CodeGenComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
