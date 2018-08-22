/* [8-44sec] solo woodBlocks
*/

var Scheduler2 = function(startTime) {

    var that = this;

    this.START = setdefault(startTime, 8.5);
    this.MID = 36;
    this.END = 44;

    this.program = [
        'cleanAndInitCameraPosition',
        'initWoodBlock',
        'beatWoodBlock',
        'initBigWoodBlock',
        'beatBigWoodBlock',
        'initHugeWoodBlock',
        'beatHugeWoodBlock',
        'expandWoodBlocks',
    ];

    this.startSecond = [
        this.START,
        this.START + .01,
        this.START + .01,
        this.START + 7.5,
        this.START + 7.5,
        this.START + 12.3,
        this.START + 12.3,
        this.MID,
    ];

    this.cleanAndInitCameraPosition = function() {
        CAMERA.position.set(-500, 0, 1000);
        CAMERA.lookAt(pos2v(0, 0, 0));

        var soundWave = SCENE.getObjectByName('soundWave');
        SCENE.remove(soundWave);
        disposeHierarchy(soundWave);
    }

    this.initWoodBlock = function() {
        // run at 8 sec
        var woodBlock = new WoodBlock([0, 0, 0], 300, 2, 'coral', "woodCube", 1.5);
        woodBlock.name = 'woodBlock';
        SCENE.add(woodBlock);

        woodBlock.polyRotate(0, 0.01, 0, 1, this.MID-this.START-0.01);
        return woodBlock;

    }

    this.beatWoodBlock = function() {
        var woodBlock = SCENE.getObjectByName('woodBlock');

        var beats = [
            {'beat': 5, 's': 80}, {'beat': 1, 's': 80}, {'rest': 2},
            {'beat': 5, 's': 80}, {'beat': 1, 's': 80}, {'rest': 2},
            {'beat': 4, 's': 80}, {'beat': 1, 's': 150}, {'beat': 1, 's': 150}, {'rest': 2},
            {'beat': 3, 's': 80}, {'beat': 1, 's': 80}, {'beat': 2, 's': 80}, {'rest': 1.8},
            {'beat': 11}, {'beat': 1}, // change beat
            {'beat': 2}, {'beat': 2.5}, {'rest': 2.}, // 6.5 beat per interval
            {'beat': 1, 's': 150}, {'beat': 1, 's': 150}, {'beat': 2}, {'rest': 2.5},
            {'beat': 2}, {'beat': 2.5}, {'rest': 2.},
            {'beat': 1, 's': 150}, {'beat': 1, 's': 150}, {'beat': 2}, {'rest': 2.5},
            {'beat': 2}, {'beat': 2}, {'rest': 2.5},
            {'beat': 6.5},
            {'beat': 2}, {'beat': 2}, {'beat': .9}, {'beat': .9}, {'rest': .7},
            {'beat': 2}, {'beat': 1.8}, {'beat': 1.8}, {'rest': .9},
            // overlap with next Scheduler
            {'rest': 6.5},
            {'rest': 6.5},
            {'beat': 1, }, {'beat': 1, }, {'beat': 2}, {'rest': 2.5},
            {'beat': 2}, {'beat': 2.5}, {'rest': 2.},
        ]

        var bpm = 60/100/2,
            br = .8,
            s = 80;
        woodBlock.beat(beats, bpm, br, s);

    }

    this.initBigWoodBlock = function(start) {
        // run at 15 sec
        start = setdefault(start, this.START+7.5);

        var bigWoodBlock = new WoodBlock([0, 0, 0], 1000, 2, 'mediumslateblue', "woodCube", 1.5);
        bigWoodBlock.name = 'bigWoodBlock';
        SCENE.add(bigWoodBlock);

        bigWoodBlock.polyRotate(0.005, 0, 0, 1, this.MID-start);
        return bigWoodBlock;
    }

    this.beatBigWoodBlock = function() {
        var woodBlock = SCENE.getObjectByName('bigWoodBlock');
        if (!woodBlock) {
            woodBlock = this.initBigWoodBlock(TIMELINE.time());
        }

        var beats = [
            {'beat': 2.5}, {'rest': .5}, {'beat': 2.5}, {'rest': .5},
            {'rest': 2}, {'beat': 4.5}, // change beat to 6.5
            {'beat': 2.0}, {'rest': 1.25}, {'beat': 2.0}, {'rest': 1.25},
            {'rest': 2.0}, {'beat': 3.25}, {'rest': 1.25},
            {'rest': 2.0}, {'beat': 3.25}, {'rest': 1.25},
            {'rest': 2.0}, {'beat': 3.25}, {'rest': 1.25},
            {'rest': 2.0}, {'beat': 3.25}, {'rest': 1.25},
            {'rest': 2.0}, {'beat': 3.25}, {'rest': 1.25},
            {'rest': 2.0}, {'beat': 4.5},
            {'beat': 2.0}, {'rest': 1.25}, {'beat': 2.0}, {'rest': 1.25},
            {'beat': 2.0}, {'rest': 1.25}, {'beat': 2.0}, {'rest': 1.25},
            // overlap with next Scheduler
            {'rest': 6.5},
            {'rest': 6.5},
            {'rest': 2.0}, {'beat': 3.25, 's': 50}, {'rest': 1.25},
            {'rest': 2.0}, {'beat': 4.0, 's': 80}, {'rest': 0.5},
        ]

        var bpm = 60/100/2,
            br = .8,
            s = 150;
        woodBlock.beat(beats, bpm, br, s);

    }

    this.initHugeWoodBlock = function(start) {
        start = setdefault(start, this.START+12.3);

        var hugeWoodBlock = new WoodBlock([0, 0, 0], 1100, 2, 'marine', "woodCube", 1.5);
        hugeWoodBlock.name = 'hugeWoodBlock';
        SCENE.add(hugeWoodBlock);

        hugeWoodBlock.polyRotate(0, 0, 0.005, 1, this.MID-start);
        return hugeWoodBlock;

    }

    this.beatHugeWoodBlock = function(){

        var woodBlock = SCENE.getObjectByName('hugeWoodBlock');
        if (!woodBlock) {
            woodBlock = this.initHugeWoodBlock(TIMELINE.time());
        }

        var beats = [
            {'beat': 2.0}, {'rest': 1.25},
            {'rest': 2.0}, {'beat': 3.25}, {'rest': 1.25},
            {'rest': 6.5},
            {'rest': 2.0}, {'beat': 3.25}, {'rest': 1.25},
            {'rest': 6.5},
            {'rest': 2.0}, {'beat': 3.25}, {'rest': 1.25},
            {'rest': 5.25}, {'beat': 1.25},
            {'rest': 3.25}, {'beat': 2.0}, {'rest': 1.25},
            {'rest': 3.25}, {'beat': 2.0}, {'rest': 1.25},
            //overlap with next Scheduler
            {'rest': 6.5},
            {'rest': 6.5},
            {'rest': 6.5},
            {'rest': 2.0}, {'beat': 4.0, 's': 80}, {'rest': 0.5}
        ]

        var bpm = 60/100/2,
            br = .8,
            s = 60;
        woodBlock.beat(beats, bpm, br, s);
    }

    this.expandWoodBlocks = function(){

        var names = ['woodBlock', 'bigWoodBlock', 'hugeWoodBlock'];

        var createFunc = {
            'woodBlock': this.initWoodBlock,
            'bigWoodBlock': this.initBigWoodBlock,
            'hugeWoodBlock': this.initHugeWoodBlock,
        };

        for (var i = 0; i < names.length; i++){
            var woodBlock = SCENE.getObjectByName(names[i]);
            if (!woodBlock) {
                woodBlock = createFunc[names[i]]();
            }
            TweenLite.to(
                woodBlock.scale, 8,
                {x: 10, y: 10, z: 10,
                 ease: Power4.easeOut,
                }
            );
        }

    }

}
