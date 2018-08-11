var MelodyNotesFactory = function(nodeRadius, toNextSemiToneHeight, toNextNoteDistance, majorColor) {

    THREE.Group.apply(this, arguments);
    this.R = nodeRadius;
    this.H = toNextSemiToneHeight;
    this.D = toNextNoteDistance;
    this.majorColor = majorColor;

    this.scale = ['d', 'r', 'm', 'f', 's', 'l', 't']
    this.noteMap = {
        'd': 0,
        'r': 2,
        'm': 4,
        'f': 5,
        's': 7,
        'l': 9,
        't': 11,
    }
    // so that d:0, d0:0, d1:12, d2:24
    for (var i = 0; i < 3; i++) {
        for (var note in this.noteMap) {
            this.noteMap[note + i] = this.noteMap[note] + i * 12;
        }
    }

}

MelodyNotesFactory.prototype = Object.create(THREE.Group.prototype);
MelodyNotesFactory.prototype.constructor = MelodyNotesFactory;


MelodyNotesFactory.prototype.resetConfig = function(nodeRadius, toNextSemiToneHeight, toNextNoteDistance, majorColor) {

    this.R = nodeRadius;
    this.H = toNextSemiToneHeight;
    this.D = toNextNoteDistance;
    this.majorColor = majorColor;

}
MelodyNotesFactory.prototype.createMelody = function(notesConfig, startPos, relativeTo, withEdge){
    // notesConfig should be a list of dictionary
    // [{'note': 'd', 'color': 'blue'}, ...]
    var melodyNotes = new THREE.Group();
    withEdge = setdefault(withEdge, true);

    var melody = [];
    var notes = [],
        colors = [];

    for (var i = 0; i < notesConfig.length; i++) {
        notes.push(notesConfig[i]['note']);
        colors.push(setdefault(
            notesConfig[i]['color'],
            ColorMap[this.majorColor][i % ColorMap[this.majorColor].length])
        )
    }

    var positions = this.getMelodyPositions(notes, startPos, relativeTo);

    for (var i = 0; i < positions.length; i++) {
        var node = this.createNode(positions[i], colors[i], this.R,
                                   notesConfig[i]['sepr'],
                                   notesConfig[i]['note5num']);
        var melodyNote = new MelodyNote(node);

        if (i > 0 && withEdge)  {
            var edge = this.createEdge(
                positions[i-1], positions[i], colors[0], 10
            );
            melodyNote.add(edge);
        }
        melodyNotes.add(melodyNote);

        melody.push(melodyNote);
    }

    melodyNotes.melody = melody;

    melodyNotes.rawMelodyPositions = positions;

    return melodyNotes;
}

MelodyNotesFactory.prototype.createEdge = function(st_pos, et_pos, color, lineWidth) {
    var lineShape = new THREE.Shape();
    lineShape.moveTo(0, 0);
    lineShape.lineTo(0, lineWidth);
    lineShape.lineTo(et_pos[0]-st_pos[0], et_pos[1]-st_pos[1]+lineWidth);
    lineShape.lineTo(et_pos[0]-st_pos[0], et_pos[1]-st_pos[1]);
    lineShape.lineTo(0, 0);

    var shapeFactory = new ShapeFactory(
        lineShape, color, st_pos[0], st_pos[1], st_pos[2]-70, 0, 0, 0
    );

    var extrudeSettings = {
        depth: 8,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 1,
        bevelThickness:1
    }

    var edge = shapeFactory.addShape(
        "extrude", extrudeSettings
    )
    return edge;

}

MelodyNotesFactory.prototype.createNode = function(pos, color, r, sep, note5Num, onlyDots) {

    var circleShape = new THREE.Shape();
    circleShape.moveTo(0, r);
    circleShape.quadraticCurveTo(r, r, r, 0);
    circleShape.quadraticCurveTo(r, -r, r, -r);
    // circleShape.quadraticCurveTo(r, -r, 0, -r)
    circleShape.quadraticCurveTo(-r, -r, -r, 0);
    circleShape.quadraticCurveTo(-r, r, 0, r);

    var shapeFactory = new ShapeFactory(
        circleShape, color, pos[0], pos[1], pos[2], 0, 0, 0
    );

    var extrudeSettings = {
        depth: 8,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 1,
        bevelThickness:1
    }

    var noteGroup = new THREE.Group();
    sep = setdefault(sep, 50);
    onlyDots = setdefault(onlyDots, false);

    var lineWidth = 1,
        segNum = 5,
        dotSize = 3;

    var note3Num = 0;

    if (!onlyDots){
        var note1 = shapeFactory.addShape(
            "extrude", extrudeSettings
        )
        note1.position.z = pos[2];
        noteGroup.add(note1);

        var note2 = shapeFactory.addLineShape(
            "solid", lineWidth
        );
        note2.position.z = pos[2]+sep*1;
        noteGroup.add(note2);

        for (var i = note3Num; i > 0; i--) {
            var note = shapeFactory.addLineShape(
                "segment", lineWidth, segNum*(i)
            )
            note.position.z = pos[2] + sep*(2+(note3Num-i));
            noteGroup.add(note);
        }
    }

    var note4 = shapeFactory.addLineShape(
        "dotted", lineWidth, segNum, dotSize
    );
    note4.position.z = pos[2]+sep*(note3Num+3);
    noteGroup.add(note4);

    note5Num = setdefault(note5Num, 20);
    for (var i = note5Num; i > 0; i--) {
        var note = shapeFactory.addLineShape(
            "dotted2", lineWidth, segNum*(i), dotSize
        )
        note.position.z = pos[2] + sep*(note3Num+4+(note5Num-i));
        noteGroup.add(note);
    }

    return noteGroup;

    ////OLD: one circle only
    // var geometry = new THREE.CircleGeometry(r, 1000);
    // var material = new THREE.MeshPhongMaterial(
    //     {color: new THREE.Color(color)}
    // );
    // var circle = new THREE.Mesh(geometry, material);
    // circle.position.set(pos[0], pos[1], pos[2]);

    // return circle;
}

MelodyNotesFactory.prototype.setMelodyNotesPosition = function(melodyNotes, pos) {
    for (var i = 0; i < melodyNotes.melody.length; i++) {
        melodyNotes.melody[i].position.set(
            pos[0], pos[1], pos[2]
        );
    }
    melodyNotes.setPosition = pos;

    return melodyNotes;
}

MelodyNotesFactory.prototype.getMelodyPositions = function(notes, startPos, relativeTo) {
    // if relativeTo is supplied
    // height of the notes would be adjusted to be relative to that note(with startPos)
    // otherwise, startPos is the position of the first note

    startPos = setdefault(startPos, [0, 0, 0]);
    relativeTo = setdefault(relativeTo, null);

    if (relativeTo) {
        var diff = this.noteMap[notes[0]] - this.noteMap[relativeTo]
        startPos = [
            startPos[0],
            startPos[1] + diff * this.H,
            startPos[2]
        ];
    }

    var positions = [];

    var prev_pos, curr_pos;
    for (var i = 0; i < notes.length; i++) {
        if (i == 0) {
            curr_pos = startPos;
        } else {
            var diff = this.noteMap[notes[i]] - this.noteMap[notes[i-1]];
            curr_pos = [
                prev_pos[0] + this.D,
                prev_pos[1] + diff * this.H,
                prev_pos[2]
            ]
        }
        positions.push(curr_pos);
        prev_pos = curr_pos;
    }

    return positions;
}


var MelodyNote = function(note){
    THREE.Group.apply(this, arguments);

    if (note) {
        this.add(note);
        this.note = note;

    }
}

MelodyNote.prototype = Object.create(THREE.Group.prototype);
MelodyNote.prototype.constructor = MelodyNote;

MelodyNote.prototype.pulsePoints = function(note, totalTime, minSize, maxSize, finalColor, layerDelay, cycle) {
    this.changePointSize(note, totalTime, minSize, maxSize, layerDelay, cycle);
    this.changePointColor(note, totalTime, finalColor, layerDelay, cycle);

}


MelodyNote.prototype.changePointSize = function(note, totalTime, minSize, maxSize, layerDelay, cycle){

    var t = new TimelineLite({paused: true});

    for (var i = 0; i < note.children.length; i++) {
        t = t.call(
            this._changePointSize,
            [note, i, totalTime, minSize, maxSize, cycle],
            this,
            "+=" + layerDelay,
        )
    }
    t.play();
}


MelodyNote.prototype.changePointColor = function(note, totalTime, finalColor, layerDelay, cycle){

    var t = new TimelineLite({paused: true});

    for (var i = 0; i < note.children.length; i++) {
        t = t.call(
            this._changePointColor,
            [note, i, totalTime, finalColor, cycle],
            this,
            "+=" + layerDelay,
        )
    }

    t.play();

}

MelodyNote.prototype._changePointSize = function(note, child_ind, totalTime, minSize, maxSize, cycle){
    var that = this;
    cycle = setdefault(cycle, true);

    if (!this.hasOwnProperty("sizeList")) {
        var sizeList = [];
        for (var i = 0; i < note.children.length; i++){
            sizeList.push({size: minSize});
        }
        this.sizeList = sizeList;

    }

    function changeSize(){

        var material = note.children[child_ind].material;
        material.size = that.sizeList[child_ind].size;
        material.needsUpdate = true;

    }

    that.size = minSize;

    var t = new TimelineLite({paused: true});

    var duration = cycle?totalTime/2.0:totalTime;

    t = t.to(
        that.sizeList[child_ind], duration,
        {
            size: maxSize,
            onUpdate: changeSize,
        }
    )

    if (cycle){
        t = t.to(
            that.sizeList[child_ind], duration,
            {
                size: minSize,
                onUpdate: changeSize,
            }
        )
    }
    t.play();
}



MelodyNote.prototype._changePointColor = function(note, child_ind, totalTime, finalColor, cycle){

    var that = this;
    cycle = setdefault(cycle, true);

    if (!this.hasOwnProperty("color3List")) {
        var color3List = [];
        for (var i = 0; i < note.children.length; i++){
            color3List.push({color: note.children[i].material.color.clone()});
        }
        this.color3List = color3List;
    }


    function changeColor(){
        var material = note.children[child_ind].material;
        material.color.r = that.color3List[child_ind].color.r;
        material.color.g = that.color3List[child_ind].color.g;
        material.color.b = that.color3List[child_ind].color.b;
        material.needsUpdate = true;
    }

    var oriColor3 = note.children[child_ind].material.color.clone();
    var finalColor3 = new THREE.Color(finalColor);

    var t = new TimelineLite({paused: true});
    var duration = cycle?totalTime/2.0:totalTime;

    t = t.to(
        this.color3List[child_ind].color, duration,
        {
            r: finalColor3.r,
            g: finalColor3.g,
            b: finalColor3.b,
            onUpdate: changeColor,
        }
    )

    if (cycle){
        t = t.to(
            this.color3List[child_ind].color, duration,
            {
                r: oriColor3.r,
                g: oriColor3.g,
                b: oriColor3.b,
                onUpdate: changeColor,
            }
        )
    }

    t.play();
}
