var MusicClock = function(center_pos, r, startAngle, majorColor, customSettings) {

    THREE.Group.apply(this, arguments);

    this.center_pos = center_pos;
    this.r = r;
    this.majorColor = majorColor;
    this.customSettings = setdefault(customSettings, {})

    this.settings = {
        'dim': {
            'nodeRadius': this.r / 25,
            'edgeColor': setdefault(this.customSettings['dimEdgeColor'],
                                    ColorMap['grey'][7]),
            'edgeWidth': 1,
        },
        'shine': {
            'edgeColor': ColorMap[majorColor][0],
            'edgeWidth': 10,
        }
    }

    this.noteMap = {
        'd': 0,
        'r': 2,
        'm': 4,
        'f': 5,
        's': 7,
        'l': 9,
        't': 11,
    };
    this.importNodesInd = new Set([0, 2, 4, 5, 7, 9, 11]);

    for (var i = 0; i < 12; i++) { this.noteMap[i] = i; }

    // create vertices
    this.vertices = calPolygonVertices(
        12, r, startAngle, false
    );
    for (var i = 0; i < this.vertices.length; i++) {
        this.vertices[i] = [
            center_pos[0] + this.vertices[i][0],
            center_pos[1] + this.vertices[i][1],
            center_pos[2]
        ];
    }

    // create music edges
    this.edges = [];
    for (var i = 0; i < this.vertices.length; i++) {
        for (var j = 0; j < this.vertices.length; j++) {
            var edge = this.createEdge(
                pos2v(this.vertices[i]),
                pos2v(this.vertices[j]),
                this.settings['dim']['edgeColor'],
                this.settings['dim']['edgeWidth'],
            )
            this.add(edge);
            this.edges.push(edge);
        }
    }

    // create music nodes
    this.nodes = [];
    var colors = [];
    for (var i = 0; i < this.vertices.length; i++) {
        if ("nodeColors" in this.customSettings) {
            colors.push(this.customSettings["nodeColors"][i]);
        }
        else {
            colors.push(ColorMap[majorColor][Math.round(i/2) % ColorMap[majorColor].length]);
        }
    }
    this.settings['dim']['nodeColor'] = colors;

    this.settings['shine']['nodeColor'] = [];
    for (var i = 0; i < this.vertices.length; i++) {
        if ("shineNodeColor" in this.customSettings){
            this.settings['shine']['nodeColor'].push(this.customSettings['shineNodeColor']);
        } else {
            this.settings['shine']['nodeColor'].push(
                ColorMap[majorColor][Math.round(i) % ColorMap[majorColor].length]
            )
        }
    }


    for (var i = 0; i < this.vertices.length; i++) {
        var node = this.createNode(
            this.vertices[i],
            colors[i],
            this.settings['dim']['nodeRadius'],
            this.importNodesInd.has(i),
            (i == 0)
        )
        this.add(node);
        this.nodes.push(node);
    };

}
MusicClock.prototype = Object.create(THREE.Group.prototype);
MusicClock.prototype.constructor = MusicClock;


MusicClock.prototype.createEdge = function(st_v, et_v, color, lineWidth) {
    var geometry = new THREE.Geometry();
    geometry.vertices = [st_v, et_v];

    var material = new THREE.LineBasicMaterial(
        {
            color: new THREE.Color(color),
            linewidth: lineWidth,
        }
    );
    var edge = new THREE.Line(geometry, material);
    return edge;
}


MusicClock.prototype.createNode = function(pos, color, r, isImptNode, isTonic) {
    isTonic = setdefault(isTonic, false);

    if (isTonic) { r = 1.5*r; }

    var circleShape = new THREE.Shape();
    circleShape.moveTo(0, r);
    circleShape.quadraticCurveTo(r, r, r, 0);

    if (isImptNode) {
        circleShape.quadraticCurveTo(r, -r, 1.2*r, -r);
    } else {
        circleShape.quadraticCurveTo(r, -r, 0, -r);
    }
    // circleShape.quadraticCurveTo(r, -r, 0, -r)
    circleShape.quadraticCurveTo(-r, -r, -r, 0);
    circleShape.quadraticCurveTo(-r, r, 0, r);

    var shapeFactory = new ShapeFactory(
        circleShape, color, pos[0], pos[1], pos[2], 0, 0, 0
    );

    if (r > 100) {
        var extrudeSettings = {
            depth: 2,
            bevelEnabled: false,
            bevelSegments: 2,
            steps: 2,
            bevelSize: 1,
            bevelThickness:1
        }

        var circle = shapeFactory.addShape(
            "extrude", extrudeSettings
        )
    }

    else {

        var circle = shapeFactory.addShape(
            "flat"
        )

    }
    circle.position.set(pos[0], pos[1], pos[2]);

    return circle;

    // old circle geometry
    // var geometry = new THREE.CircleGeometry(
    //     (imptNode? r * 2: r),
    // 1000);
    // var material = new THREE.MeshBasicMaterial(
    //     {
    //         color: new THREE.Color(color),
    //         side: THREE.DoubleSide
    //     }
    // );
    // var circle = new THREE.Mesh(geometry, material);

}

MusicClock.prototype.pulse = function(chords, timeLapse, repeat, betweenDelay) {
    var firstDelay = (betweenDelay > 0)? .1: 0.0

    for (var i = 0; i < chords.length; i++) {
        var chord = chords[i];

        for (var j = 0; j < chord.length; j++) {
            var node_ind = this.noteMap[chord[j]];
            // node movement
            var t_n = new TimelineLite();
            for (var r = 0; r < repeat; r++) {
                var delay = (r == 0? firstDelay: betweenDelay);
                this._pulseNode(node_ind, timeLapse, t_n, delay);
                // console.log(chord);
            }
            // edge movement
            if (j == 0) { continue; }
            var edge_ind = node_ind * 12 + this.noteMap[chord[j-1]];
            var t_e = new TimelineLite();
            for (var r = 0; r < repeat; r++) {
                var delay = (r == 0? firstDelay: betweenDelay);
                this._pulseEdge(edge_ind, timeLapse, t_e, delay);
            }
        }
    }
}

MusicClock.prototype._pulseNode = function(node_ind, timeLapse, t, beforeDelay){
    t = setdefault(t, new TimelineLite());
    beforeDelay = setdefault(beforeDelay, 0);

    var shineColor = this.settings['shine']['nodeColor'][node_ind];

    var dimColor = this.settings['dim']['nodeColor'][node_ind];

    TweenLite.killTweensOf(this.nodes[node_ind].material);

    var that = this;
    function keepShineColor() {
        that.nodes[node_ind].material.color = new THREE.Color(shineColor);
    }
    function keepDimColor() {
        that.nodes[node_ind].material.color = new THREE.Color(dimColor);
    }


    t.set(this.nodes[node_ind].material,
          {color: new THREE.Color(shineColor)})
     .to(this.nodes[node_ind].scale, timeLapse,
        {
            delay: beforeDelay, x: 2, y: 2, z: 2,
            onUpdate: keepShineColor,
        })
     // .set(this.nodes[node_ind].material,
     //      {color: new THREE.Color(shineColor)})
     .to(this.nodes[node_ind].scale, timeLapse,
        {
            x: 1, y: 1, z: 1,
            onUpdate: keepShineColor,
        })
     .set(this.nodes[node_ind].material,
          {color: new THREE.Color(dimColor)});
    return t;
}

MusicClock.prototype._pulseEdge = function(edge_ind, timeLapse, t, beforeDelay){
    t = setdefault(t, new TimelineLite());
    beforeDelay = setdefault(beforeDelay, 0);

    var thickness = this.settings['dim']['edgeWidth'];
    var that = this;

    function drawEdge() {
        that.edges[edge_ind].material.needsUpdate = true;
    }

    t.set(this.edges[edge_ind].material,
          {color: new THREE.Color(this.settings['shine']['edgeColor'])
          }
         )
    .to(this.edges[edge_ind].material, timeLapse,
         {delay: beforeDelay,
          linewidth: this.settings['shine']['edgeWidth'],
          onUpdate: drawEdge,
         }
        )
     .to(this.edges[edge_ind].material, timeLapse,
         {linewidth: this.settings['dim']['edgeWidth'],
          onUpdate: drawEdge,
         }
        )
     .set(this.edges[edge_ind].material,
          {color: new THREE.Color(this.settings['dim']['edgeColor']),
          }
         )
    return t;
}