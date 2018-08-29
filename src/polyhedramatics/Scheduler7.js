/* [281- sec]

*/


var Scheduler7 = function(startTime) {

    var that = this;
    this.START = setdefault(startTime, 281);

    this.program = [
        'initCamera',
        'singPolyhedra'
    ]

    this.startSecond = [
        this.START,
        this.START,
    ]


    // SCENE background color 0xefd1b5
    // SCENE fog degree 0.1
    this.initCamera = function(){
        SCENE.background = new THREE.Color(0xefd1b5);
        CAMERA.position.set(0, 0, 200);
        CAMERA.lookAt(0, 0, 0);
        CAMERA.rotation.set(0, 0, 0);
    }

    this.singPolyhedra = function(){
        var center_pos = [0, 0, 0],
            size = 100,
            polyType = 'flute';

        var polyData = POLYHEDRA[instruMap[polyType]['solidName']];
        var poly = new Polyhedra(center_pos,
                                 size,
                                 polyData,
                                 instruMap[polyType]['faceColors']
                                )

        poly.name = 'poly';
        SCENE.add(poly);

        poly.polyRotateDuration([0.001, 0.001, 0.001], 10)
        // var mesh = polyhedronDataToMesh(POLYHEDRA.TruncatedIcosidodecahedron);
        // mesh.name = 'sing';
        // SCENE.add(mesh);

    }
}