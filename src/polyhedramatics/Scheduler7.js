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
            size = 50,
            polyType = 'flute';

        var polyData = POLYHEDRA[instruMap[polyType]['solidName']];

        var localPlane = new THREE.Plane(
            pos2v([0, .8, .2]), 0.8
        )

        var poly = new Polyhedra(center_pos,
                                 size,
                                 polyData,
                                 instruMap[polyType]['faceColors'],
                                 [localPlane]
                                )

        poly.name = 'poly';
        poly.castShadow = true;
        poly.receiveShadow = true;

        SCENE.add(poly);

        poly.polyRotateDuration([0.01, 0.01, 0.01], 10)


        var ground = new THREE.Mesh(
                new THREE.PlaneBufferGeometry( 500, 500, 1, 1 ),
                new THREE.MeshStandardMaterial( {
                    color: new THREE.Color(0xefd1b5),
                    shininess: 150
                } )
            );
        ground.rotation.x = - Math.PI / 2; // rotates X/Y to X/Z
        ground.receiveShadow = true;
        ground.position.set(0, -100, 0);
        SCENE.add( ground );


        var spotLight = new THREE.SpotLight( 0x55505a, 2 );
        spotLight.castShadow = true;
        spotLight.shadow.camera.near = 10;
        spotLight.shadow.camera.far = 500;
        spotLight.shadow.camera.fov = 50;

        spotLight.shadowDarkness = 1.0;
        spotLight.shadowCameraVisible = true;

        SCENE.add(spotLight);

        spotLight.position.set(0, 500, 0);
        lightHelper1 = new THREE.SpotLightHelper( spotLight );

        SCENE.add(lightHelper1);

                // var dirLight = new THREE.DirectionalLight( 0x55505a, 1 );
                // dirLight.position.set( 0, 1000, 0 );
                // dirLight.castShadow = true;
                // dirLight.shadow.camera.near = 1;
                // dirLight.shadow.camera.far = 10;
                // dirLight.shadow.camera.right = 1;
                // dirLight.shadow.camera.left = - 1;
                // dirLight.shadow.camera.top  = 1;
                // dirLight.shadow.camera.bottom = - 1;
                // dirLight.shadow.mapSize.width = 1024;
                // dirLight.shadow.mapSize.height = 1024;
                // SCENE.add( dirLight );


    }
}