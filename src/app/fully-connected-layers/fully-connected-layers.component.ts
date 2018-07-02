import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import * as d3 from 'd3';
import { GlobalVars } from '../globals';

@Component({
  selector: 'app-fully-connected-layers',
  templateUrl: './fully-connected-layers.component.html',
  styleUrls: ['./fully-connected-layers.component.css']
})
export class FullyConnectedLayersComponent implements OnInit, AfterViewInit {

  @Input() layerType: string;
  @Input() activation: string;
  @Input() nNodes: string;

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

  constructor(){
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

    // this.format()
  }

  ngAfterViewInit(){
    this.svg = d3.select("#fcl");
    // var width = +this.svg.attr("width")
    this.svg.attr("width", GlobalVars.cx);
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

    for (let i = 0; i < +this.nNodes; i++){
      let newel = {id: lastNode, cy: y, cx: GlobalVars.cx, layer: this.nLayer};
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
    GlobalVars.cx += 90;
    this.showDetails = true
    this.svg.attr("width", GlobalVars.cx);
    return this.nodesByLayers;
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

}
