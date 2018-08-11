var FlyingNote = function(center_pos, majorColor, length, size, shapeType, wireWidth, trailWidth, trailBlending) {

    THREE.Group.apply(this, arguments);

    var that = this;
    this.color = setdefault(ColorMap[majorColor], ["white", 0, majorColor])[2]
    this.color3 = new THREE.Color(this.color);
    this.size = size;
    this.center_pos = center_pos;
    this.length = length;
    this.shapeType = shapeType;
    this.wireWidth = wireWidth;
    this.trailWidth = setdefault(trailWidth, 10);
    this.trailBlending = setdefault(trailBlending, THREE.AdditiveBlending);

    var note = this.initNote();
    this.note = note;
    this.add(note);

    var trail = this.initTrail();
    this.trail = trail;
    this.trail_initialized = true;
    this.add(trail);

    this.trailHeadPosition = new THREE.Vector3().add(pos2v(this.center_pos));

}

FlyingNote.prototype = Object.create(THREE.Group.prototype);
FlyingNote.prototype.constructor = FlyingNote;

FlyingNote.prototype.oscillate = function(timeLapse, strength) {

    var geometry = this.note.geometry;
    var that = this;

    function updateNote() {
        that.note.geometry.verticesNeedUpdate = true;
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

        t.to(this.note.geometry.vertices[i], timeLapse/2.1,
            {
             ease: RoughEase.ease.config(
                    {template: Power0.easeNone,
                    strength: strength,
                    points: 50,
                    taper:  "none",
                    randomize: true,
                    clamp: false}
                   ),
             x: newVertices[i][0],
             y: newVertices[i][1],
             z: newVertices[i][2],
             onUpdate: updateNote,
            }
        )
        .to(this.note.geometry.vertices[i], timeLapse/2.1,
            {
             ease: RoughEase.ease.config(
                    {template: Power0.easeNone,
                    strength: strength,
                    points: 50,
                    taper:  "none",
                    randomize: true,
                    clamp: false}
                   ),
             x: this.oriVertices[i][0],
             y: this.oriVertices[i][1],
             z: this.oriVertices[i][2],
             onUpdate: updateNote,
            }
        );
    }
}


FlyingNote.prototype.move = function(duration, offset, rotation) {
    var that = this;
    TweenLite.to(
        that, duration,
        {
            onUpdate: function(){
                that._move(offset, rotation);
            }
        }
    )
}

FlyingNote.prototype._move = function(offset, rotation){

    var velocity = pos2v(offset);

    this.trailHeadPosition.add(velocity);

    if (this.trail_initialized) {
        this.trailLine.advance(this.trailHeadPosition);
    }

    this.note.position.set(this.trailHeadPosition.x,
                           this.trailHeadPosition.y,
                           this.trailHeadPosition.z
                           );
    this.note.rotation.x += rotation[0];
    this.note.rotation.y += rotation[1];
    this.note.rotation.z += rotation[2];

}


FlyingNote.prototype.initTrail = function(){

    // adopted & modified from THREE.MeshLine birds.html / Boid object

    // Create the line geometry used for storing verticies
    var geometry = new THREE.Geometry();
    for (var i = 0; i < this.length; i++) {
        geometry.vertices.push(pos2v(this.center_pos))                  ;
    }

    // Create the line mesh
    var trailLine = new MeshLine();
    trailLine.setGeometry(
        geometry,
        function(p){
            return p;
            // return 2 + Math.sin( 50 * p );
        } // set width taper
    )

    // Create the line material
    var trailMaterial = new MeshLineMaterial({
        color: this.color3,
        opacity: 1,
        sizeAttenuation: 1,
        lineWidth: this.trailWidth,
        near: 1,
        far: 100000,
        depthTest: false,
        blending: this.trailBlending,
        transparent: true,
        side: THREE.DoubleSide
    })

    var trail = new THREE.Mesh(
        trailLine.geometry,
        trailMaterial
    );
    trail.frustumCulled = false;

    this.trailLine = trailLine;
    this.trailMaterial = trailMaterial;
    trail.name = "trail";

    return trail;

}


FlyingNote.prototype.initNote = function(){

    if (this.shapeType) {
        var note = this.createNoteMesh(this.shapeType, this.wireWidth);

        note.position.set(this.center_pos[0], this.center_pos[1], this.center_pos[2]);
        note.rotation.set(Math.PI/5, Math.PI/5, 0)

        this.oriVertices = [];
        for (var i = 0; i < note.geometry.vertices.length; i++) {
            this.oriVertices[i] = v2pos(note.geometry.vertices[i]);
        }

        return note;
    } else {
        return new THREE.Group();
    }
}


FlyingNote.prototype.createNoteMesh = function(shapeType, wireWidth){

    shapeType = setdefault(shapeType, "icosahedron");
    wireWidth = setdefault(wireWidth, 1.1);
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
            var noteGroup = getPolyhedra(shapeType, wireWidth);
            return noteGroup;

    }

    function getPolyhedra(shapeType){
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
            wireframeLinewidth: wireWidth,
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

var BirdGeometry = function (scale) {

    // adopted & modified from THREE.MeshLine Bird.js

    var that = this;

    THREE.Geometry.call( this );

    v(   5,   0,   0 );
    v( - 5, - 2,   1 );
    v( - 5,   0,   0 );
    v( - 5, - 2, - 1 );

    v(   0,   2, - 6 );
    v(   0,   2,   6 );
    v(   2,   0,   0 );
    v( - 3,   0,   0 );

    f3( 0, 2, 1 );
    // f3( 0, 3, 2 );

    f3( 4, 7, 6 );
    f3( 5, 6, 7 );

    this.computeFaceNormals();

    function v( x, y, z ) {

        that.vertices.push( new THREE.Vector3( x*scale, y*scale, z*scale ) );

    }

    function f3( a, b, c ) {

        that.faces.push( new THREE.Face3( a, b, c ) );

    }

}

BirdGeometry.prototype = Object.create( THREE.Geometry.prototype );
BirdGeometry.prototype.constructor = BirdGeometry;

