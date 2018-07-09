import { Component, 
         OnInit, 
         AfterViewInit, 
         ViewChild, 
         ComponentFactoryResolver, 
         Type,
         ViewContainerRef,
         ViewChildren,
         QueryList } from '@angular/core'
import { CodeGenComponent } from '../code-gen/code-gen.component';
import { FullyConnectedLayersComponent } from '../fully-connected-layers/fully-connected-layers.component' 
import { Conv2DComponent } from '../conv2-d/conv2-d.component' 

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, AfterViewInit {
  @ViewChild('fullyConnectedLayers') fullyConnectedLayers;
  @ViewChild('conv1') conv2D;
  @ViewChild(CodeGenComponent) codeGenerator;

  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;
  @ViewChildren('container') comps: QueryList<any>;


  // Keep track of list of generated components for removal purposes
  components = [];

  // Expose class so that it can be used in the template
  fullyConnectedLayersComponentClass = FullyConnectedLayersComponent;
  conv2DComponentClass = Conv2DComponent;

  nodesByLayers;
  showCode:boolean;
  activation;
  layerType;
  nNodes;
  displayLayers;
  showDetails;
  wholeNetwork;
  lastLayer;
  selectOptions;
  activeOptions;
  isNetworkInitialized:boolean;

  constructor(private componentFactoryResolver: ComponentFactoryResolver){
  }

  ngOnInit(){ 
    this.wholeNetwork = []
    this.nodesByLayers = {}
    this.showCode = false
    this.isNetworkInitialized = false;

    this.selectOptions = {
      fullyConnectedLayer: ['Layer'],
      conv2D: ['Conv2D', 'MaxPooling2D']
    }

    this.activeOptions = []

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

  addInputLayer(){
    debugger;
    this.isNetworkInitialized = true
    this.wholeNetwork.push({nNodes:10})
  }


  addConvLayerComponent(){
    if(typeof this.lastLayer == 'undefined' || this.lastLayer.instance.info != 'conv2D') {
      this.addComponent(Conv2DComponent)
    }
    this.lastLayer.instance.info = 'conv2D'
    this.activeOptions = this.selectOptions.conv2D
  }
  addConv(){
    if(typeof this.lastLayer == 'undefined' || this.lastLayer.instance.info != 'conv2D') {
      alert('Add a conv layer first')
      return
    }
    this.nodesByLayers = this.lastLayer.instance.addConv()

    if(this.wholeNetwork.length == 1 || this.wholeNetwork.slice(-1)[0].info != 'conv2D') {
      this.wholeNetwork.push(this.nodesByLayers)
    } else {
      this.wholeNetwork.pop()
      this.wholeNetwork.push(this.nodesByLayers)
    }
  }
  addPool(){
    if(typeof this.lastLayer == 'undefined' || this.lastLayer.instance.info != 'conv2D') {
      alert('Add a conv layer first')
      return
    }
    this.nodesByLayers = this.lastLayer.instance.addPool()
    
    if(this.wholeNetwork.length == 1 || this.wholeNetwork.slice(-1)[0].info != 'conv2D') {
      this.wholeNetwork.push(this.nodesByLayers)
    } else {
      this.wholeNetwork.pop()
      this.wholeNetwork.push(this.nodesByLayers)
    }
  }


  addFullyConnectedLayerComponent(){
    if(typeof this.lastLayer == 'undefined' || this.lastLayer.instance.info != 'fullyConnectedLayer') {
      this.addComponent(FullyConnectedLayersComponent)
    }
    this.lastLayer.instance.info = 'fullyConnectedLayer'
    this.activeOptions = this.selectOptions.fullyConnectedLayer
  }
  addNodes(){
    if(typeof this.lastLayer == 'undefined' || this.lastLayer.instance.info != 'fullyConnectedLayer') {
      alert('Add a fully connected layer first')
      return
    }
    this.lastLayer.instance.activation = this.activation;
    this.lastLayer.instance.layerType = this.layerType;
    this.lastLayer.instance.nNodes = this.nNodes;
    this.nodesByLayers = this.lastLayer.instance.addNodes()

    if(this.wholeNetwork.length == 1 || this.wholeNetwork.slice(-1)[0].info != 'fullyConnectedLayer') {
      this.wholeNetwork.push(this.nodesByLayers)
    } else {
      this.wholeNetwork.pop()
      this.wholeNetwork.push(this.nodesByLayers)
    }
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

  addComponent(componentClass: Type<any>) {
    // Create component dynamically inside the ng-template
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
    const component = this.container.createComponent(componentFactory);
    
    // component.location.nativeElement.id = "conv"+ ++this.lastConvLayer
    // Push the component so that we can keep track of which components are created
    this.components.push(component);
    this.lastLayer = component;
  }

  // removeComponent(componentClass: Type<any>) {
  //   // Find the component
  //   const component = this.components.find((component) => component.instance instanceof componentClass);
  //   const componentIndex = this.components.indexOf(component);

  //   if (componentIndex !== -1) {
  //     // Remove component from both view and array
  //     this.container.remove(this.container.indexOf(component));
  //     this.components.splice(componentIndex, 1);
  //   }
  // }


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
