/*
    A dedicated way to create Polyhedra <3
*/

var Polyhedra = function(center_pos, size, data, faceColors, clippingPlanes) {

    THREE.Group.apply(this, arguments);

    clippingPlanes = setdefault(clippingPlanes, []);
    console.log(clippingPlanes);

    var vertices = [];
    for (var i = 0; i < data.vertex.length; i++)
        vertices.push( new THREE.Vector3(
            data.vertex[i][0] + center_pos[0],
            data.vertex[i][1] + center_pos[1],
            data.vertex[i][2] + center_pos[2]).multiplyScalar(size)
        );
    this.vertices = vertices;

    var faceMaterial = new THREE.MeshBasicMaterial(
    {
        color: 0xffffff,
        vertexColors: THREE.FaceColors,
        shininess: 100,
        side: THREE.DoubleSide,
        clippingPlanes: clippingPlanes,
        clipShadows: false,
        // opacity: .5,
        // transparent: true,
    });
     //, side: THREE.DoubleSide  transparent:true, opacity:0.8 } );

    var geometry = new THREE.Geometry();
    geometry.vertices = vertices;

    var faceIndex = 0;
    for (var faceNum = 0; faceNum < data.face.length; faceNum++)
    {
        for (var i = 0; i < data.face[faceNum].length - 2; i++)
        {
            geometry.faces[faceIndex] = new THREE.Face3(
                data.face[faceNum][0],
                data.face[faceNum][i+1],
                data.face[faceNum][i+2]
            );
            geometry.faces[faceIndex].color = new THREE.Color(
                faceColors[data.face[faceNum].length]
            );
            console.log(new THREE.Color(
                faceColors[data.face[faceNum].length]
            ))
            faceIndex++;
        }
    }

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    var poly = new THREE.Mesh(geometry, faceMaterial);

    this.poly = poly;
    this.add(poly);

}

Polyhedra.prototype = Object.create(THREE.Group.prototype);
Polyhedra.prototype.constructor = Polyhedra;

Polyhedra.prototype.polyRotateDuration = function(rotation, duration) {

    var that = this;
    function updatePoly() {
        that.poly.rotation.x += rotation[0];
        that.poly.rotation.y += rotation[1];
        that.poly.rotation.z += rotation[2];
        that.poly.geometry.verticesNeedUpdate = true;
    }

    TweenLite.to(
        this.poly, duration,
        {
            onUpdate: updatePoly,
        },
    );
}


var instruMap = {
    'flute': {
        'solidName': 'Cuboctahedron',
        'faceColors': {
            3: 0xD70066,  //crimson
            4: 0xFF9C00,  //creamy yellow
        },
    },
    'oboe': {
        'solidName': 'TruncatedCubocahedron',
        'faceColors': {
            4: 0xF7B400, // light creamy yellow
            6: 0xF72600, // orange
            8: 0x7405A4, // purple
        },
    },
    'engHorn': {
        'solidName': 'Rhombicubocahedron',
        'faceColors': {
            3: 0x2F0EAA, // blue-purple
            4: 0x009E7F, // blue-green
        },
    },
    'clarinet': {
        'solidName': 'SnubCuboctahedron',
        'faceColors': {
            3: 0xF73B00, //sharp orange
            4: 0x8303A3, // purple
        },
    },
    'bassoon': {
        'solidName': 'Icosidodecahedron',
        'faceColors': {
            3: 0x0F2AA8,  // dark blue
            5: 0x009F7B,  // blue-green
        },
    },
    'trumpet': {
        'solidName': 'TruncatedIcosidodecahedron',
        'faceColors': {
            4: 1,
            5: 1,
            10: 1,
        },
    },
    'frenchHorn': {
        'solidName': 'Rhombicosidodecahedron',
        'faceColors': {
            3: 1,
            4: 1,
            5: 1,
        },
    },
    'trombone': {
        'solidName': 'SnubIcosidodecahedron',
        'faceColors': {
            3: 1,
            5: 1,
        },
    },
    'violin1': {
        'solidName': 'TruncatedTetrahedron',
        'faceColors': {
            3: 1,
            6: 1,
        },
    },
    'violin2': {
        'solidName': 'TruncatedCube',
        'faceColors': {
            3: 1,
            8: 1,
        },
    },
    'viola': {
        'solidName': 'TruncatedOctahedron',
        'faceColors': {
            4: 1,
            6: 1,
        },
    },
    'cello': {
        'solidName': 'TruncatedDodecahedron',
        'faceColors': {
            3: 1,
            10: 1,
        },
    },
    'doubleBass': {
        'solidName': 'TruncatedIcosahedron',
        'faceColors': {
            5: 1,
            6: 1,
        },
    },
}

// Reference Code with slight modification
// https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Polyhedra.html
// Edge /


function polyhedronDataToMesh(data)
{

    var faces;
    var polyhedron = new THREE.Object3D();

    //var chromeTexture = new THREE.ImageUtils.loadTexture( 'images/Chrome.png' );
    //var chromeMaterial = new THREE.MeshBasicMaterial( { color:0x999900, map: chromeTexture} );

    // convert vertex data to THREE.js vectors
    var vertex = []
    for (var i = 0; i < data.vertex.length; i++)
        vertex.push( new THREE.Vector3( data.vertex[i][0], data.vertex[i][1], data.vertex[i][2] ).multiplyScalar(100) );
    // render vertices as spheres
    var vertexGeometry = new THREE.SphereGeometry( 6, 12, 6 );
    var vertexMaterial = new THREE.MeshLambertMaterial( { color: 0x222244 } );
    var mesh = new THREE.Mesh( vertexGeometry, vertexMaterial );
    var vertexAmalgam = new THREE.Geometry();
    for (var i = 0; i < data.vertex.length; i++)
    {
        var vMesh = mesh.clone();
        vMesh.position = vertex[i];
        // vertexAmalgam.merge( vMesh.geometry, vMesh.matrix);
        THREE.GeometryUtils.merge( vertexAmalgam, vMesh );
        polyhedron.add(vMesh);
    }
    var vertexMesh = new THREE.Mesh( vertexAmalgam, vertexMaterial );
    polyhedron.add( vertexMesh );

    // convert edge data to cylinders
    var edgeMaterial = new THREE.MeshLambertMaterial( {color: 0x666666} );
    var edgeAmalgam = new THREE.Geometry();
    for (var i = 0; i < data.edge.length; i++)
    {
        var index0 = data.edge[i][0];
        var index1 = data.edge[i][1];
        var eMesh = cylinderMesh( vertex[index0], vertex[index1], edgeMaterial );
        edgeAmalgam.merge( eMesh.geometry, eMesh.matrix);
        // OLD code, not working
        // THREE.GeometryUtils.merge( edgeAmalgam, eMesh );

        polyhedron.add(eMesh);
        var outline = eMesh.clone();
        outline.material =  new THREE.MeshBasicMaterial({color:0x000000, side:THREE.BackSide}) ;
        outline.scale.x = outline.scale.z = 1.5;
        SCENE.add(outline);
    }
    var edgeMesh = new THREE.Mesh( edgeAmalgam, edgeMaterial );
    polyhedron.add( edgeMesh );
    // convert face data to a single (triangulated) geometry
    var faceMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors }); //, side: THREE.DoubleSide  transparent:true, opacity:0.8 } );
    var faceColors =
    {
        // cc0000 663300 cccc00 00cc00 0000cc 660066 brown-663300
        3: new THREE.Color( 0xcc0000 ),
        4: new THREE.Color( 0x00cc00 ),
        5: new THREE.Color( 0x0000cc ),
        6: new THREE.Color( 0xcccc00 ),
        7: new THREE.Color( 0x999999 ),
        8: new THREE.Color( 0x990099 ),
        9: new THREE.Color( 0xff6600 ),
        10: new THREE.Color( 0x6666ff )
    };

    var geometry = new THREE.Geometry();
    geometry.vertices = vertex;
    var faceIndex = 0;
    for (var faceNum = 0; faceNum < data.face.length; faceNum++)
    {
        for (var i = 0; i < data.face[faceNum].length - 2; i++)
        {
            geometry.faces[faceIndex] = new THREE.Face3( data.face[faceNum][0], data.face[faceNum][i+1], data.face[faceNum][i+2] );
            geometry.faces[faceIndex].color = faceColors[data.face[faceNum].length];
            faceIndex++;
        }
    }

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    faces = new THREE.Mesh(geometry, faceMaterial);
    polyhedron.add(faces);
    return polyhedron;
}
function cylinderMesh(point1, point2, material)
{
    var direction = new THREE.Vector3().subVectors(point2, point1);
    var arrow = new THREE.ArrowHelper(direction.clone().normalize(), point1);
    var rotation = new THREE.Euler().setFromQuaternion(arrow.quaternion);
    var edgeGeometry = new THREE.CylinderGeometry( 2, 2, direction.length(), 8, 4 );
    var edge = new THREE.Mesh(edgeGeometry, material);
    edge.position = new THREE.Vector3().addVectors(point1, direction.multiplyScalar(0.5));
    edge.rotation = rotation;
    return edge;
    // the result should align with:
    //   scene.add( new THREE.ArrowHelper( direction.clone().normalize(), point1, direction.length()) );
}
