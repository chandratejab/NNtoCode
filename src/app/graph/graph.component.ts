import {Component, NgModule, OnInit, AfterViewInit, OnDestroy} from '@angular/core'
import * as d3 from 'd3';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, AfterViewInit {
  svg;
  link;
  node;
  nodes;
  links;
  simulation;
  color;
  newNode;
  layer;
  cx;
  nLayer;
  nodesByLayers;
  showDetails:boolean;
  displayLayers: Array<any>;
  code;
  showCode:boolean;
  nNodes;
  activation;
  layerType;

  constructor(){
    this.cx = 10
  }

  ngOnInit(){ 
    this.nodes = [];
    this.links = [];
    this.newNode = 1;
    this.layer = 10
    this.nLayer = 0
    this.showDetails= false;
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
    this.svg = d3.select("svg");
    var width = +this.svg.attr("width");
    var height = +this.svg.attr("height");
    this.color = d3.scaleOrdinal().range(["black", "green", "blue", "black", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    
    this.simulation = d3.forceSimulation()
        .nodes(this.nodes)
        .force("charge", d3.forceManyBody().strength(-1000))
        .force("link", d3.forceLink(this.links).distance(200))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .alphaTarget(1)
        .on("tick", () => this.ticked());

    // This is a box around layers at x,y
    var g = this.svg.append("g").attr("transform", "translate(" + 30 + "," + 100 + ")")

    // var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    this.link = g.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll(".link"),
    this.node = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll(".node");

    this.restart();
  }

  // addNode(){
  //   let newel = {id: this.newNode, cy: 100, cx: 100};
  //   this.nodes.push(newel);
  //   this.links.push({source: this.b, target: newel});
  //   this.layer+=50
  //   this.restart();
  //   this.newNode++;
  // }

  addConv(){
    // Rectangle for Conv2D
    let yGap = 600 / 3;
    let y = yGap

    var data = [{x1: this.cx, x2: this.cx+90, y1: y, y2: y+90}];
                // {x1: 50, x2: 80, y1: 100, y2: 150},
                // {x1: 200, x2: 400, y1: 10, y2: 100}];

    var rects = this.svg.selectAll("foo")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d=> d.x1)
      .attr("y", d=> d.y1)
      .attr("width", d=> d.x2 - d.x1)
      .attr("height", d=> d.y2 - d.y1)
      .attr("stroke-width", 1.5)
      .attr("stroke", "rgb(0,0,0)")
      .attr("fill", "white");

    this.restart();

    this.cx += 150
  }

  addNodes(){
    if(!this.nNodes){
      alert("Specify nNodes")
      return;
    }
    this.nLayer++
    this.nodesByLayers[this.nLayer] = {}
    this.nodesByLayers[this.nLayer].nodes = []
    this.nodesByLayers[this.nLayer].details = {}
    this.nodesByLayers[this.nLayer].details.activation = this.activation?this.activation:'relu'
    this.nodesByLayers[this.nLayer].details.nNodes = this.nNodes
    
    let lastNode = this.newNode;
    
    let yGap = 600 / (+this.nNodes+3);
    let y = yGap

    for (let i = 0; i < this.nNodes; i++){
      let newel = {id: lastNode, cy: y, cx: this.cx, layer: this.nLayer};
      y += yGap;

      this.nodes.push(newel);
      for (let node of this.nodes){
        if (node.layer == newel.layer-1)
          this.links.push({source: node, target: newel});
      }
      this.layer+=50
      lastNode++;
      this.nodesByLayers[this.nLayer].nodes.push(newel);
    }

    this.restart();

    this.newNode = lastNode;
    this.cx += 90;
    this.showDetails = true
  }

  restart() {
    // Apply the general update pattern to the nodes.
    this.node = this.node.data(this.nodes, function(d) { return d.id;});
    this.node.exit().remove();
    this.node = this.node.enter().append("circle").attr("fill", (d) => { return this.color(d.id); }).attr("r", 8).merge(this.node);
    // Apply the general update pattern to the links.
    this.link = this.link.data(this.links, function(d) { return d.source.id + "-" + d.target.id; });
    this.link.exit().remove();
    this.link = this.link.enter().append("line").attr("fill", (d) => { return this.color(d.id); }).merge(this.link);
    // Update and restart the simulation.
    this.simulation.nodes(this.nodes);
    // this.simulation.force("link").links(this.links);
    this.simulation.alpha(1).restart();
  }
  ticked() {
    this.node.attr("cx", function(d) { d.x=d.cx; return d.x; })
        .attr("cy", function(d) { d.y=d.cy ;return d.y; })
    this.link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
        .attr("stroke","rgb(255,0,0)")
        .attr("stroke-width","1 ")
        .attr("class","links");
  }

  getInfo(){
    this.displayLayers = Object.keys(this.nodesByLayers).map(key=>this.nodesByLayers[key].nodes)
    this.showDetails = !this.showDetails
  }

  generateCode(){
    // classifier.add(Dense(output_dim = 6, init = 'uniform', activation = 'relu', input_dim = 11))
    // # Adding the second hidden layer
    // classifier.add(Dense(output_dim = 6, init = 'uniform', activation = 'relu'))
    // # Adding the output layer
    // classifier.add(Dense(output_dim = 4, init = 'uniform', activation = 'sigmoid'))

    // # Compiling Neural Network
    // classifier.compile(optimizer = 'adam', loss = 'binary_crossentropy', metrics = ['accuracy'])
    this.code = []
    let inputLayer = this.nodesByLayers[1].details
    
    let firstLayer:boolean = true;
    let props = Object.keys(this.nodesByLayers).slice(1)

    for (let layer in props){

      let params = firstLayer? Object.assign(this.nodesByLayers[props[layer]].details, {'input_dim': inputLayer.nNodes}): this.nodesByLayers[props[layer]].details;
      firstLayer = false
      
      // this.code.push("classifier.add(Dense(output_dim = {nNodes}, init = 'uniform', activation = {activation}, input_dim = {input_dim}))"
      //                 .formatUnicorn(params))

      this.code.push(this.getCode(params))
    }
    this.showCode = true
  }

  getCode(params){
    // nNodes=null, init='uniform', activation='relu', input_dim=null
    let code = []
    if('nNodes' in params) code.push('output_dim = {0}'.format(params.nNodes))
    if('init' in params) code.push('init = {0}'.format(params.init))
    if('activation' in params) code.push('activation = {0}'.format(params.activation))
    if('input_dim' in params) code.push('input_dim = {0}'.format(params.input_dim))

    return 'classifier.add(Dense(' + code.join(",") + ')'
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
