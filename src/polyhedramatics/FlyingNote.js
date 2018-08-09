var FlyingNote = function(center_pos, majorColor, scale) {

    THREE.Group.apply(this, arguments);

    this.color = setdefault(ColorMap[majorColor], [0, majorColor])[2]

    var geometry = new BirdGeometry(scale);
    var material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(this.color),
        side: THREE.DoubleSide,
    })

    var flyingNote = new THREE.Mesh(
        geometry,
        material
    );

    flyingNote.position.set(center_pos[0], center_pos[1], center_pos[2]);
    flyingNote.rotation.set(Math.PI/5, Math.PI/5, 0)
    this.note = flyingNote;

    this.add(flyingNote);

}

FlyingNote.prototype = Object.create(THREE.Group.prototype);
FlyingNote.prototype.constructor = FlyingNote;


var BirdGeometry = function (scale) {
// adopted from THREE.MeshLine bird.js

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

