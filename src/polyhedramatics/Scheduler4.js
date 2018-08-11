var Scheduler4 = function(startTime) {
    var that = this;

    this.START = setdefault(startTime, 70);
    this.MID = this.START + 8;

    this.program = [
        'shineTunnel',
        'addBackGroundWave',
        'backGroundWavePulse',
        'showSoundWave',
        'startFlyingNotes',
        'killSlowMelody',
        'flyingNotes2',
        'flyingNotes3',
        'flyingNotes4',
        'rotateCamera',
        'speedUpCamera',
        'cleanFlyingNotesTunnel',
        'createPlanet',
        'beatWoodBlocks',
        'cleanBackGroundWave',
        'rushWoodBlockCenter',
    ];

    this.startSecond = [ // checkpoint at 60 sec from last Scheduler
        this.START, // shineTunnel
        this.START,
        this.START + 5.5, //backgroundwave pulse
        this.START + 26, // show soundWave at 96
        this.START, // startflyingNote end at +8 then callback
        this.START + 8,
        this.START + 8.5, // flyingNote2 end at +8 then callback
        this.START + 35, // flyingNote3 end at +8 then callback
        this.START + 41, // flyingNote4 end at +8 then callback
        this.START + 45, // rotate camera
        this.START + 65.5, // speedUp camera at 135sec, as a checkpoint
        this.START + 65, // displse flyingnotes when they are out of farplane
        this.START + 83, // createPlanet at woodBlockCenter
        this.START + 83, // beatWoodBlocks, 153sec
        this.START + 83, // clean background wave
        this.START + 87, // rushWoodBlockCenter

    ]

    this.finalCameraPosition = [-400, 6.12, -6665]; //final after rotateCamera
    this.finalViewZ = -17000;

    this.woodBlockCenterPos = [
         this.finalCameraPosition[0],  this.finalCameraPosition[1],
        -15000
    ];


    this._shineTunnel = function(totalTime, minSize, maxSize, layerDelay){

        for (var i = 1; i <= 5; i++){
            var bigNote = SCENE.getObjectByName('bigNote' + i);
            melodyNoteUtil = new MelodyNote();
            melodyNoteUtil.pulsePoints(
                bigNote, totalTime, minSize, maxSize, ColorMap['yellow'][0], layerDelay
            );
        }

    }

    this.shineTunnel = function(){

        TweenLite.delayedCall(
            14,
            this._shineTunnel, [2, 3, 6, 0.1], this
        )
        TweenLite.delayedCall(
            28,
            this._shineTunnel, [2, 3, 6, 0.05], this
        )

    }
    this.addBackGroundWave = function(){
        // run at 70sec
        // SCENE.fog.near = 3000;
        // SCENE.fog.far = 4000;

        var angle = Math.PI + Math.PI/2/2;
        var dist = 2000;
        var center_pos = [0, Math.cos(angle), -dist + dist* Math.sin(angle)],
            xNum = 50,
            yNum = 50,
            zNum = 30,
            majorColor = 'royalblue',
            size = 30,
            dist = 300,
            isLattice = true;

        var backGroundWave = new SoundWave(
            center_pos, xNum, yNum, zNum, majorColor, size, dist, isLattice
        );
        backGroundWave.position.set(0, 0, -280);
        backGroundWave.name = 'backGroundWave';
        SCENE.add(backGroundWave);

        TweenLite.from(
            backGroundWave.position, 5,
            {
                z: -5000
            }
        )

        var totalTime = 50,
            delaySpeed = 0.1,
            magnitude = 100,
            t_scale = 1,
            timeLine = new TimelineLite({pause:true});

        var t = backGroundWave.setLinearMovement(
            totalTime, delaySpeed, magnitude, t_scale, timeLine
        );

        t.play();

    }

    this.backGroundWavePulse = function() {
        // start at 75.5
        var backGroundWave = SCENE.getObjectByName('backGroundWave');


        var shineColor = "blue";
        var t = new TimelineLite({paused: true});

        t.call(
            backGroundWave.pulseParticle, [5, 30, 45, shineColor], backGroundWave //most at 78
        ).call(
            backGroundWave.pulseParticle, [5, 30, 50, shineColor], backGroundWave, "+=9.5" // most at 92.5sec
        )

        t.play();
    }

    this.showSoundWave = function(){
        // at 96sec
        var center_pos = [-2000,0,-2000],
            xNum = 100,
            yNum = 100,
            zNum = 5,
            majorColor = 'black',
            size = 50,
            dist = 1000;

        var soundWave = new SoundWave(center_pos, xNum, yNum, zNum, majorColor, size, dist);
        soundWave.rotation.y = Math.PI/2;

        soundWave.name = 'highPitchSoundWave';
        SCENE.add(soundWave);

        var totalTime = 30;
        delaySpeed = 0.02;
        magnitude = 1000;
        t_scale = 1;

        var pulseT = soundWave.setLinearMovement(
            totalTime, delaySpeed, magnitude, t_scale, new TimelineLite({paused:true}), "cylindrical"
        );
        var shineColors = ["hotpink", "slateblue"],
            dimColor = "black";

        pulseT.call(
            soundWave.pulseParticle, [4.5, 50, 50, shineColors[0], false], soundWave, "0" // 96 to 99
        )
        .call(
            soundWave.pulseParticle, [2, 50, 40, dimColor, false], soundWave, "3"
        )
        .call(
            soundWave.pulseParticle, [4, 40, 50, shineColors[1], false], soundWave, "4" // 100 to 104
        )
        .call(
            soundWave.pulseParticle, [10, 50, 40, dimColor, false], soundWave, "8" // 104 to 114
        )
        .call(
            soundWave.pulseParticle, [8, 50, 40, shineColors[0], false], soundWave, "10" // 108 to 114
        )
        .call(
            soundWave.pulseParticle, [8, 40, 50, shineColors[1]], soundWave, "18", // 114-118-122, shine at 18, 1
        )
        .call(
            soundWave.pulseParticle, [10, 40, 50, shineColors[0], false], soundWave, "26"// 122 to ~
        )
        .call(
            soundWave.pulseParticle, [2, 50, 40, dimColor, false], soundWave, "29"
        )
        .call(
            function(){SCENE.remove(soundWave); disposeHierarchy(soundWave);}
        )

        pulseT.play();
    }

    this._shineTunnelGate = function(totalTime, finalColor, minSize, maxSize, layerId){

        totalTime = setdefault(totalTime, 1);
        finalColor = setdefault(finalColor, ColorMap['yellow'][0]);
        minSize = setdefault(minSize, 3);
        maxSize = setdefault(maxSize, 5);
        layerId = setdefault(layerId, [1,2]);

        for (var i = 1; i <= 5; i++){
            var bigNote = SCENE.getObjectByName('bigNote' + i);
            melodyNoteUtil = new MelodyNote();
            for (var j = 0; j < layerId.length; j++){
                melodyNoteUtil._changePointColor(
                    bigNote, layerId[j], totalTime, finalColor
                );
                melodyNoteUtil._changePointSize(
                    bigNote, layerId[j], totalTime, minSize, maxSize
                );
            }
        }
    }

    this.flyingNotesSettings = {
        9: {
            'colors': [
                'navy',
                'mediumblue',
                'royalblue',
                'dodgerblue',
                'deepskyblue',
                'cornflowerblue',
                'lightskyblue',
                'skyblue',
                'paleturquoise',
            ],
            'shapeTypes' : [
                'tetrahedron',
                'cube',
                'cube',
                'icosahedron',
                'dodecahedron',
                'icosahedron',
                'cube',
                'icosahedron',
                'octahedron'
            ]
        },

        10: {
            'colors': [
                'darkslategray',
                'navy',
                'mediumblue',
                'royalblue',
                'dodgerblue',
                'deepskyblue',
                'cornflowerblue',
                'lightskyblue',
                'skyblue',
                'paleturquoise',
            ],
            'shapeTypes' : [
                'tetrahedron',
                'tetrahedron',
                'cube',
                'cube',
                'icosahedron',
                'icosahedron',
                'cube',
                'icosahedron',
                'icosahedron',
                'tetrahedron'
            ]
        }
    }

    this.flyingNoteList = {}

    this.startFlyingNotes = function(){
        // arrive start at 70+8, then callback
        var fnListInd = 1;

        var flyingNoteNum = 9;
        var maxH = 2000,
            minH = -3000;

        var colors = this.flyingNotesSettings[flyingNoteNum]['colors'];
        var shapeTypes = this.flyingNotesSettings[flyingNoteNum]['shapeTypes'];

        this.flyingNoteList[fnListInd] = [];

        var that = this;

        function flyingNoteAdvance(ind){

            that._shineTunnelGate()

            var duration = 60,
                speed = [0, 0, 20],
                rotation = [0.01+(flyingNoteNum-ind)*0.005,
                            0.01+(flyingNoteNum-ind)*0.005,
                            0.01+(flyingNoteNum-ind)*0.005];
            that.flyingNoteList[fnListInd][ind].move(duration, speed, rotation);
        }

        var delay = .6;

        for (var i = 0; i < flyingNoteNum; i++){

            var center_pos = [0, minH + (maxH-minH)*1.0/flyingNoteNum*i, -4000],
                majorColor = colors[i],
                length = 5.7*Math.pow(flyingNoteNum-i+1, 2),
                size = 100 + (flyingNoteNum-i)*10;

            var flyingNote = new FlyingNote(
                center_pos,
                majorColor,
                length,
                size,
                shapeTypes[i]
            );

            flyingNote.name = "flyingNote" + fnListInd + '_' + i;
            SCENE.add(flyingNote);
            this.flyingNoteList[fnListInd].push(flyingNote);

            flyingNote.position.set(0,0,0);

            var t = new TimelineLite();
            t.from(
                flyingNote.position, (this.MID - this.START),
                {
                    delay: delay*i,
                    z: -10000,
                    ease: Bounce.easeIn
                }
            ).call(
                flyingNoteAdvance, [i], this, "+=0"
            );
        }

    }

    this.killSlowMelody = function(){

        var names = ['slowMelody', 'slowMelody2'];

        for (var i = 0; i < names.length; i++){
            var slowMelody = SCENE.getObjectByName(names[i]);
            SCENE.remove(slowMelody);
            disposeHierarchy(slowMelody);
        }
    }

    this.flyingNotes2 = function(){
        var fnListInd = 2;

        var flyingNoteNum = 10;
        var maxH = 2500,
            minH = -3500;

        var colors = this.flyingNotesSettings[flyingNoteNum]['colors'];
        var shapeTypes = this.flyingNotesSettings[flyingNoteNum]['shapeTypes'];

        this.flyingNoteList[fnListInd] = [];

        var that = this;

        function flyingNoteAdvance(ind){

            that._shineTunnelGate()

            var duration = 60,
                speed = [0, 0, 15],
                rotation = [0.01+(flyingNoteNum-ind)*0.005,
                            0.01+(flyingNoteNum-ind)*0.005,
                            0.01+(flyingNoteNum-ind)*0.005];
            that.flyingNoteList[fnListInd][ind].move(duration, speed, rotation);
        }

        var delay = .8;

        for (var i = 0; i < flyingNoteNum; i++){

            var center_pos = [0, minH + (maxH-minH)*1.0/flyingNoteNum*i, -4000],
                majorColor = colors[i],
                length = 500 + 5.5*Math.pow(flyingNoteNum-i+1, 2),
                size = 80 + (flyingNoteNum-i)*10,
                wireWidth = 1.2;

            var flyingNote = new FlyingNote(
                center_pos,
                majorColor,
                length,
                size,
                shapeTypes[i],
                wireWidth
            );

            flyingNote.name = "flyingNote" + fnListInd + "_" + i;
            SCENE.add(flyingNote);
            this.flyingNoteList[fnListInd].push(flyingNote);

            flyingNote.position.set(0,0,0);

            var t = new TimelineLite();
            t.from(
                flyingNote.position, (this.MID - this.START) ,
                {
                    delay: delay*i,
                    z: -10000,
                }
            ).call(
                flyingNoteAdvance, [i], this, "+=0"
            );
        }

    }

    this.flyingNotes3 = function(){
        var fnListInd = 3;

        var flyingNoteNum = 10;
        var maxH = 2500,
            minH = -3500;

        var colors = this.flyingNotesSettings[flyingNoteNum]['colors'];
        var shapeTypes = this.flyingNotesSettings[flyingNoteNum]['shapeTypes'];

        this.flyingNoteList[fnListInd] = [];

        var that = this;

        function flyingNoteAdvance(ind){

            that._shineTunnelGate()

            var duration = 60,
                speed = [0, 0, 25],
                rotation = [0.05, 0.05, 0.05];

                rotation = [0.001+(flyingNoteNum-ind)*0.001,
                            0.001+(flyingNoteNum-ind)*0.001,
                            0.001+(flyingNoteNum-ind)*0.001];
            that.flyingNoteList[fnListInd][ind].move(duration, speed, rotation);
        }

        var delay = 0;

        for (var i = 0; i < flyingNoteNum; i++){

            var center_pos = [0, minH + (maxH-minH)*1.0/flyingNoteNum*i, -4000],
                majorColor = colors[i],
                length = 100,
                size = 100 + (flyingNoteNum-i)*10;
                wireWidth = 1.2;
                trailWidth = 1;

            var flyingNote = new FlyingNote(
                center_pos,
                majorColor,
                length,
                size,
                shapeTypes[i],
                wireWidth
            );

            flyingNote.name = "flyingNote" + fnListInd + "_" + i;
            SCENE.add(flyingNote);
            this.flyingNoteList[fnListInd].push(flyingNote);

            flyingNote.position.set(0,0,0);

            var t = new TimelineLite();
            t.from(
                flyingNote.position, (this.MID - this.START) ,
                {
                    delay: delay*i,
                    z: -10000,
                    ease: Bounce.easeIn
                }
            ).call(
                flyingNoteAdvance, [i], this, "+=0"
            ).call(
                flyingNote.oscillate, [30, 50], flyingNote, "+=0"
            );
        }

    }

    this.flyingNotes4 = function(){
        var fnListInd = 4;

        var flyingNoteNum = 10;
        var maxH = 2500,
            minH = -3500;

        var colors = this.flyingNotesSettings[flyingNoteNum]['colors'];
        var shapeTypes = this.flyingNotesSettings[flyingNoteNum]['shapeTypes'];

        this.flyingNoteList[fnListInd] = [];

        var that = this;

        function flyingNoteAdvance(ind){

            that._shineTunnelGate()

            var duration = 60,
                speed = [0, 0, 25],
                rotation = [0.05, 0.05, 0.05];

                rotation = [0.01+(flyingNoteNum-ind)*0.001,
                            0.01+(flyingNoteNum-ind)*0.001,
                            0.01+(flyingNoteNum-ind)*0.001];
            that.flyingNoteList[fnListInd][ind].move(duration, speed, rotation);
        }

        var delay = 0;

        for (var i = 0; i < flyingNoteNum; i++){

            var center_pos = [0, minH + (maxH-minH)*1.0/flyingNoteNum*i, -4000],
                majorColor = colors[i],
                length = 100,
                size = 300 + (flyingNoteNum-i)*10;
                wireWidth = 1.1;
                trailWidth = 1;

            var flyingNote = new FlyingNote(
                center_pos,
                majorColor,
                length,
                size,
                shapeTypes[i],
                wireWidth
            );

            flyingNote.name = "flyingNote" + fnListInd + "_" + i;
            SCENE.add(flyingNote);
            this.flyingNoteList[fnListInd].push(flyingNote);

            flyingNote.position.set(0,0,0);

            var t = new TimelineLite();
            t.from(
                flyingNote.position, (this.MID - this.START) ,
                {
                    delay: delay*i,
                    z: -10000,
                    ease: Bounce.easeIn
                }
            ).call(
                flyingNoteAdvance, [i], this, "+=0"
            ).call(
                flyingNote.oscillate, [30, 800], flyingNote, "+=0"
            );
        }

    }

    this.rotateCamera = function(){
        // start at 70 + 45
        var that = this;

        TweenLite.to(
            CAMERA.rotation, 19.5, //start at 115 sec
            {
                y: (Math.PI),
                onUpdate: function(){
                    // CAMERA.rotation.y += 0.001;
                    CAMERA.position.x -= 9;
                    CAMERA.position.z -= 15;
                },
                ease: Power0.easeOut,
                onComplete: function(){
                    TweenLite.to(
                        CAMERA.position, 1, {
                            x: that.finalCameraPosition[0],
                            y: that.finalCameraPosition[1],
                            z: that.finalCameraPosition[2],
                        }
                    );
                }
            }

        )

    }

    this.speedUpCamera = function(){
        // start at 70 + 45 + 20 = 135 sec, after roation
        // as a checkpoint

        var backGroundWave = SCENE.getObjectByName('backGroundWave');
        if (!backGroundWave) {

            var angle = Math.PI + Math.PI/2/2;
            var dist = 2000;
            var center_pos = [0, Math.cos(angle), -dist + dist* Math.sin(angle)],
                xNum = 50,
                yNum = 50,
                zNum = 30,
                majorColor = 'royalblue',
                size = 30,
                dist = 300,
                isLattice = true;

            var backGroundWave = new SoundWave(
                center_pos, xNum, yNum, zNum, majorColor, size, dist, isLattice
            );
            backGroundWave.position.set(0, 0, -280);
            backGroundWave.name = 'backGroundWave';
            SCENE.add(backGroundWave);


            CAMERA.position.set(
                this.finalCameraPosition[0],
                this.finalCameraPosition[1],
                this.finalCameraPosition[2]
            );
            CAMERA.rotation.y = Math.PI;

        }

        TweenLite.to(
            CAMERA.position, 21.5, // start at 135
            {
                onUpdate: function(){
                    CAMERA.position.z -= 15.5;
                    // console.log(CAMERA.position);
                },

                onComplete: function(){ //156.5 to 157
                    TweenLite.to(
                        CAMERA.position, .5,
                        {
                            z: this.finalViewZ,
                            ease: Linear.easeNone,
                        }
                    );
                }
            }
        );

    }


    this.cleanFlyingNotesTunnel = function(){

        for (var fnListInd = 1; fnListInd <= 4; fnListInd++) {
            for (var i = 0; i < this.flyingNoteList[fnListInd].length; i++) {
                var name = "flyingNote" + fnListInd + "_" + i;
                var flyingNote = SCENE.getObjectByName(name);
                SCENE.remove(flyingNote);
                disposeHierarchy(flyingNote);
            }
        }

        for (var i = 1; i <= 5; i++){
            var bigNote = SCENE.getObjectByName('bigNote' + i);
            SCENE.remove(bigNote);
            disposeHierarchy(bigNote);
        }

    }

    this.createPlanet = function(){
        var radius = 10,
            wS = 20,
            hS = 20;

        var geometry = new THREE.SphereGeometry(
                radius, wS, hS
            );
        var material = new THREE.MeshPhongMaterial(
                {
                    color: "blanchedalmond",
                    side: THREE.DoubleSide,
                    flatShading: true,
                    wireframe: true,
                }
            );
        var sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(
            this.woodBlockCenterPos[0],
            this.woodBlockCenterPos[1],
            this.woodBlockCenterPos[2]
        )
        sphere.name = "sphere";
        SCENE.add(sphere);

        TweenLite.to(
            sphere.scale, 5,
            {
                x: 50,
                y: 50,
                z: 50,
                ease: Power4.easeIn,
            }
        )
        TweenLite.to(
            sphere.rotation, 25,
            {
                x: 0.001,
            }
        )

    }
    this.beatWoodBlocks = function(){

        console.log(CAMERA.position);

        var backGroundWave = SCENE.getObjectByName("backGroundWave");
        if (!backGroundWave){
            CAMERA.position.set(
                this.finalCameraPosition[0],
                this.finalCameraPosition[1],
                this.finalViewZ - 100
            )
        }

        console.log(CAMERA.position);

        var center_pos = this.woodBlockCenterPos;

        var scale = 3;

        var woodBlockSettings = {
            small: {
                center_pos: center_pos,
                size: 300*scale,
                tri: 2,
                majorColor: 'coral',
                rotate: {
                    x: 0,
                    y: 0.01,
                    z: 0,
                    timeLapse: 1,
                    repeat: 20,
                },
                beats: [
                    {'beat': 6.5},
                    {'beat': 2}, {'beat': 2}, {'beat': .9}, {'beat': .9}, {'rest': .7},
                    {'beat': 2}, {'beat': 1.8}, {'beat': 1.8}, {'rest': .9},
                ],
                bpm: 60/100/2,
                br: .8,
                s: 80*scale,
            },
            big: {
                center_pos: center_pos,
                size: 1000*scale,
                tri: 2,
                majorColor: 'mediumslateblue',
                rotate: {
                    x: 0.005,
                    y: 0,
                    z: 0,
                    timeLapse: 1,
                    repeat: 20,
                },
                beats: [
                    {'rest': 2.0}, {'beat': 4.5},
                    {'beat': 2.0}, {'rest': 1.25}, {'beat': 2.0}, {'rest': 1.25},
                    {'beat': 2.0}, {'rest': 1.25}, {'beat': 2.0}, {'rest': 1.25},
                ],
                bpm: 60/100/2,
                br: .8,
                s: 150*scale,
            },
            huge: {
                center_pos: center_pos,
                size: 1100*scale,
                tri: 2,
                majorColor: 'marine',
                rotate: {
                    x: 0,
                    y: 0,
                    z: 0.005,
                    timeLapse: 1,
                    repeat: 20
                },
                beats: [
                    {'rest': 5.25}, {'beat': 1.25},
                    {'rest': 3.25}, {'beat': 2.0}, {'rest': 1.25},
                    {'rest': 3.25}, {'beat': 2.0}, {'rest': 1.25},
                ],
                bpm: 60/100/2,
                br: .8,
                s: 60*scale,
            }
        }

        for (var name in woodBlockSettings) {
            var config = woodBlockSettings[name];

            var woodBlock = new WoodBlock(
                config['center_pos'], config['size'], config['tri'], config['majorColor']
            );
            woodBlock.name = name + 'WoodBlock';

            SCENE.add(woodBlock);

            woodBlock.cubeRotate(
                config['rotate']['x'], config['rotate']['y'], config['rotate']['z'], config['rotate']['timeLapse'], config['rotate']['repeat']
            )

            woodBlock.beat(
                config['beats'], config['bpm'], config['br'], config['s']
            );

        }
    }

    this.cleanBackGroundWave = function(){
        // at 160 sec
        var backGroundWave = SCENE.getObjectByName('backGroundWave');
        var t = new TimelineLite();
        t.call(
            backGroundWave.changeParticleColor, [5, "black", false], backGroundWave
        ).call(
            function(){
                SCENE.remove(backGroundWave);
                disposeHierarchy(backGroundWave);
            },
            [],
            backGroundWave,
            "+=5"
        );
    }

    this.rushWoodBlockCenter = function(){
        // at 70 + 87 = 157 sec

        TweenLite.to(
            CAMERA.position, 1.5,
            {
                x: this.woodBlockCenterPos[0],
                y: this.woodBlockCenterPos[1],
                z: this.woodBlockCenterPos[2],
                ease: Power1.easeIn,
                onComplete: function(){

                    var names = ["smallWoodBlock", "bigWoodBlock", "hugeWoodBlock", "sphere"];
                    for (var i = 0; i < names.length; i++){
                        var obj = SCENE.getObjectByName(names[i]);
                        if (obj) {
                            SCENE.remove(obj);
                            disposeHierarchy(obj);
                        }
                    }
                }
            }
        )
    }


}