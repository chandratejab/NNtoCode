import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-code-gen',
  templateUrl: './code-gen.component.html',
  styleUrls: ['./code-gen.component.css']
})
export class CodeGenComponent implements OnInit {
  @Input() nodesByLayers
  @Input() wholeNetwork
  @Input() showCode: boolean
  code

  constructor() { }

  ngOnInit() {
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
    let inputLayer = {details: {nNodes:10}}.details //this.wholeNetwork[1].details
    debugger;
    let firstLayer:boolean = true;
    // let props = Object.keys(this.nodesByLayers).slice(1)


    for (let layer of this.wholeNetwork.slice(1)){

      let props = Object.keys(layer.data)//.slice(1)

      for (let prop of props){
        let params = firstLayer? Object.assign(layer.data[prop].details, {'input_dim': inputLayer.nNodes}): layer.data[prop].details;
        firstLayer = false
        this.code.push(this.getCode(params, layer.data[prop].type))
      }
    }
    this.code.push("classifier.compile(optimizer = 'adam', loss = 'binary_crossentropy', metrics = ['accuracy'])")
  }

  // generateCode(){

    // classifier.add(Dense(output_dim = 6, init = 'uniform', activation = 'relu', input_dim = 11))
    // # Adding the second hidden layer
    // classifier.add(Dense(output_dim = 6, init = 'uniform', activation = 'relu'))
    // # Adding the output layer
    // classifier.add(Dense(output_dim = 4, init = 'uniform', activation = 'sigmoid'))

    // # Compiling Neural Network
    // classifier.compile(optimizer = 'adam', loss = 'binary_crossentropy', metrics = ['accuracy'])
  //   this.code = []
  //   let inputLayer = this.nodesByLayers[1].details
    
  //   let firstLayer:boolean = true;
  //   let props = Object.keys(this.nodesByLayers).slice(1)

  //   for (let layer in props){

  //     let params = firstLayer? Object.assign(this.nodesByLayers[props[layer]].details, {'input_dim': inputLayer.nNodes}): this.nodesByLayers[props[layer]].details;
  //     firstLayer = false
      
  //     // this.code.push("classifier.add(Dense(output_dim = {nNodes}, init = 'uniform', activation = {activation}, input_dim = {input_dim}))"
  //     //                 .formatUnicorn(params))

  //     this.code.push(this.getCode(params, 'asd'))
  //   }
  //   this.code.push("classifier.compile(optimizer = 'adam', loss = 'binary_crossentropy', metrics = ['accuracy'])")
  // }

  getCode(params, info){
    if (info == 'conv2D'){
      return this.getConv(params)
    } else if (info == 'fullyConnectedLayers'){
      return this.getDense(params)
    } else if (info == 'pool2D'){
      return this.getPool(params)
    }
    
  }

  getConv(params){
    let code = []
    if('size' in params) code.push('size = {0}'.format(params.nNodes))
    if('kernel_size' in params) code.push('kernel_size = {0}'.format(params.kernelSize))
    if('activation' in params) code.push('activation = {0}'.format(params.activation))
    if('input_dim' in params) code.push('input_shape = {0}'.format(params.input_dim))

    return 'classifier.add(Conv2D(' + code.join(",") + '))'
  }

  getPool(params){
    let code = []
    if('size' in params) code.push('size = {0}'.format(params.nNodes))
    if('kernel_size' in params) code.push('kernel_size = {0}'.format(params.kernelSize))
    if('activation' in params) code.push('activation = {0}'.format(params.activation))
    if('input_dim' in params) code.push('input_shape = {0}'.format(params.input_dim))

    return 'classifier.add(MaxPooling2D(' + code.join(",") + '))'
  }

  getDense(params){
    let code = []
    if('nNodes' in params) code.push('output_dim = {0}'.format(params.nNodes))
    if('init' in params) code.push('init = {0}'.format(params.init))
    if('activation' in params) code.push('activation = {0}'.format(params.activation))
    if('input_dim' in params) code.push('input_dim = {0}'.format(params.input_dim))

    return 'classifier.add(Dense(' + code.join(",") + '))'
  }
}
