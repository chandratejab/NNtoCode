import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core'
import { CodeGenComponent } from '../code-gen/code-gen.component';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, AfterViewInit {
  @ViewChild('fullyConnectedLayers') fullyConnectedLayers;
  @ViewChild('conv2D') conv2D;
  @ViewChild(CodeGenComponent) codeGenerator;

  nodesByLayers;
  showCode:boolean;
  activation;
  layerType;
  displayLayers;
  showDetails;

  constructor(){
  }

  ngOnInit(){ 
    this.nodesByLayers = {}
    this.showCode = false

    // String.prototype.formatUnicorn = String.prototype.formatUnicorn || this.formatUnicorn
    String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
    function () {
        "use strict";
        var str = this.toString();
        if (arguments.length) {
            var t = typeof arguments[0];
            var key;
            var args = ("string" === t || "number" === t) ?
                Array.prototype.slice.call(arguments)
                : arguments[0];

            for (key in args) {
                str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
            }
        }
        return str;
    };

    this.format()
  }

  ngAfterViewInit(){
  }

  addConv(){
    this.conv2D.addConv()
  }

  addNodes(){
    this.nodesByLayers = this.fullyConnectedLayers.addNodes();
  }

  getInfo(){
    this.displayLayers = Object.keys(this.nodesByLayers).map(key=>this.nodesByLayers[key].nodes)
    this.showDetails = !this.showDetails
  }

  generateCode(){
    this.showCode = !this.showCode

    if(this.showCode){
      this.codeGenerator.generateCode()
    }
  }

  format(){
    if (!String.prototype.format) {
      String.prototype.format = function(ar) {
        var args = [ar];
        let str= this.replace(/{(\d+)}/g, function(match, number) { 
          return typeof args[number] != 'undefined'
            ? args[number]
            : match
          ;
        });
        return str
      };
    }
  }
}
