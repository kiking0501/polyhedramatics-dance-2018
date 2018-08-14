var WoodBlock = function(center_pos, size, tri, majorColor,
                         shapeType, wireWidth) {

    THREE.Group.apply(this, arguments);

    shapeType = setdefault(shapeType, "woodCube");
    wireWidth = setdefault(wireWidth, 1.1);

    this.center_pos = center_pos;
    this.size = size;
    this.tri = tri;
    this.color = setdefault(ColorMap[majorColor], ["white", 0, majorColor])[2];
    this.color3 = new THREE.Color(this.color);
    this.shapeType = shapeType;
    this.wireWidth = wireWidth;

    //// create polyhedron
    var poly = this.createPoly(shapeType);
    poly.position.set(center_pos[0], center_pos[1], center_pos[2]);
    this.poly = poly;
    this.add(poly);

    this.oriVertices = [];
    for (var i = 0; i < poly.geometry.vertices.length; i++) {
        this.oriVertices[i] = v2pos(poly.geometry.vertices[i]);
    }
}

WoodBlock.prototype = Object.create(THREE.Group.prototype);
WoodBlock.prototype.constructor = WoodBlock;

WoodBlock.prototype.createPoly = function(shapeType) {

    if (shapeType == "woodCube") {

        var geometry = new THREE.BoxGeometry(
            this.size, this.size, this.size, this.tri, this.tri, this.tri
        );
        var material = new THREE.MeshBasicMaterial({
            color: this.color3,
            wireframe: true,
            wireframeLinewidth: this.wireWidth,
        });
        var poly = new THREE.Mesh(
            geometry, material
        );

        return poly;

    } else {

        var that = this;

        switch(shapeType){

            case "bird":
                var geometry = new BirdGeometry(this.size);
                var material = new THREE.MeshBasicMaterial({
                    color: this.color3,
                    side: THREE.DoubleSide,
                })

                var note = new THREE.Mesh(
                    geometry,
                    material
                );

                return note;

            default:

                var geometry;

                switch (shapeType){
                    case "tetrahedron": //4 faces / 3
                        geometry = new THREE.TetrahedronGeometry( that.size );
                        break;

                    case "cube": //6 faces / 4
                        geometry = new THREE.BoxGeometry( that.size, that.size, that.size);
                        break;

                    case "octahedron": //8 faces / 3x4
                        geometry = new THREE.OctahedronGeometry( that.size, 0);
                        break;

                    case "dodecahedron": // 12 faces / 5
                        geometry = new THREE.DodecahedronGeometry( that.size, 0);
                        break;

                    case "icosahedron": // 20 faces / 3x6
                        geometry = new THREE.IcosahedronGeometry( that.size, 0);
                        break;

                    case "icosahedron1": // 20 faces / 3x6
                        geometry = new THREE.IcosahedronGeometry( that.size, 1);
                        break;

                    case "sphere":
                        geometry = new THREE.SphereGeometry( that.size, that.tri, that.tri);
                        break;
                }

                // // update random vertices
                // for (var i = 0;  i < geometry.vertices.length; i++) {
                //     geometry.vertices[i].x += -that.size/2 + Math.random()*that.size
                //     geometry.vertices[i].y += -that.size/2 + Math.random()*that.size

                // }

                var material = new THREE.MeshPhongMaterial({
                    color: that.color3,
                    emissive: 0x072534,
                    flatShading: true,
                    side: THREE.DoubleSide,
                    wireframe: true,
                    wireframeLinewidth: that.wireWidth,
                });

                var note = new THREE.Mesh(
                    geometry, material
                );
                note.name = "note";

                return note;

                // add lines for edges
                // var lineMaterial = new THREE.LineBasicMaterial({
                //     color: new THREE.Color("darkgrey"),
                //     transparent: true,
                //     opacity: 0.5
                // });
                // var lines = new THREE.LineSegments(
                //     new THREE.EdgesGeometry(geometry), lineMaterial
                // );
                // lines.name = "lines";

                // var noteGroup = new THREE.Group();
                // noteGroup.add(lines);
                // noteGroup.add(note);

                // return noteGroup;

        }

    }

}

WoodBlock.prototype.changeColor = function(totalTime, finalColor, cycle){
    changeMaterialColor(this, 'poly', totalTime, finalColor, cycle);

}

WoodBlock.prototype.beat = function(beats, bpm, br, s) {

    var t = new TimelineLite({paused: true});

    var bpm=bpm, prev_rest=0.0, br=br, s=s;
    for ( var i = 0; i < beats.length; i++) {

        if ('beat' in beats[i]){
            t = t.call(
                this.polyPulse,
                [beats[i]['beat']*bpm*setdefault(beats[i]['br'], br),
                 setdefault(beats[i]['s'], s)],
                this, prev_rest.toFixed(3)
            )

            prev_rest += beats[i]['beat']*bpm;
        } else {
            prev_rest += beats[i]['rest']*bpm;
        }
    }
    t.play();

}


WoodBlock.prototype.polyPulse = function(timeLapse, strength, points) {
    // timeLapse define how much time for vertices to get back to origin position
    // NOTE: if timeLapse is large, the geometry will be much distorted afterwards
    // use polyPulseDuration to avoid distortion

    var geometry = this.poly.geometry;
    points = setdefault(points, 50);

    var that = this;
    function updatePoly() {

        that.poly.geometry.verticesNeedUpdate = true;

    }

    var newVertices = [];
    for (var i = 0; i < this.oriVertices.length; i++) {
        newVertices[i] = [
            this.oriVertices[i][0] + Math.random()*10 - 5.0,
            this.oriVertices[i][1] + Math.random()*10 - 5.0,
            this.oriVertices[i][2] + Math.random()*10 - 5.0,
        ];
    }
    for (var i = 0; i < geometry.vertices.length; i++) {
        var t = new TimelineLite();

        t.to(this.poly.geometry.vertices[i], timeLapse/2.1,
            {
             ease: RoughEase.ease.config(
                    {template: Power0.easeNone,
                    strength: strength,
                    points: points,
                    taper:  "none",
                    randomize: true,
                    clamp: false}
                   ),
             x: newVertices[i][0],
             y: newVertices[i][1],
             z: newVertices[i][2],
             onUpdate: updatePoly,
            }
        )
        .to(this.poly.geometry.vertices[i], timeLapse/2.1,
            {
             ease: RoughEase.ease.config(
                    {template: Power0.easeNone,
                    strength: strength,
                    points: points,
                    taper:  "none",
                    randomize: true,
                    clamp: false}
                   ),
             x: this.oriVertices[i][0],
             y: this.oriVertices[i][1],
             z: this.oriVertices[i][2],
             onUpdate: updatePoly,
            }
        );
    }

}


WoodBlock.prototype.polyPulseDuration = function(timeLapse, strength, points, duration) {

    var that = this;

    var numTimes = Math.round(duration*1.0 / timeLapse);

    var t = new TimelineLite({paused: true});

    for (var i = 0; i < numTimes; i++){
        t = t.call(
            that.polyPulse,
            [timeLapse, strength, points],
            that,
            "+=" + timeLapse
        )
    }
    t.play();

}

WoodBlock.prototype.polyRotate = function(x, y, z, timeLapse, repeat) {

    var that = this;
    function updatePoly() {
        that.poly.rotation.x += x;
        that.poly.rotation.y += y;
        that.poly.rotation.z += z;
        that.poly.geometry.verticesNeedUpdate = true;
    }

    // need TweenMax (instead of TweenLite) to use repeat
    TweenMax.to(
        this.poly, timeLapse,
        {
            repeat: repeat,
            onUpdate: updatePoly,
        },
    );
}

WoodBlock.prototype.polyRotateDuration = function(rotation, duration) {

    var that = this;
    function updatePoly() {
        that.poly.rotation.x += rotation[0];
        that.poly.rotation.y += rotation[1];
        that.poly.rotation.z += rotation[2];
        that.poly.geometry.verticesNeedUpdate = true;
    }

    TweenLite.to(
        this.poly, duration,
        {
            onUpdate: updatePoly,
        },
    );
}

// naive mapping
var harmonicShapeMap = {
    'd': 'tetrahedron', //1, 2, 4, 8, 16
    'r': 'dodecahedron', // 9
    'm': 'octahedron', // 5, 10
    'f': 'icosahedron1',
    's': 'cube', //3, 6, 12
    'l': 'icosahedron',
    't': 'icosahedron1' // 15
}

WoodBlock.prototype.polyExpand = function(scale, duration) {

    var that = this;
    function updatePoly(){
        that.poly.geometry.verticesNeedUpdate = true;
        console.log(that.poly.geometry.scale);
    }

    TweenLite.to(
        this.poly.geometry.scale, duration,
        {
            x: scale,
            y: scale,
            z: scale,
            onUpdate: updatePoly,
        }
    )


}