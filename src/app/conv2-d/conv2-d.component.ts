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
  cx
  constructor() { 
  }

  ngOnInit() {
    this.cx=10
  }

  ngAfterViewInit(){
    this.svg = d3.select("#conv");
    this.svg.attr("width", this.cx);
    // var g = this.svg.append("g").attr("transform", "translate(" + 30 + "," + 100 + ")")
  }

  addConv(){
    // Rectangle for Conv2D
    let yGap = 600 / 3;
    let y = yGap

    var data = [{x1: this.cx+10, x2: this.cx+90, y1: y, y2: y+90}];
                // {x1: 50, x2: 80, y1: 100, y2: 150},
                // {x1: 200, x2: 400, y1: 10, y2: 100}];

    var wid;
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

    // this.restart();

    this.cx +=90
    this.svg.attr("width", this.cx);
    // GlobalVars.cx += 90

  }
}
