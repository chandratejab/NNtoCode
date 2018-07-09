import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { GlobalVars } from '../globals';

@Component({
  selector: 'app-conv2-d',
  templateUrl: './conv2-d.component.html',
  styleUrls: ['./conv2-d.component.css']
})
export class Conv2DComponent implements OnInit, AfterViewInit {
  svg;
  cx;
  nodes;
  simulation;
  links;
  node;
  link;
  color;
  linkBottom;
  linksBottom;
  nodesByLayers;
  nLayer;
  nNodes; // this should be size

  constructor() { 
  }

  ngOnInit() {
    this.cx=10
    this.nodes=[]
    this.links=[]
    this.linksBottom=[]
    this.nLayer = 0
    this.nodesByLayers = {}
    this.nodesByLayers.data = {}
    this.nodesByLayers.info = "conv2D"
  }

  ngAfterViewInit(){
    this.svg = d3.select("#conv");
    this.svg.attr("width", this.cx);
    // var g = this.svg.append("g").attr("transform", "translate(" + 30 + "," + 100 + ")")
    this.color = d3.scaleOrdinal().range(["black", "green", "blue", "black", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    this.simulation = d3.forceSimulation()
        .nodes(this.nodes)
        .force("charge", d3.forceManyBody().strength(-1000))
        .force("link", d3.forceLink(this.links).distance(200))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        // .force("linkBottom", d3.forceLink(this.linksBottom).distance(200))
        .alphaTarget(1)
        .on("tick", () => this.ticked());

    // This is a box around layers at x,y
    var g = this.svg.append("g").attr("transform", "translate(" + 30 + "," + 100 + ")")

    // var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    this.link = g.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll(".link"),
    this.linkBottom = g.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll(".linkBottom"),
    this.node = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll(".node");
  }

  addConv(){
    this.nLayer++
    this.nodesByLayers.data[this.nLayer] = {}
    this.nodesByLayers.data[this.nLayer].nodes = []
    this.nodesByLayers.data[this.nLayer].details = {}
    // this.nodesByLayers.data[this.nLayer].details.activation = this.activation?this.activation:'relu'
    this.nodesByLayers.data[this.nLayer].details.nNodes = this.nNodes // this should be size
    this.nodesByLayers.data[this.nLayer].details.kernelSize = "(3,2)"
    this.nodesByLayers.data[this.nLayer].type = "conv2D"

    // Rectangle for Conv2D
    let yGap = 600 / 3;
    let y = yGap

    let newEl = {x1: this.cx+10, x2: this.cx+90, y1: y, y2: y+90};
    this.nodes.push(newEl);

    if (typeof this.nodes.slice(-2,-1) !== 'undefined' && this.nodes.slice(-2,-1).length > 0) {
      this.links.push({source: this.nodes.slice(-2,-1)[0], target: newEl});
      this.linksBottom.push({source: this.nodes.slice(-2,-1)[0], target: newEl});
    }

    this.restart();

    this.nodesByLayers.data[this.nLayer].nodes.push(newEl);

    this.cx += 120
    this.svg.attr("width", this.cx);
    // GlobalVars.cx += 90
    return this.nodesByLayers
  }

  addPool(){
    this.nLayer++
    this.nodesByLayers.data[this.nLayer] = {}
    this.nodesByLayers.data[this.nLayer].nodes = []
    this.nodesByLayers.data[this.nLayer].details = {}
    // this.nodesByLayers.data[this.nLayer].details.activation = this.activation?this.activation:'relu'
    this.nodesByLayers.data[this.nLayer].details.nNodes = this.nNodes
    this.nodesByLayers.data[this.nLayer].type = "pool2D"

    // Rectangle for Conv2D
    let yGap = 600 / 3;
    let y = yGap

    let newEl = {x1: this.cx+10, x2: this.cx+60, y1: y, y2: y+60};
    this.nodes.push(newEl);

    if (typeof this.nodes.slice(-2,-1) !== 'undefined' && this.nodes.slice(-2,-1).length > 0) {
      this.links.push({source: this.nodes.slice(-2,-1)[0], target: newEl});
      this.linksBottom.push({source: this.nodes.slice(-2,-1)[0], target: newEl});
    }

    this.restart();

    this.nodesByLayers.data[this.nLayer].nodes.push(newEl);

    this.cx += 120
    this.svg.attr("width", this.cx);
    // GlobalVars.cx += 90
    return this.nodesByLayers
  }

  restart() {
    // Apply the general update pattern to the nodes.
    this.node = this.node.data(this.nodes, function(d) { return d.id;});
    this.node.exit().remove();
    this.node = this.node.enter()
                .append("rect")
                .attr("x", d=> d.x1)
                .attr("y", d=> d.y1)
                .attr("width", d=> d.x2 - d.x1)
                .attr("height", d=> d.y2 - d.y1)
                .attr("stroke-width", 1.5)
                .attr("stroke", "rgb(0,0,0)")
                .attr("fill", "white")
                .merge(this.node);

    // Apply the general update pattern to the links.
    this.link = this.link.data(this.links, function(d) { return d.source.id + "-" + d.target.id; });
    this.link.exit().remove();
    this.link = this.link.enter().append("line").attr("fill", (d) => { return this.color(d.id); }).merge(this.link);

    this.linkBottom = this.linkBottom.data(this.linksBottom, function(d) { return d.source.id + "-" + d.target.id; });
    this.linkBottom.exit().remove();
    this.linkBottom = this.linkBottom.enter().append("line").attr("fill", (d) => { return this.color(d.id); }).merge(this.linkBottom);

    // Update and restart the simulation.
    this.simulation.nodes(this.nodes);
    // this.simulation.force("link").links(this.links);
    this.simulation.alpha(1).restart();
  }
  ticked() {
    this.node.attr("cx", function(d) { d.x=d.cx; return d.x; })
        .attr("cy", function(d) { d.y=d.cy ;return d.y; })
    this.link.attr("x1", function(d) { return d.source.x2; })
        .attr("y1", function(d) { return d.source.y1; })
        .attr("x2", function(d) { return d.target.x1; })
        .attr("y2", function(d) { return d.target.y1; })
        .attr("stroke","rgb(255,0,0)")
        .attr("stroke-width","1 ")
        .attr("class","links");
    this.linkBottom.attr("x1", function(d) { return d.source.x2; })
        .attr("y1", function(d) { return d.source.y2; })
        .attr("x2", function(d) { return d.target.x1; })
        .attr("y2", function(d) { return d.target.y2; })
        .attr("stroke","rgb(255,0,0)")
        .attr("stroke-width","1 ")
        .attr("class","linksBottom");
  }

}
