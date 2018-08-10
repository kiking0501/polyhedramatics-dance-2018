var FlyingNote = function(center_pos, majorColor, length, size) {

    THREE.Group.apply(this, arguments);

    var that = this;
    this.color = setdefault(ColorMap[majorColor], ["white", 0, majorColor])[0]
    this.color3 = new THREE.Color(this.color);
    this.size = size;
    this.center_pos = center_pos;
    this.length = length;

    var note = this.initNote();
    this.note = note;
    this.add(note);

    var trail = this.initTrail();
    this.trail = trail;
    this.trail_initialized = true;
    this.add(trail);

    this.trailHeadPosition = new THREE.Vector3();

}

FlyingNote.prototype = Object.create(THREE.Group.prototype);
FlyingNote.prototype.constructor = FlyingNote;

FlyingNote.prototype.move = function(offset){

    var velocity = pos2v(offset);

    this.trailHeadPosition.add(velocity);

    if (this.trail_initialized) {
        this.trailLine.advance(this.trailHeadPosition);
    }

    this.note.position.set(this.trailHeadPosition.x,
                           this.trailHeadPosition.y,
                           this.trailHeadPosition.z
                           );

}

FlyingNote.prototype.initTrail = function(){

    // adopted & modified from THREE.MeshLine birds.html / Boid object

    // Create the line geometry used for storing verticies
    var geometry = new THREE.Geometry();
    for (var i = 0; i < this.length; i++) {
        geometry.vertices.push(this.position.clone());
    }

    // Create the line mesh
    var trailLine = new MeshLine();
    trailLine.setGeometry(
        geometry,
        function(p){ return p; } // set width taper
    )

    // Create the line material
    var trailMaterial = new MeshLineMaterial({
        color: this.color3,
        opacity: 1,
        sizeAttenuation: 1,
        lineWidth: 10,
        near: 1,
        far: 100000,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        transparent: false,
        side: THREE.DoubleSide
    })

    var trail = new THREE.Mesh(
        trailLine.geometry,
        trailMaterial
    );
    trail.frustumCulled = false;

    this.trailLine = trailLine;
    this.trailMaterial = trailMaterial;

    return trail;

}


FlyingNote.prototype.initNote = function(){

    var geometry = new BirdGeometry(this.size);
    var material = new THREE.MeshBasicMaterial({
        color: new THREE.Color("white"),
        side: THREE.DoubleSide,
    })

    var note = new THREE.Mesh(
        geometry,
        material
    );
    note.position.set(this.center_pos[0], this.center_pos[1], this.center_pos[2]);
    note.rotation.set(Math.PI/5, Math.PI/5, 0)
    return note;
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

