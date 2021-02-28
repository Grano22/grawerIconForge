import React, { Component } from 'react';
import ReactCreateClass from 'create-react-class';
import { multiple } from "jumper_react/langUtils";
/* Icon Pack by Grano22 | Module v.1 */
class IconInterface {
    name = "Unnamed";

    iconStructure = "";
    get iconBefore() { return ""; }
    get iconAfter() { return ""; }

    width = 24;
    height = 24;

    color = "black";
    fill = "transparent";

    constructor(initFunc=null) {
        if(initFunc!=null) { 
            var initObj = initFunc(this) || {};
            for(let objParam in initObj) this[objParam] = initObj[objParam];
        }
    }

    fromTextAttributes(stringStyle) {
        if(typeof stringStyle.fontSize!="undefined") {
            this.width = this.height = stringStyle.fontSize;
        }
    }

    get completeStructure() {return this.iconBefore + this.iconStructure + this.iconAfter}
}

export class Icon extends IconInterface {
    asComponent() {
        var self = this, RenderedContext = ReactCreateClass({ render:function() { return (<i style={{ display:"inline-block" }} className="iconPack_svgIcon" dangerouslySetInnerHTML={{__html: self.completeStructure }}></i>); }});
        return (<RenderedContext/>); //width:self.width, height:self.height, , fontStyle:"normal"
    }

    asNativeElement() {
        let temp = document.createElement('div');
        temp.innerHTML = this.completeStructure;
        return temp.firstChild;
    }

    auto(outputType="component") {
        this.outputType = "autoScale";
        switch(outputType) {
            case "component": return this.asComponent();
            case "nativeElement": return this.asNativeElement();
        }
    }
}

export class ReactIcon extends multiple(IconInterface, Component) {
    constructor(props) {
        super([null], [props]);

    }

    render() {

    }
}

export class SVGIcon extends Icon {
    static iterator = 0;
    containerWidth = 0;
    containerHeight = 0;
    containerAttributes = {};
    get iconBefore() { return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+this.width+' '+this.height+'" width="'+(this.containerWidth || this.width)+'" height="'+(this.containerHeight || this.height)+'" '+(Object.keys(this.containerAttributes).length>0 && Object.entries(this.containerAttributes).map((attr, ind, arr)=>attr[0]+'="'+attr[1]+'"').join(" "))+'>'; } //+(arr.length - 1>ind && " ")
    get iconAfter() { return '&#9633;</svg>'; }

    constructor(initFunc=null, outputType="") {
        super(initFunc);
        this.id = SVGIcon.iterator++;
        if(this.iconStructure=="") this.iconStructure = '<rect x="0" y="0" width="'+this.width+'" height="'+this.height+'" style="fill:transparent;stroke:#000;stroke-width:10" />';
        this.outputType = outputType;
    }

    resize(newWidth, newHeight, resizeCont=false) {
        this.width = newWidth;
        this.height = newHeight;
        if(resizeCont) { this.containerWidth = newWidth; this.containerHeight = newHeight; }
        return this;
    }

    get completeStructure() {
        let iconBefore = "", iconAfter = "";
        switch(this.outputType) {
            case "symbol":
                iconBefore = this.iconBefore + `<symbol id="iconPackOutput${this.id}" viewBox="0 0 ${this.originWidth || this.width} ${this.originHeight || this.height}" >`;
                iconAfter = `</symbol><use xlink:href="#iconPackOutput${this.id}" width="${this.width}" height="${this.height}"></use>` + this.iconAfter;
            break;
            case "preseved":
                this.containerAttributes = Object.assign(this.containerAttributes, { preserveAspectRatio:"none" });
                iconBefore = this.iconBefore;
            default:
            case "autoScale":
                this.containerAttributes = Object.assign(this.containerAttributes, { fill:"currentcolor" });
                console.log(this.containerAttributes);
                this.containerWidth = "100%";
                this.containerHeight = "100%";
                iconBefore = this.iconBefore;
                iconAfter = this.iconAfter;
            break;
        }
        return iconBefore + this.iconStructure + iconAfter;
    }
}