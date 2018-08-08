var WoodBlock = function(center_pos, size, tri, majorColor) {
    THREE.Group.apply(this, arguments);

    //// create cube
    var cube = this.createCube(size, size, size, tri, majorColor);
    cube.position.set(center_pos[0], center_pos[1], center_pos[2]);
    this.cube = cube;
    this.add(cube);

    this.oriVertices = [];
    for (var i = 0; i < cube.geometry.vertices.length; i++) {
        this.oriVertices[i] = v2pos(cube.geometry.vertices[i]);
    }
}

WoodBlock.prototype = Object.create(THREE.Group.prototype);
WoodBlock.prototype.constructor = WoodBlock;

WoodBlock.prototype.createCube = function(w, h, d, tri, majorColor) {

    var geometry = new THREE.BoxGeometry(
        w, h, d, tri, tri, tri
    );
    var material = new THREE.MeshBasicMaterial({
        color:new THREE.Color(setdefault(ColorMap[majorColor], [0, 0, majorColor])[2]),
        wireframe: true,
        wireframeLinewidth: 1,
    });
    var cube = new THREE.Mesh(
        geometry, material
    );
    return cube;
}


WoodBlock.prototype.cubePulse = function(timeLapse, strength) {

    var geometry = this.cube.geometry;

    var that = this;
    function updateCube() {

        that.cube.geometry.verticesNeedUpdate = true;

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

        t.to(this.cube.geometry.vertices[i], timeLapse/2.1,
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
             onUpdate: updateCube,
            }
        )
        .to(this.cube.geometry.vertices[i], timeLapse/2.1,
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
             onUpdate: updateCube,
            }
        );
    }

}

WoodBlock.prototype.cubeRotate = function(x, y, z, timeLapse, repeat) {

    var that = this;
    function updateCube() {
        that.cube.rotation.x += x;
        that.cube.rotation.y += y;
        that.cube.rotation.z += z;
        that.cube.geometry.verticesNeedUpdate = true;
    }

    TweenMax.to(
        this.cube, timeLapse,
        {
            repeat: repeat,
            onUpdate: updateCube,
        },
    );
}