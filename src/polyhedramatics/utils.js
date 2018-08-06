var ColorMap = {
    //common colors extracted from X11 color map
    'pink': ['lavenderblush', 'pink', 'hotpink'],
    'violet': ['plum', 'fuchsia', 'mediumorchid'],
    'purple': ['blueviolet', 'mediumpurple', 'mediumslateblue'],
    'blue': ['cornflowerblue', 'royalblue', 'navy'],
    'lightblue': ['lightskyblue', 'cyan', 'deepskyblue'],
    'marine': ['aquamarine', 'turquoise', 'darkcyan'],
    'green': ['lightgreen', 'mediumspringgreen', 'limegreen'],
    'darkgreen': ['darkseagreen', 'mediumseagreen', 'forestgreen'],
    'yellow': ['lightyellow', 'lightgoldenrodyellow', 'goldenrod'],
    'salmon': ['oldlace', 'navajowhite', 'sandybrown'],
    'coral': ['mistyrose', 'lightsalmon', 'salmon'],
    'red': ['lightcoral', 'red', 'firebrick'],
    'grey': ['white', 'whitesmoke', 'gainsboro', 'lightgrey', 'silver', 'darkgray', 'gray', 'dimgray', 'black'],
}


function calPolygonVertices(N, r, startAngle, anticlockwise) {
    // calcluate polygon using polar coordinates
    // startAngle: default 0 (3 o'clock), common Math.PI/2 (12 o'clock)
    // anticlockwise: default true

    startAngle = setdefault(startAngle, 0);
    anticlockwise = setdefault(anticlockwise, true);

    var vertices = [];

    for (var i = 0; i < N; i++) {
        vertices.push([
            (anticlockwise? 1: -1) * r * Math.cos(startAngle + (i * ((2 * Math.PI) / N))),
            r * Math.sin(startAngle + (i * ((2 * Math.PI) / N)))
        ])

    }
    return vertices;
}

function pos2v(pos) {
    // convert position to a THREE.vector
    var v = new THREE.Vector3(pos[0], pos[1], pos[2]);
    return v;
}

function v2pos(vector) {
    // convert THREE.vector to a position(list)
    return [vector.x, vector.y, vector.z];
}

function setdefault(variable, value) {
    return typeof variable !== 'undefined' ? variable : value;
}

function disposeNode (node)
{
    if (node instanceof THREE.Mesh)
    {
        if (node.geometry)
        {
            node.geometry.dispose ();
        }

        if (node.material)
        {
            if (node.material instanceof THREE.MeshFaceMaterial)
            {
                $.each (node.material.materials, function (idx, mtrl)
                {
                    if (mtrl.map)           mtrl.map.dispose ();
                    if (mtrl.lightMap)      mtrl.lightMap.dispose ();
                    if (mtrl.bumpMap)       mtrl.bumpMap.dispose ();
                    if (mtrl.normalMap)     mtrl.normalMap.dispose ();
                    if (mtrl.specularMap)   mtrl.specularMap.dispose ();
                    if (mtrl.envMap)        mtrl.envMap.dispose ();

                    mtrl.dispose ();    // disposes any programs associated with the material
                });
            }
            else
            {
                if (node.material.map)          node.material.map.dispose ();
                if (node.material.lightMap)     node.material.lightMap.dispose ();
                if (node.material.bumpMap)      node.material.bumpMap.dispose ();
                if (node.material.normalMap)    node.material.normalMap.dispose ();
                if (node.material.specularMap)  node.material.specularMap.dispose ();
                if (node.material.envMap)       node.material.envMap.dispose ();

                node.material.dispose ();   // disposes any programs associated with the material
            }
        }
    }
}   // disposeNode

function disposeHierarchy (node, callback)
{
    for (var i = node.children.length - 1; i >= 0; i--)
    {
        var child = node.children[i];
        disposeHierarchy (child, callback);
        if (callback) {
            callback (child);
        }
    }
}