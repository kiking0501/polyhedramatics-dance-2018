/* [281- 357 sec] Quintet Polyhedra World with Gb Harmonics!

*/


var Scheduler7 = function(startTime) {

    var that = this;
    this.START = setdefault(startTime, 281);
    this.MID_END = 354;   // 281 + 73
    this.END = 357;  //281 + 76

    this.program = [
        'initCamera',
        'initWinds',
        'singEngHorn',
        'singClarinet',
        'singOboe',
        'singFlute',
        'singBassoon',
        'tuneOpacity',
        'orbitCamera',
        'shineTheWorld',
        'singHarmonics',
        'cleanSingHarmonics',
        'cleanQuintet',
        'demoHarmonics',
    ]

    this.startSecond = [
        this.START,
        this.START, // createBoids
        this.START,      //Quintet1, 281
        this.START + 14, //Quintet2, 295
        this.START + 18, //Quintet3, 299
        this.START + 23, //Quintet4, 304
        this.START + 27, //Quintet5, 308
        this.START + 29, //tune opacity //310, checkpoint
        this.START + 29, // OrbitCamera //310, checkpoint, until 345 sec
        this.START + 29, // shine the world
        this.START + 29, // singHarmonices
        this.START + 69, // clean singHarmonics
        this.START + 64, // 345 sec when Camera starts move, clean Singings,
        this.START + 64, // show String Harmonics

    ]


    // SCENE background color 0xefd1b5
    // SCENE fog degree 0.1
    this.initCamera = function(){
        SCENE.background = new THREE.Color(0xefd1b5);

        CAMERA.position.set(0, 50, 200);  // 0, 50, 200
        CAMERA.lookAt(0, 0, 0);
        CAMERA.rotation.set(0, 0, 0);
    }

    this._initObjs = function(){
        var program_names = [
            // ['initWinds', 'winds'],
            ['singEngHorn', 'engHorn'],
            ['singClarinet', 'clarinet'],
            ['singOboe', 'oboe'],
            ['singFlute', 'flute'],
            ['singBassoon', 'bassoon'],
        ];

        for (var i = 0; i < program_names.length; i++) {
            var program = program_names[i][0];
            var objName = program_names[i][1];

            var obj = SCENE.getObjectByName(objName);
            if (typeof obj == 'undefined') {
                this[program](true);
            }
        }
    }

    this.initWinds = function(){
        var bNum = 100,
            majorColor = "powderblue",
            length = 200,
            vScalar = 1;

        var winds = new BoidGroup(bNum, majorColor, length, vScalar);
        winds.name = "winds";
        SCENE.add(winds);

        var t = new TimelineLite();

        t.to(
            winds, 12,
            {
                onUpdate: winds.onUpdate,
                onUpdateParams: [winds],
            }
        ).call(
            function(){
                var obj = SCENE.getObjectByName('winds');
                obj.changeOpacity(.8, 0, 2);
            },
            [], this, "10",
        ).call(
            function(){
                var obj = SCENE.getObjectByName('winds');
                disposeHierarchy(obj);
                SCENE.remove(obj);
            },
            [],
            this,
            "12"
        )
    }

    this.singEngHorn = function(initOnly){
        // start at 281, end at 295+
        initOnly = setdefault(initOnly, false);

        var localPlane = new THREE.Plane(
            pos2v([0, .8, .2]), 0.8
        )

        var center_pos = [-80, 0, 0],
            size = 120,
            polyType = 'engHorn';

        var polyData = POLYHEDRA[instruMap[polyType]['solidName']];
        var poly = new Polyhedra(center_pos,
                                 size,
                                 polyData,
                                 instruMap[polyType]['faceColors'],
                                 [localPlane]
                                )
        poly.name = 'engHorn';
        poly.castShadow = true;
        poly.receiveShadow = true;

        SCENE.add(poly);

        poly.polyRotateDuration([0.008, 0.003, 0.003], 64);


        if (!initOnly) {
            var t = new TimelineLite();
            t.from(
                poly.position, 10,
                {
                    y: -125,
                    ease: Linear.easeNone,
                }
            ).call(
                poly.polyRotateDuration,
                [[0.01, 0.0, -0.05], 3.3],
                poly
            )
            .to(
                poly.position, 30,
                {
                    y: 100,
                    ease: Linear.easeNone,
                }
            ).call(
                poly.changeOpacity,
                [0.0, 1.0, 4],
                poly,
                "0"
            ).call(
                poly.changeOpacity,
                [1.0, 0.1, 4],
                poly,
                "15"
            ).call(
                poly.changeOpacity,
                [0.1, 1.0, 4],
                poly,
                "19"
            ).to(
                poly.scale, 5,
                {
                    x: 2.5,
                    y: 2.5,
                    z: 2.5
                },
                "29"
            )
        }

    }

    this.singClarinet = function(initOnly){
        // start at 295, end at 299 +
        initOnly = setdefault(initOnly, false);

        var localPlane = new THREE.Plane(
            pos2v([0, .8, .2]), 0.8
        )

        var center_pos = [-80, 40, 30],
            size = 30,
            polyType = 'clarinet';

        var polyData = POLYHEDRA[instruMap[polyType]['solidName']];
        var poly = new Polyhedra(center_pos,
                                 size,
                                 polyData,
                                 instruMap[polyType]['faceColors'],
                                 [localPlane]
                                )
        poly.name = 'clarinet';
        poly.castShadow = true;
        poly.receiveShadow = true;

        SCENE.add(poly);

        poly.polyRotateDuration([0.001, 0.000, 0.001], 73-14)

        if (!initOnly) {
            var t = new TimelineLite();
            t.from(
                poly.position, 5,
                {
                    y: -60,
                    ease: Bounce.easeOut,
                }
            )
            .to(
                poly.position, 9,
                {
                    y: 20,
                    ease: Linear.easeNone,
                }
            ).call(
                poly.changeOpacity,
                [0.0, 1.0, 1],
                poly,
                "0"
            )
        }

    }
    this.singOboe = function(initOnly){
        // start at 299, end at 304+
        initOnly = setdefault(initOnly, false);

        var localPlane = new THREE.Plane(
            pos2v([0, .8, .2]), 0.8
        )
        localPlane.translate(pos2v(0, 50, 0));

        var center_pos = [80, 30, 40],
            size = 50,
            polyType = 'oboe';

        var polyData = POLYHEDRA[instruMap[polyType]['solidName']];
        var poly = new Polyhedra(center_pos,
                                 size,
                                 polyData,
                                 instruMap[polyType]['faceColors'],
                                 [localPlane]
                                )
        poly.name = 'oboe';
        poly.castShadow = true;
        poly.receiveShadow = true;

        SCENE.add(poly);


        poly.polyRotateDuration([0.000, 0.001, 0.000], 73-18)

        if (!initOnly){

            var t = new TimelineLite();
            t.from(
                poly.position, 5,
                {
                    y: 50,
                    ease: Bounce.easeOut,
                }
            )
            .to(
                poly.position, 9,
                {
                    y: 20,
                    ease: Linear.easeNone,
                }
            ).call(
                poly.changeOpacity,
                [0.0, 1.0, 1],
                poly,
                "0"
            )
        }

    }

    this.singFlute = function(initOnly){
        //304 to 308+
        initOnly = setdefault(initOnly, false);

        var localPlane = new THREE.Plane(
            pos2v([0, .8, .2]), 0.8
        )
        localPlane.translate(pos2v(0, -50, 0));

        var center_pos = [30, 5, 40],
            size = 40,
            polyType = 'flute';

        var polyData = POLYHEDRA[instruMap[polyType]['solidName']];
        var poly = new Polyhedra(center_pos,
                                 size,
                                 polyData,
                                 instruMap[polyType]['faceColors'],
                                 [localPlane]
                                )
        poly.name = 'flute';
        poly.castShadow = true;
        poly.receiveShadow = true;

        SCENE.add(poly);

        poly.polyRotateDuration([0.00, -0.0, 0.001], 73-23)

        if (!initOnly){

            var t = new TimelineLite();
            t.from(
                poly.position, 2,
                {
                    y: -80,
                    ease: Bounce.easeOut,
                }
            )
            .to(
                poly.position, 9,
                {
                    y: 20,
                    ease: Linear.easeNone,
                }
            ).call(
                poly.changeOpacity,
                [0.0, 1.0, 1],
                poly,
                "0"
            )
        }
    }

    this.singBassoon = function(initOnly){
        //308 to 310+
        initOnly = setdefault(initOnly, false);

        var center_pos = [200, 20, -100],
            size = 350,
            polyType = 'bassoon';

        var polyData = POLYHEDRA[instruMap[polyType]['solidName']];
        var poly = new Polyhedra(center_pos,
                                 size,
                                 polyData,
                                 instruMap[polyType]['faceColors'],
                                )
        poly.name = 'bassoon';
        poly.castShadow = true;
        poly.receiveShadow = true;

        SCENE.add(poly);

        poly.polyRotateDuration([0.00, 0.001, 0.000], 73-27+5)

        if (!initOnly){

            var t = new TimelineLite();
            t.from(
                poly.position, 2,
                {
                    y: -80,
                }
            )
            .to(
                poly.position, 9,
                {
                    y: 20,
                    ease: Linear.easeNone,
                }
            ).call(
                poly.changeOpacity,
                [0.0, 1.0, .5],
                poly,
                "0"
            )
        }
    }

    this.tuneOpacity = function(){
        this._initObjs();

        var quintet = [
            'flute', 'oboe', 'engHorn', 'clarinet', 'bassoon'
        ];

        var t = new TimelineLite();

        t.call(
            function(quintet){
                for (var i = 0; i < quintet.length; i++) {
                    var poly = SCENE.getObjectByName(quintet[i]);
                    poly.changeOpacity(1.0, 0.5, 5);
                }
            },
            [quintet], this, "0"
        )
    }

    this.orbitCamera = function(){
        // start from 310, ends at 345
        this.initCamera();
        RENDERER.localClippingEnabled = false;

        var scale = .001;
        var dist = 150;

        var t = new TimelineLite();
        var dt = Date.now();
        var x = Math.cos(scale * dt) * dist;
        var z = Math.sin(scale * dt) * dist;

        t.to(
            CAMERA.position, 1,
            {
                x: x,
                z: z,
            }
        ).to(
            CAMERA.position, 34,
            {
                onUpdate: function(){
                    var dt = Date.now();
                    var x = Math.cos(scale * dt) * dist;
                    var z = Math.sin(scale * dt) * dist;
                    CAMERA.position.set(x, 50, z);
                    CAMERA.lookAt(0, 0, 0)
                }
            }

        ).to(
            CAMERA.position, 8,
            {
                x: 0,
                y: 0,
                z: 2000,
                onUpdate: function(){
                    CAMERA.lookAt(0, 0, 0);
                }
            }

        )

    }

    this.shineTheWorld = function(){
        //310

        var t = new TimelineLite();

        var shineColor = new THREE.Color("oldlace");
        var dimColor = new THREE.Color(0xefd1b5);

        var t = new TimelineLite();
        t.call(
            function(){
                TweenLite.to(
                    SCENE.background, 1,
                    {
                        r: shineColor.r,
                        g: shineColor.g,
                        b: shineColor.b,

                    }
                )
            },
            [], this, "1"
        ).call(
            function(){
                TweenLite.to(
                    SCENE.background, 1,
                    {
                        r: dimColor.r,
                        g: dimColor.g,
                        b: dimColor.b,

                    }
                )
            },
            [], this, "13"
        ).call(
            function(){
                TweenLite.to(
                    SCENE.background, 1,
                    {
                        r: shineColor.r,
                        g: shineColor.g,
                        b: shineColor.b,

                    }
                )
            },
            [], this, "20"
        ).call(
            function(){
                TweenLite.to(
                    SCENE.background, 1,
                    {
                        r: dimColor.r,
                        g: dimColor.g,
                        b: dimColor.b,

                    }
                )
            },
            [], this, "28"
        ).call(
            function(){
                TweenLite.to(
                    SCENE.background, 1,
                    {
                        r: shineColor.r,
                        g: shineColor.g,
                        b: shineColor.b,

                    }
                )
            },
            [], this, "31"
        ).call(
            function(){
                TweenLite.to(
                    SCENE.background, 1,
                    {
                        r: dimColor.r,
                        g: dimColor.g,
                        b: dimColor.b,

                    }
                )
            },
            [], this, "40"
        )
    }

    this._singHarmonics = function(singInd){

        var polyTypes = ['trombone', 'trombone', 'frenchHorn', 'frenchHorn', 'trumpet'];
        var polyList = [];

        for (var i = 0; i < polyTypes.length; i++) {

            var center_pos = [0, 0, 0],
                size = 50,
                polyType = polyTypes[i];

            var polyData = POLYHEDRA[instruMap[polyType]['solidName']];
            var poly = new Polyhedra(center_pos,
                                     size,
                                     polyData,
                                     instruMap[polyType]['faceColors'],
                                    )
            poly.castShadow = true;
            poly.receiveShadow = true;

            polyList.push(poly);

            poly.poly.material.blending = THREE.AddictiveBlending;
            poly.poly.material.needsUpdate = true;
        }

        return polyList;
    }

    this.singHarmonics = function(){
        // start at 310

        var harmonicSettings = {
            0: {
                'startTime': 4,
                'dt': 1.5,
                'duration': 5,
            },
            1: {
                'startTime': 21,
                'dt': 1.2,
                'duration': 3.5,
            },
            2: {
                'startTime': 34,
                'dt': 1,
                'duration': 2,
            }
        }
        var t = new TimelineLite();

        for (var i = 0; i < 3; i++) {

            var polyHarmonics = this._singHarmonics(i);

            for (var j = 0; j < polyHarmonics.length; j++) {

                var poly = polyHarmonics[j];
                poly.name = "singHarmonics" + i + '_' + j;

                poly.changeOpacity(0.0, 0.0, 0.1);

                var startTime = (harmonicSettings[i]['startTime'] +
                                 j * harmonicSettings[i]['dt']).toString();

                t = t.call(
                    function(obj, ind){
                        SCENE.add(obj);
                        obj.changeOpacity(0.0, 1.0, .01);
                        TweenLite.to(
                            obj.scale, harmonicSettings[ind]['duration'],
                            {
                                x: 5,
                                y: 5,
                                z: 5,
                                ease: Power0.easeIn,
                            }
                        )
                    },
                    [poly, i],
                    this,
                    startTime,
                )
            }

        }

    }

    this.cleanSingHarmonics = function(){
        var obj = SCENE.getObjectByName("bassoon");
        SCENE.remove(obj);
        disposeHierarchy(obj);

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 5; j++) {
                var obj = SCENE.getObjectByName("singHarmonics" + i + '_' + j);
                SCENE.remove(obj);
                disposeHierarchy(obj);
            }

        }

    }
    this.cleanQuintet = function(){

        var quintet = [
            'flute', 'oboe', 'engHorn', 'clarinet',
            // 'bassoon' except the largest
        ];

        for (var i = 0; i < quintet.length; i++){
            var obj = SCENE.getObjectByName(quintet[i]);
            SCENE.remove(obj);
            disposeHierarchy(obj);
        }
    }

    this._showStringHarmonics = function(center_pos, size, polyType, faceColors,
                                         localPlaneZ, localPlaneY) {

        var combinePoly = new THREE.Group();

        var polyData = POLYHEDRA[instruMap[polyType]['solidName']];

        var poly = new Polyhedra(center_pos,
                                 size,
                                 polyData,
                                 faceColors,
                                 [localPlaneZ, localPlaneY]
                                )
        var poly2 = new Polyhedra(center_pos,
                                 size,
                                 polyData,
                                 faceColors,
                                 [localPlaneZ]
                                )
        poly2.changeOpacity(.2, .2, .01);

        combinePoly.add(poly);
        combinePoly.add(poly2);
        return combinePoly;

    }



    this.demoHarmonics = function(){
        // 345 sec

        SCENE.background = new THREE.Color(0xefd1b5);

        CAMERA.position.set(0, 0, 2000);  // from 0, 50, 200 to 0, 0, 2000
        CAMERA.lookAt(0, 0, 0);
        CAMERA.rotation.set(0, 0, 0);

        RENDERER.localClippingEnabled = true;


        var localPlaneYUpper = new THREE.Plane(
            pos2v([0, 1, 0]),
        )
        var localPlaneYLower = new THREE.Plane(
            pos2v([0, -1, 0]),
        )

        var harmonics = [
            'trombone',
            'trombone',
            'trombone',
            'frenchHorn',
            'frenchHorn',
            'frenchHorn',
            'frenchHorn',
            'trumpet',
            'trumpet',
            'trumpet'
        ];
        var majorColors = [
            'original',
            'coral',
            'violet',
            'original',
            'purple',
            'green',
            'marine',
            'original',
            'yellow3',
            'salmon'
        ]

        var minX = -2000, maxX = 2000;

        var harmonicGroup = new THREE.Group();
        var harmonicNum = [];

        for (var i = 0; i < harmonics.length; i++) {

            var Z = -500;

            var localPlaneZ = new THREE.Plane(
                pos2v([0, 0, -1]),
            )
            localPlaneZ.translate(pos2v(0, 0, Z));


            var div = i + 2;
            var polyType = harmonics[i];

            var size = (maxX - minX) / div;

            var faceColors = instruMap[polyType]['faceColors'];
            if (i > 0) {
                for (var j in faceColors) {
                    faceColors[j].r = faceColors[j].r +  Math.random() - .5;
                    faceColors[j].g = faceColors[j].g +  Math.random() - .5;
                    faceColors[j].b = faceColors[j].b +  Math.random() - .5;
                    if (majorColors[i] != 'original') {
                        faceColors[j] = ColorMap[majorColors[i]][j % 3]; //new THREE.Color("red");
                    }
                }
            }

            for (var j = 0; j < div; j++) {

                var center_pos = [
                                    minX + j * size  + size / 2.0,
                                    0,
                                    Z
                                 ];

                if ((j) % 2 == 0){
                    var planeY = localPlaneYUpper;
                } else {
                    var planeY = localPlaneYLower;
                }


                var poly = this._showStringHarmonics(
                    center_pos, size, polyType, faceColors,
                    localPlaneZ, planeY
                )
                poly.name = "harmonic" + i + '_' + j;
                harmonicGroup.add(poly);

            }

            harmonicNum.push(div);
        }

        var t = new TimelineLite();
        for (var i = 0; i < harmonicNum.length; i++) {

            t = t.call(
                function(ind){
                    var div = harmonicNum[ind];

                    for (var j = 0; j < div; j++) {
                        var poly = harmonicGroup.getObjectByName("harmonic" + ind + '_' + j);
                        SCENE.add(poly);


                        TweenLite.from(
                            poly.position, 1, {
                                z: -1000,
                                onComplete: function(p) {
                                    TweenLite.to(
                                        p.position, 5, {
                                            z: 5000,
                                        }
                                    )
                                },
                                onCompleteParams: [poly],
                            }
                        )
                    }

                },
                [i],
                this,
                "+=.9"
            )

        }

        t = t.call(
            function(){
                for (var i = 0; i < harmonicNum.length; i++) {
                    var div = harmonicNum[i];
                    for (var j = 0; j < div; j++) {
                        var obj = SCENE.getObjectByName("harmonic" + i + '_' + j);
                        SCENE.remove(obj);
                        disposeHierarchy(obj);
                    }
                }

            },
            [],
            this,
            "12"

        )
    }

        // // testing code on light
        // var ground = new THREE.Mesh(
        //         new THREE.PlaneBufferGeometry( 500, 500, 1, 1 ),
        //         new THREE.MeshStandardMaterial( {
        //             color: new THREE.Color(0xefd1b5),
        //             shininess: 150
        //         } )
        //     );
        // ground.rotation.x = - Math.PI / 2; // rotates X/Y to X/Z
        // ground.receiveShadow = true;
        // ground.position.set(0, -100, 0);
        // SCENE.add( ground );


        // var spotLight = new THREE.SpotLight( 0x55505a, 2 );
        // spotLight.castShadow = true;
        // spotLight.shadow.camera.near = 10;
        // spotLight.shadow.camera.far = 500;
        // spotLight.shadow.camera.fov = 50;

        // spotLight.shadowDarkness = 1.0;
        // spotLight.shadowCameraVisible = true;

        // SCENE.add(spotLight);

        // spotLight.position.set(0, 500, 0);
        // lightHelper1 = new THREE.SpotLightHelper( spotLight );

        // SCENE.add(lightHelper1);


}