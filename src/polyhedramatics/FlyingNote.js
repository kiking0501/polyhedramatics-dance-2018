var FlyingNote = function(headPoly, center_pos, majorColor, length, trailWidth, trailBlending) {

    // Input HeadPoly should be THREE.Group object,
    // optional with .poly being a THREE.Mesh instance (e.g. a WoodBlock instance)

    THREE.Group.apply(this, arguments);

    var that = this;
    this.color = setdefault(ColorMap[majorColor], ["white", 0, majorColor])[2]
    this.color3 = new THREE.Color(this.color);
    this.center_pos = center_pos;
    this.length = length;
    this.trailWidth = setdefault(trailWidth, 10);
    this.trailBlending = setdefault(trailBlending, THREE.AdditiveBlending);

    this.headPoly = headPoly;
    this.add(headPoly);

    var trail = this.initTrail();
    this.trail = trail;
    this.trail_initialized = true;
    this.add(trail);

    this.trailHeadPosition = new THREE.Vector3().add(pos2v(this.center_pos));

}

FlyingNote.prototype = Object.create(THREE.Group.prototype);
FlyingNote.prototype.constructor = FlyingNote;

FlyingNote.prototype.funcMoveDuration = function(func, duration) {
    var that = this;
    TweenLite.to(
        that, duration,
        {
            onUpdate: function(){
                that.move(func(v2pos(that.trailHeadPosition)));
            }
        }
    )
}

FlyingNote.prototype.moveDuration = function(offset, duration) {
    var that = this;
    TweenLite.to(
        that, duration,
        {
            onUpdate: function(){
                that.move(offset);
            }
        }
    )
}

FlyingNote.prototype.move = function(offset){

    var velocity = pos2v(offset);

    this.trailHeadPosition.add(velocity);

    this.advance(v2pos(this.trailHeadPosition));

}

FlyingNote.prototype.advance = function(pos) {

    this.trailHeadPosition.set(pos[0], pos[1], pos[2]);

    if (this.trail_initialized) {
        this.trailLine.advance(this.trailHeadPosition);
    }

    if (this.headPoly) {

        var mesh;

        if (typeof this.headPoly.poly != "undefined") {
            mesh = this.headPoly.poly;
        } else {
            mesh = this.headPoly;
        }
        mesh.position.set(this.trailHeadPosition.x,
                          this.trailHeadPosition.y,
                          this.trailHeadPosition.z
                         );
    }
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

