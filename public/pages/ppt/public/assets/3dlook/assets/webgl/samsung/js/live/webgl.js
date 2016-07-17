/**
 * @author mrdoob / http://mrdoob.com/
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author julianwa / https://github.com/julianwa
 */

THREE.RenderableObject = function () {

	this.id = 0;

	this.object = null;
	this.z = 0;

};

//

THREE.RenderableFace = function () {

	this.id = 0;

	this.v1 = new THREE.RenderableVertex();
	this.v2 = new THREE.RenderableVertex();
	this.v3 = new THREE.RenderableVertex();

	this.normalModel = new THREE.Vector3();

	this.vertexNormalsModel = [ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ];
	this.vertexNormalsLength = 0;

	this.color = new THREE.Color();
	this.material = null;
	this.uvs = [ new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2() ];

	this.z = 0;

};

//

THREE.RenderableVertex = function () {

	this.position = new THREE.Vector3();
	this.positionWorld = new THREE.Vector3();
	this.positionScreen = new THREE.Vector4();

	this.visible = true;

};

THREE.RenderableVertex.prototype.copy = function ( vertex ) {

	this.positionWorld.copy( vertex.positionWorld );
	this.positionScreen.copy( vertex.positionScreen );

};

//

THREE.RenderableLine = function () {

	this.id = 0;

	this.v1 = new THREE.RenderableVertex();
	this.v2 = new THREE.RenderableVertex();

	this.vertexColors = [ new THREE.Color(), new THREE.Color() ];
	this.material = null;

	this.z = 0;

};

//

THREE.RenderableSprite = function () {

	this.id = 0;

	this.object = null;

	this.x = 0;
	this.y = 0;
	this.z = 0;

	this.rotation = 0;
	this.scale = new THREE.Vector2();

	this.material = null;

};

//

THREE.Projector = function () {

	var _object, _objectCount, _objectPool = [], _objectPoolLength = 0,
	_vertex, _vertexCount, _vertexPool = [], _vertexPoolLength = 0,
	_face, _faceCount, _facePool = [], _facePoolLength = 0,
	_line, _lineCount, _linePool = [], _linePoolLength = 0,
	_sprite, _spriteCount, _spritePool = [], _spritePoolLength = 0,

	_renderData = { objects: [], lights: [], elements: [] },

	_vector3 = new THREE.Vector3(),
	_vector4 = new THREE.Vector4(),

	_clipBox = new THREE.Box3( new THREE.Vector3( - 1, - 1, - 1 ), new THREE.Vector3( 1, 1, 1 ) ),
	_boundingBox = new THREE.Box3(),
	_points3 = new Array( 3 ),
	_points4 = new Array( 4 ),

	_viewMatrix = new THREE.Matrix4(),
	_viewProjectionMatrix = new THREE.Matrix4(),

	_modelMatrix,
	_modelViewProjectionMatrix = new THREE.Matrix4(),

	_normalMatrix = new THREE.Matrix3(),

	_frustum = new THREE.Frustum(),

	_clippedVertex1PositionScreen = new THREE.Vector4(),
	_clippedVertex2PositionScreen = new THREE.Vector4();

	//

	this.projectVector = function ( vector, camera ) {

		console.warn( 'THREE.Projector: .projectVector() is now vector.project().' );
		vector.project( camera );

	};

	this.unprojectVector = function ( vector, camera ) {

		console.warn( 'THREE.Projector: .unprojectVector() is now vector.unproject().' );
		vector.unproject( camera );

	};

	this.pickingRay = function ( vector, camera ) {

		console.error( 'THREE.Projector: .pickingRay() is now raycaster.setFromCamera().' );

	};

	//

	var RenderList = function () {

		var normals = [];
		var uvs = [];

		var object = null;
		var material = null;

		var normalMatrix = new THREE.Matrix3();

		var setObject = function ( value ) {

			object = value;
			material = object.material;

			normalMatrix.getNormalMatrix( object.matrixWorld );

			normals.length = 0;
			uvs.length = 0;

		};

		var projectVertex = function ( vertex ) {

			var position = vertex.position;
			var positionWorld = vertex.positionWorld;
			var positionScreen = vertex.positionScreen;

			positionWorld.copy( position ).applyMatrix4( _modelMatrix );
			positionScreen.copy( positionWorld ).applyMatrix4( _viewProjectionMatrix );

			var invW = 1 / positionScreen.w;

			positionScreen.x *= invW;
			positionScreen.y *= invW;
			positionScreen.z *= invW;

			vertex.visible = positionScreen.x >= - 1 && positionScreen.x <= 1 &&
					 positionScreen.y >= - 1 && positionScreen.y <= 1 &&
					 positionScreen.z >= - 1 && positionScreen.z <= 1;

		};

		var pushVertex = function ( x, y, z ) {

			_vertex = getNextVertexInPool();
			_vertex.position.set( x, y, z );

			projectVertex( _vertex );

		};

		var pushNormal = function ( x, y, z ) {

			normals.push( x, y, z );

		};

		var pushUv = function ( x, y ) {

			uvs.push( x, y );

		};

		var checkTriangleVisibility = function ( v1, v2, v3 ) {

			if ( v1.visible === true || v2.visible === true || v3.visible === true ) return true;

			_points3[ 0 ] = v1.positionScreen;
			_points3[ 1 ] = v2.positionScreen;
			_points3[ 2 ] = v3.positionScreen;

			return _clipBox.isIntersectionBox( _boundingBox.setFromPoints( _points3 ) );

		};

		var checkBackfaceCulling = function ( v1, v2, v3 ) {

			return ( ( v3.positionScreen.x - v1.positionScreen.x ) *
				    ( v2.positionScreen.y - v1.positionScreen.y ) -
				    ( v3.positionScreen.y - v1.positionScreen.y ) *
				    ( v2.positionScreen.x - v1.positionScreen.x ) ) < 0;

		};

		var pushLine = function ( a, b ) {

			var v1 = _vertexPool[ a ];
			var v2 = _vertexPool[ b ];

			_line = getNextLineInPool();

			_line.id = object.id;
			_line.v1.copy( v1 );
			_line.v2.copy( v2 );
			_line.z = ( v1.positionScreen.z + v2.positionScreen.z ) / 2;

			_line.material = object.material;

			_renderData.elements.push( _line );

		};

		var pushTriangle = function ( a, b, c ) {

			var v1 = _vertexPool[ a ];
			var v2 = _vertexPool[ b ];
			var v3 = _vertexPool[ c ];

			if ( checkTriangleVisibility( v1, v2, v3 ) === false ) return;

			if ( material.side === THREE.DoubleSide || checkBackfaceCulling( v1, v2, v3 ) === true ) {

				_face = getNextFaceInPool();

				_face.id = object.id;
				_face.v1.copy( v1 );
				_face.v2.copy( v2 );
				_face.v3.copy( v3 );
				_face.z = ( v1.positionScreen.z + v2.positionScreen.z + v3.positionScreen.z ) / 3;

				for ( var i = 0; i < 3; i ++ ) {

					var offset = arguments[ i ] * 3;
					var normal = _face.vertexNormalsModel[ i ];

					normal.set( normals[ offset ], normals[ offset + 1 ], normals[ offset + 2 ] );
					normal.applyMatrix3( normalMatrix ).normalize();

					var offset2 = arguments[ i ] * 2;

					var uv = _face.uvs[ i ];
					uv.set( uvs[ offset2 ], uvs[ offset2 + 1 ] );

				}

				_face.vertexNormalsLength = 3;

				_face.material = object.material;

				_renderData.elements.push( _face );

			}

		};

		return {
			setObject: setObject,
			projectVertex: projectVertex,
			checkTriangleVisibility: checkTriangleVisibility,
			checkBackfaceCulling: checkBackfaceCulling,
			pushVertex: pushVertex,
			pushNormal: pushNormal,
			pushUv: pushUv,
			pushLine: pushLine,
			pushTriangle: pushTriangle
		}

	};

	var renderList = new RenderList();

	this.projectScene = function ( scene, camera, sortObjects, sortElements ) {

		_faceCount = 0;
		_lineCount = 0;
		_spriteCount = 0;

		_renderData.elements.length = 0;

		if ( scene.autoUpdate === true ) scene.updateMatrixWorld();
		if ( camera.parent === undefined ) camera.updateMatrixWorld();

		_viewMatrix.copy( camera.matrixWorldInverse.getInverse( camera.matrixWorld ) );
		_viewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, _viewMatrix );

		_frustum.setFromMatrix( _viewProjectionMatrix );

		//

		_objectCount = 0;

		_renderData.objects.length = 0;
		_renderData.lights.length = 0;

		scene.traverseVisible( function ( object ) {

			if ( object instanceof THREE.Light ) {

				_renderData.lights.push( object );

			} else if ( object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Sprite ) {

				if ( object.material.visible === false ) return;

				if ( object.frustumCulled === false || _frustum.intersectsObject( object ) === true ) {

					_object = getNextObjectInPool();
					_object.id = object.id;
					_object.object = object;

					_vector3.setFromMatrixPosition( object.matrixWorld );
					_vector3.applyProjection( _viewProjectionMatrix );
					_object.z = _vector3.z;

					_renderData.objects.push( _object );

				}

			}

		} );

		if ( sortObjects === true ) {

			_renderData.objects.sort( painterSort );

		}

		//

		for ( var o = 0, ol = _renderData.objects.length; o < ol; o ++ ) {

			var object = _renderData.objects[ o ].object;
			var geometry = object.geometry;

			renderList.setObject( object );

			_modelMatrix = object.matrixWorld;

			_vertexCount = 0;

			if ( object instanceof THREE.Mesh ) {

				if ( geometry instanceof THREE.BufferGeometry ) {

					var attributes = geometry.attributes;
					var offsets = geometry.offsets;

					if ( attributes.position === undefined ) continue;

					var positions = attributes.position.array;

					for ( var i = 0, l = positions.length; i < l; i += 3 ) {

						renderList.pushVertex( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] );

					}

					if ( attributes.normal !== undefined ) {

						var normals = attributes.normal.array;

						for ( var i = 0, l = normals.length; i < l; i += 3 ) {

							renderList.pushNormal( normals[ i ], normals[ i + 1 ], normals[ i + 2 ] );

						}

					}

					if ( attributes.uv !== undefined ) {

						var uvs = attributes.uv.array;

						for ( var i = 0, l = uvs.length; i < l; i += 2 ) {

							renderList.pushUv( uvs[ i ], uvs[ i + 1 ] );

						}

					}

					if ( attributes.index !== undefined ) {

						var indices = attributes.index.array;

						if ( offsets.length > 0 ) {

							for ( var o = 0; o < offsets.length; o ++ ) {

								var offset = offsets[ o ];
								var index = offset.index;

								for ( var i = offset.start, l = offset.start + offset.count; i < l; i += 3 ) {

									renderList.pushTriangle( indices[ i ] + index, indices[ i + 1 ] + index, indices[ i + 2 ] + index );

								}

							}

						} else {

							for ( var i = 0, l = indices.length; i < l; i += 3 ) {

								renderList.pushTriangle( indices[ i ], indices[ i + 1 ], indices[ i + 2 ] );

							}

						}

					} else {

						for ( var i = 0, l = positions.length / 3; i < l; i += 3 ) {

							renderList.pushTriangle( i, i + 1, i + 2 );

						}

					}

				} else if ( geometry instanceof THREE.Geometry ) {

					var vertices = geometry.vertices;
					var faces = geometry.faces;
					var faceVertexUvs = geometry.faceVertexUvs[ 0 ];

					_normalMatrix.getNormalMatrix( _modelMatrix );

					var material = object.material;
					
					var isFaceMaterial = material instanceof THREE.MeshFaceMaterial;
					var objectMaterials = isFaceMaterial === true ? object.material : null;

					for ( var v = 0, vl = vertices.length; v < vl; v ++ ) {

						var vertex = vertices[ v ];

						_vector3.copy( vertex );

						if ( material.morphTargets === true ) {

							var morphTargets = geometry.morphTargets;
							var morphInfluences = object.morphTargetInfluences;

							for ( var t = 0, tl = morphTargets.length; t < tl; t ++ ) {

								var influence = morphInfluences[ t ];

								if ( influence === 0 ) continue;

								var target = morphTargets[ t ];
								var targetVertex = target.vertices[ v ];

								_vector3.x += ( targetVertex.x - vertex.x ) * influence;
								_vector3.y += ( targetVertex.y - vertex.y ) * influence;
								_vector3.z += ( targetVertex.z - vertex.z ) * influence;

							}

						}

						renderList.pushVertex( _vector3.x, _vector3.y, _vector3.z );

					}

					for ( var f = 0, fl = faces.length; f < fl; f ++ ) {

						var face = faces[ f ];

						var material = isFaceMaterial === true
							 ? objectMaterials.materials[ face.materialIndex ]
							 : object.material;

						if ( material === undefined ) continue;

						var side = material.side;

						var v1 = _vertexPool[ face.a ];
						var v2 = _vertexPool[ face.b ];
						var v3 = _vertexPool[ face.c ];

						if ( renderList.checkTriangleVisibility( v1, v2, v3 ) === false ) continue;

						var visible = renderList.checkBackfaceCulling( v1, v2, v3 );

						if ( side !== THREE.DoubleSide ) {
							if ( side === THREE.FrontSide && visible === false ) continue;
							if ( side === THREE.BackSide && visible === true ) continue;
						}

						_face = getNextFaceInPool();

						_face.id = object.id;
						_face.v1.copy( v1 );
						_face.v2.copy( v2 );
						_face.v3.copy( v3 );

						_face.normalModel.copy( face.normal );

						if ( visible === false && ( side === THREE.BackSide || side === THREE.DoubleSide ) ) {

							_face.normalModel.negate();

						}

						_face.normalModel.applyMatrix3( _normalMatrix ).normalize();

						var faceVertexNormals = face.vertexNormals;

						for ( var n = 0, nl = Math.min( faceVertexNormals.length, 3 ); n < nl; n ++ ) {

							var normalModel = _face.vertexNormalsModel[ n ];
							normalModel.copy( faceVertexNormals[ n ] );

							if ( visible === false && ( side === THREE.BackSide || side === THREE.DoubleSide ) ) {

								normalModel.negate();

							}

							normalModel.applyMatrix3( _normalMatrix ).normalize();

						}

						_face.vertexNormalsLength = faceVertexNormals.length;

						var vertexUvs = faceVertexUvs[ f ];

						if ( vertexUvs !== undefined ) {

							for ( var u = 0; u < 3; u ++ ) {

								_face.uvs[ u ].copy( vertexUvs[ u ] );

							}

						}

						_face.color = face.color;
						_face.material = material;

						_face.z = ( v1.positionScreen.z + v2.positionScreen.z + v3.positionScreen.z ) / 3;

						_renderData.elements.push( _face );

					}

				}

			} else if ( object instanceof THREE.Line ) {

				if ( geometry instanceof THREE.BufferGeometry ) {

					var attributes = geometry.attributes;

					if ( attributes.position !== undefined ) {

						var positions = attributes.position.array;

						for ( var i = 0, l = positions.length; i < l; i += 3 ) {

							renderList.pushVertex( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] );

						}

						if ( attributes.index !== undefined ) {

							var indices = attributes.index.array;

							for ( var i = 0, l = indices.length; i < l; i += 2 ) {

								renderList.pushLine( indices[ i ], indices[ i + 1 ] );

							}

						} else {

							var step = object.mode === THREE.LinePieces ? 2 : 1;

							for ( var i = 0, l = ( positions.length / 3 ) - 1; i < l; i += step ) {

								renderList.pushLine( i, i + 1 );

							}

						}

					}

				} else if ( geometry instanceof THREE.Geometry ) {

					_modelViewProjectionMatrix.multiplyMatrices( _viewProjectionMatrix, _modelMatrix );

					var vertices = object.geometry.vertices;

					if ( vertices.length === 0 ) continue;

					v1 = getNextVertexInPool();
					v1.positionScreen.copy( vertices[ 0 ] ).applyMatrix4( _modelViewProjectionMatrix );

					// Handle LineStrip and LinePieces
					var step = object.mode === THREE.LinePieces ? 2 : 1;

					for ( var v = 1, vl = vertices.length; v < vl; v ++ ) {

						v1 = getNextVertexInPool();
						v1.positionScreen.copy( vertices[ v ] ).applyMatrix4( _modelViewProjectionMatrix );

						if ( ( v + 1 ) % step > 0 ) continue;

						v2 = _vertexPool[ _vertexCount - 2 ];

						_clippedVertex1PositionScreen.copy( v1.positionScreen );
						_clippedVertex2PositionScreen.copy( v2.positionScreen );

						if ( clipLine( _clippedVertex1PositionScreen, _clippedVertex2PositionScreen ) === true ) {

							// Perform the perspective divide
							_clippedVertex1PositionScreen.multiplyScalar( 1 / _clippedVertex1PositionScreen.w );
							_clippedVertex2PositionScreen.multiplyScalar( 1 / _clippedVertex2PositionScreen.w );

							_line = getNextLineInPool();

							_line.id = object.id;
							_line.v1.positionScreen.copy( _clippedVertex1PositionScreen );
							_line.v2.positionScreen.copy( _clippedVertex2PositionScreen );

							_line.z = Math.max( _clippedVertex1PositionScreen.z, _clippedVertex2PositionScreen.z );

							_line.material = object.material;

							if ( object.material.vertexColors === THREE.VertexColors ) {

								_line.vertexColors[ 0 ].copy( object.geometry.colors[ v ] );
								_line.vertexColors[ 1 ].copy( object.geometry.colors[ v - 1 ] );

							}

							_renderData.elements.push( _line );

						}

					}

				}

			} else if ( object instanceof THREE.Sprite ) {

				_vector4.set( _modelMatrix.elements[ 12 ], _modelMatrix.elements[ 13 ], _modelMatrix.elements[ 14 ], 1 );
				_vector4.applyMatrix4( _viewProjectionMatrix );

				var invW = 1 / _vector4.w;

				_vector4.z *= invW;

				if ( _vector4.z >= - 1 && _vector4.z <= 1 ) {

					_sprite = getNextSpriteInPool();
					_sprite.id = object.id;
					_sprite.x = _vector4.x * invW;
					_sprite.y = _vector4.y * invW;
					_sprite.z = _vector4.z;
					_sprite.object = object;

					_sprite.rotation = object.rotation;

					_sprite.scale.x = object.scale.x * Math.abs( _sprite.x - ( _vector4.x + camera.projectionMatrix.elements[ 0 ] ) / ( _vector4.w + camera.projectionMatrix.elements[ 12 ] ) );
					_sprite.scale.y = object.scale.y * Math.abs( _sprite.y - ( _vector4.y + camera.projectionMatrix.elements[ 5 ] ) / ( _vector4.w + camera.projectionMatrix.elements[ 13 ] ) );

					_sprite.material = object.material;

					_renderData.elements.push( _sprite );

				}

			}

		}

		if ( sortElements === true ) {

			_renderData.elements.sort( painterSort );

		}

		return _renderData;

	};

	// Pools

	function getNextObjectInPool() {

		if ( _objectCount === _objectPoolLength ) {

			var object = new THREE.RenderableObject();
			_objectPool.push( object );
			_objectPoolLength ++;
			_objectCount ++;
			return object;

		}

		return _objectPool[ _objectCount ++ ];

	}

	function getNextVertexInPool() {

		if ( _vertexCount === _vertexPoolLength ) {

			var vertex = new THREE.RenderableVertex();
			_vertexPool.push( vertex );
			_vertexPoolLength ++;
			_vertexCount ++;
			return vertex;

		}

		return _vertexPool[ _vertexCount ++ ];

	}

	function getNextFaceInPool() {

		if ( _faceCount === _facePoolLength ) {

			var face = new THREE.RenderableFace();
			_facePool.push( face );
			_facePoolLength ++;
			_faceCount ++;
			return face;

		}

		return _facePool[ _faceCount ++ ];


	}

	function getNextLineInPool() {

		if ( _lineCount === _linePoolLength ) {

			var line = new THREE.RenderableLine();
			_linePool.push( line );
			_linePoolLength ++;
			_lineCount ++
			return line;

		}

		return _linePool[ _lineCount ++ ];

	}

	function getNextSpriteInPool() {

		if ( _spriteCount === _spritePoolLength ) {

			var sprite = new THREE.RenderableSprite();
			_spritePool.push( sprite );
			_spritePoolLength ++;
			_spriteCount ++
			return sprite;

		}

		return _spritePool[ _spriteCount ++ ];

	}

	//

	function painterSort( a, b ) {

		if ( a.z !== b.z ) {

			return b.z - a.z;

		} else if ( a.id !== b.id ) {

			return a.id - b.id;

		} else {

			return 0;

		}

	}

	function clipLine( s1, s2 ) {

		var alpha1 = 0, alpha2 = 1,

		// Calculate the boundary coordinate of each vertex for the near and far clip planes,
		// Z = -1 and Z = +1, respectively.
		bc1near =  s1.z + s1.w,
		bc2near =  s2.z + s2.w,
		bc1far =  - s1.z + s1.w,
		bc2far =  - s2.z + s2.w;

		if ( bc1near >= 0 && bc2near >= 0 && bc1far >= 0 && bc2far >= 0 ) {

			// Both vertices lie entirely within all clip planes.
			return true;

		} else if ( ( bc1near < 0 && bc2near < 0 ) || ( bc1far < 0 && bc2far < 0 ) ) {

			// Both vertices lie entirely outside one of the clip planes.
			return false;

		} else {

			// The line segment spans at least one clip plane.

			if ( bc1near < 0 ) {

				// v1 lies outside the near plane, v2 inside
				alpha1 = Math.max( alpha1, bc1near / ( bc1near - bc2near ) );

			} else if ( bc2near < 0 ) {

				// v2 lies outside the near plane, v1 inside
				alpha2 = Math.min( alpha2, bc1near / ( bc1near - bc2near ) );

			}

			if ( bc1far < 0 ) {

				// v1 lies outside the far plane, v2 inside
				alpha1 = Math.max( alpha1, bc1far / ( bc1far - bc2far ) );

			} else if ( bc2far < 0 ) {

				// v2 lies outside the far plane, v2 inside
				alpha2 = Math.min( alpha2, bc1far / ( bc1far - bc2far ) );

			}

			if ( alpha2 < alpha1 ) {

				// The line segment spans two boundaries, but is outside both of them.
				// (This can't happen when we're only clipping against just near/far but good
				//  to leave the check here for future usage if other clip planes are added.)
				return false;

			} else {

				// Update the s1 and s2 vertices to match the clipped line segment.
				s1.lerp( s2, alpha1 );
				s2.lerp( s1, 1 - alpha2 );

				return true;

			}

		}

	}

};
/* END FILE */
/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

var Detector = {

	canvas: !! window.CanvasRenderingContext2D,
	webgl: ( function () { try { var canvas = document.createElement( 'canvas' ); return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) ); } catch ( e ) { return false; } } )(),
	workers: !! window.Worker,
	fileapi: window.File && window.FileReader && window.FileList && window.Blob,

	getWebGLErrorMessage: function () {

		var element = document.createElement( 'div' );
		element.id = 'webgl-error-message';
		element.style.fontFamily = 'monospace';
		element.style.fontSize = '13px';
		element.style.fontWeight = 'normal';
		element.style.textAlign = 'center';
		element.style.background = '#fff';
		element.style.color = '#000';
		element.style.padding = '1.5em';
		element.style.width = '400px';
		element.style.margin = '5em auto 0';

		if ( ! this.webgl ) {

			element.innerHTML = window.WebGLRenderingContext ? [
				'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
				'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
			].join( '\n' ) : [
				'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
				'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
			].join( '\n' );

		}

		return element;

	},

	addGetWebGLMessage: function ( parameters ) {

		var parent, id, element;

		parameters = parameters || {};

		parent = parameters.parent !== undefined ? parameters.parent : document.body;
		id = parameters.id !== undefined ? parameters.id : 'oldie';

		element = Detector.getWebGLErrorMessage();
		element.id = id;

		parent.appendChild( element );

	}

};

// browserify support
if ( typeof module === 'object' ) {

	module.exports = Detector;

}
/* END FILE */
var LoaderWrapper = (function() {

    // Just so you can see what "this" refers to. It's the global window object.
    // Never attach anything to "this" because then it's a global var/method
    // and you start polluting the global namespace.
  

    // This pattern gives you closure privacy. This is self executing which
    // means you don't have to use the new operator but this is a static/singleton
    // class. Only one instance is created.

    // All methods are private. You don't have to worry about scoping or using
    // "this". If you were to //trace out "this", you would get an instance of
    // the global window object. Never use "this" within the module pattern.
    'use strict';

    

    function openView(  )
    {
       
       
           
      


    }

   

    function closeView() {

        
       

    }

   
    

    function addEventListeners()
    {
       
    }

    function removeEventListeners()
    {
       
    }

    function resizeViewport( event )
    {
         
            
    }



    
    function init() 
    {
        initDomPointers()
        
    }

    



   function initDomPointers()
    {
        
            var topLoader = new PercentageLoader(document.getElementById('js-preloader'), {
              width: 80, height: 80, controllable: true, progress: 0.5, onProgressUpdate: function (val) {
                this.setValue(0 + 'kj');
              }
            });

            var topLoaderRunning = false;

            var speedIc = 27;

            /* Some browsers may load in assets asynchronously. If you are using the percentage
             * loader as soon as you create it (i.e. within the same execution block) you may want to
             * wrap it in the below `ready` function to ensure its correct operation
             */
            topLoader.loaded(function () {
              
                if (topLoaderRunning) {
                  return;
                }

                topLoaderRunning = true;

                var kb = 20;
                var totalKb = 999;

                var animateFunc = function () {
                  kb += speedIc;
                  topLoader.setProgress(kb / totalKb);
                  topLoader.setValue(kb.toString() + 'kb');

                  if (kb < totalKb) {
                    setTimeout(animateFunc, 25);
                  } else {
                    topLoaderRunning = false;
                    //trace( "done loading from fake preloaders")
                    exPublicApi.loadingPercentageComplete();
                  }
                };

                setTimeout(animateFunc, 25);
              });
           


    }

    function speedDatLoaderUp() {
        speedIc = 100;
    }
   

    
    
    return {

    	// public functions
        
        init: init,
        speedDatLoaderUp:speedDatLoaderUp,
        openView:openView,
        closeView:closeView
        

       
       
        // public vars

       
    };

})();/* END FILE */
var SubHeaderSwitcher = (function() {

    // Just so you can see what "this" refers to. It's the global window object.
    // Never attach anything to "this" because then it's a global var/method
    // and you start polluting the global namespace.
  

    // This pattern gives you closure privacy. This is self executing which
    // means you don't have to use the new operator but this is a static/singleton
    // class. Only one instance is created.

    // All methods are private. You don't have to worry about scoping or using
    // "this". If you were to //trace out "this", you would get an instance of
    // the global window object. Never use "this" within the module pattern.
    'use strict';

    

    
    var altSubHeaders = []
    var normalSubHeaders = []

        
  

    function openView()
    {
        if( isOpen == false ) {
           isOpen = true; 
         
         
             
        }
           
      


    }

   

    function closeView() {

        if( isOpen == true ) {
           isOpen = false; 
          
           
        }
       

    }

     

    function setMouse() {
         for( var i = 0 ; i < 6 ; i ++ ) {
           

            altSubHeaders[i].style.display = "block"
            normalSubHeaders[i].style.display = "none"
        }
   
    }

    function setDevice() {
        for( var i = 0 ; i < 6 ; i ++ ) {
           

            altSubHeaders[i].style.display = "none"
            normalSubHeaders[i].style.display = "block"
        }
    }
    

    function addEventListeners()
    {
       
    }

    function removeEventListeners()
    {
       
    }

    function resizeViewport( event )
    {
         
            
    }



   
    
    function init( ) 
    {
       
        initDomPointers()
        
    }

    



   function initDomPointers()
    {
       
        for( var i = 0 ; i < 6 ; i ++ ) {
            altSubHeaders[i] = document.getElementById( "js-type-alt-" +i )
            normalSubHeaders[i] = document.getElementById( "js-type-" +i )

           
        }
   
    }
    
    
    return {

    	// public functions
        
        init: init,
        setMouse: setMouse,
        setDevice: setDevice,
        openView:openView,
        closeView:closeView
       

       
       
        // public vars

       
    };

})();/* END FILE */
var SpriteAnimator = function () {

    'use strict';
    
    
   
    var isOpen = false;
    var canvas, context, image, width, height, xpos = 0, ypos = 0, index = 0, numFrames = 9, frameSizeW = 168 , frameSizeH = 64;
    var counterInterval;

    var canvasName;
    var imageSrc;

    function openView() {
        if( isOpen == false ) {

            isOpen = true
           
           
            
         
        }
    }



    function closeView() {
        if( isOpen == true ) {
           
             isOpen = false
           
        }
            //ctx.drawImage( images, 0 , 0);
            //TweenLite.to( imageElement  , .2 ,{ opacity: 0, onComplete:closeComplete})
    }
    function isOpens() {
        return isOpen;
    }

    function init( canvasName_ , imageSrc_ , frameSizeW_ , frameSizeH_ , numFrames_ ) {
        
        canvasName = canvasName_;
        imageSrc = imageSrc_;
        frameSizeW = frameSizeW_
        frameSizeH = frameSizeH_
        numFrames = numFrames_

        image = new Image();
        image.src = imageSrc //"designassets/Samsung0G/TIMER_SpriteSheet/timer.png";
        image.onload = function() {
            width = image.width;
            height = image.height;
            canvas = document.getElementById(canvasName)
            TweenLite.set(canvas , { scale:.8 , x:10} )
            context = canvas.getContext("2d");
            context.drawImage(image, xpos, ypos, frameSizeW, frameSizeH, 0, 0, frameSizeW, frameSizeH);
         
                //startCounter()
        };
           
    }

    
    


      function showDatCount() {
        clearCounter() 
        TweenLite.killDelayedCallsTo( countResolve )
         TweenLite.killDelayedCallsTo( startCounter )
        xpos = 0
        ypos = 0;
        index = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, xpos, ypos, frameSizeW, frameSizeH, 0, 0, frameSizeW, frameSizeH);
       // counterInterval =  setInterval(count , 1000/24);
       TweenLite.delayedCall( .05 , startCounter )
      }


      function startCounter() {
        xpos = 0;
        ypos = 0;
        index = 0;
        context.drawImage(image, xpos, ypos, frameSizeW, frameSizeH, 0, 0, frameSizeW, frameSizeH);
        counterInterval =  setInterval(count , 700/24);
      }

      function count() {

                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, xpos, ypos, frameSizeW, frameSizeH, 0, 0, frameSizeW, frameSizeH);
                xpos += frameSizeW;
                index += 1;
               // //trace( index )
                if(index == numFrames -1) {
                   // //trace( "we counted to sevens")
                    clearCounter()
                    xpos = 0;
                    ypos += frameSizeH;
                    TweenLite.delayedCall( 2 , countResolve )
                }else if(index >= numFrames) {
                     //trace( "we are done sons")
                    clearCounter()
                }
                else if(xpos + frameSizeW > width) {
                    xpos = 0;
                    ypos += frameSizeH;
                }
      }

      function countResolve() {
           TweenLite.set(canvas , { opacity:0} )
           count()
           TweenLite.to(canvas , .5,  { opacity:1} )
      }

      function clearCounter() {
        if( counterInterval ){

          clearInterval(counterInterval);
        }
      }




    return {

        isOpens: isOpens,
       
        openView: openView,
        showDatCount: showDatCount,
        clearCounter: clearCounter,
        closeView: closeView,
        init: init


        
    };
}

/* END FILE */
/**
 * Based on http://www.emagix.net/academic/mscs-project/item/camera-sync-with-css3-and-webgl-threejs
 * @author mrdoob / http://mrdoob.com/
 */

THREE.CSS3DObject = function ( element ) {

	THREE.Object3D.call( this );

	this.element = element;
	this.element.style.position = 'absolute';

	this.addEventListener( 'removed', function ( event ) {

		if ( this.element.parentNode !== null ) {

			this.element.parentNode.removeChild( this.element );

		}

	} );

};

THREE.CSS3DObject.prototype = Object.create( THREE.Object3D.prototype );
THREE.CSS3DObject.prototype.constructor = THREE.CSS3DObject;

THREE.CSS3DSprite = function ( element ) {

	THREE.CSS3DObject.call( this, element );

};

THREE.CSS3DSprite.prototype = Object.create( THREE.CSS3DObject.prototype );
THREE.CSS3DSprite.prototype.constructor = THREE.CSS3DSprite;

//

THREE.CSS3DRenderer = function () {

	console.log( 'THREE.CSS3DRenderer', THREE.REVISION );

	var _width, _height;
	var _widthHalf, _heightHalf;

	var matrix = new THREE.Matrix4();
	
	var cache = {
		camera: { fov: 0, style: '' },
		objects: {}
	};

	var domElement = document.createElement( 'div' );
	domElement.style.overflow = 'hidden';

	domElement.style.WebkitTransformStyle = 'preserve-3d';
	domElement.style.MozTransformStyle = 'preserve-3d';
	domElement.style.oTransformStyle = 'preserve-3d';
	domElement.style.transformStyle = 'preserve-3d';

	this.domElement = domElement;

	var cameraElement = document.createElement( 'div' );

	cameraElement.style.WebkitTransformStyle = 'preserve-3d';
	cameraElement.style.MozTransformStyle = 'preserve-3d';
	cameraElement.style.oTransformStyle = 'preserve-3d';
	cameraElement.style.transformStyle = 'preserve-3d';

	domElement.appendChild( cameraElement );

	this.setClearColor = function () {

	};

	this.setSize = function ( width, height ) {

		_width = width;
		_height = height;

		_widthHalf = _width / 2;
		_heightHalf = _height / 2;

		domElement.style.width = width + 'px';
		domElement.style.height = height + 'px';

		cameraElement.style.width = width + 'px';
		cameraElement.style.height = height + 'px';

	};

	var epsilon = function ( value ) {

		return Math.abs( value ) < 0.000001 ? 0 : value;

	};

	var getCameraCSSMatrix = function ( matrix ) {

		var elements = matrix.elements;

		return 'matrix3d(' +
			epsilon( elements[ 0 ] ) + ',' +
			epsilon( - elements[ 1 ] ) + ',' +
			epsilon( elements[ 2 ] ) + ',' +
			epsilon( elements[ 3 ] ) + ',' +
			epsilon( elements[ 4 ] ) + ',' +
			epsilon( - elements[ 5 ] ) + ',' +
			epsilon( elements[ 6 ] ) + ',' +
			epsilon( elements[ 7 ] ) + ',' +
			epsilon( elements[ 8 ] ) + ',' +
			epsilon( - elements[ 9 ] ) + ',' +
			epsilon( elements[ 10 ] ) + ',' +
			epsilon( elements[ 11 ] ) + ',' +
			epsilon( elements[ 12 ] ) + ',' +
			epsilon( - elements[ 13 ] ) + ',' +
			epsilon( elements[ 14 ] ) + ',' +
			epsilon( elements[ 15 ] ) +
		')';

	};

	var getObjectCSSMatrix = function ( matrix ) {

		var elements = matrix.elements;

		return 'translate3d(-50%,-50%,0) matrix3d(' +
			epsilon( elements[ 0 ] ) + ',' +
			epsilon( elements[ 1 ] ) + ',' +
			epsilon( elements[ 2 ] ) + ',' +
			epsilon( elements[ 3 ] ) + ',' +
			epsilon( - elements[ 4 ] ) + ',' +
			epsilon( - elements[ 5 ] ) + ',' +
			epsilon( - elements[ 6 ] ) + ',' +
			epsilon( - elements[ 7 ] ) + ',' +
			epsilon( elements[ 8 ] ) + ',' +
			epsilon( elements[ 9 ] ) + ',' +
			epsilon( elements[ 10 ] ) + ',' +
			epsilon( elements[ 11 ] ) + ',' +
			epsilon( elements[ 12 ] ) + ',' +
			epsilon( elements[ 13 ] ) + ',' +
			epsilon( elements[ 14 ] ) + ',' +
			epsilon( elements[ 15 ] ) +
		')';

	};

	var renderObject = function ( object, camera ) {

		if ( object instanceof THREE.CSS3DObject ) {

			var style;

			if ( object instanceof THREE.CSS3DSprite ) {

				// http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/

				matrix.copy( camera.matrixWorldInverse );
				matrix.transpose();
				matrix.copyPosition( object.matrixWorld );
				matrix.scale( object.scale );

				matrix.elements[ 3 ] = 0;
				matrix.elements[ 7 ] = 0;
				matrix.elements[ 11 ] = 0;
				matrix.elements[ 15 ] = 1;

				style = getObjectCSSMatrix( matrix );

			} else {

				style = getObjectCSSMatrix( object.matrixWorld );

			}

			var element = object.element;
			var cachedStyle = cache.objects[ object.id ];

			if ( cachedStyle === undefined || cachedStyle !== style ) {

				element.style.WebkitTransform = style;
				element.style.MozTransform = style;
				element.style.oTransform = style;
				element.style.transform = style;

				cache.objects[ object.id ] = style;

			}

			if ( element.parentNode !== cameraElement ) {

				cameraElement.appendChild( element );

			}

		}

		for ( var i = 0, l = object.children.length; i < l; i ++ ) {

			renderObject( object.children[ i ], camera );

		}

	};

	this.render = function ( scene, camera ) {

		var fov = 0.5 / Math.tan( THREE.Math.degToRad( camera.fov * 0.5 ) ) * _height;

		if ( cache.camera.fov !== fov ) {

			domElement.style.WebkitPerspective = fov + "px";
			domElement.style.MozPerspective = fov + "px";
			domElement.style.oPerspective = fov + "px";
			domElement.style.perspective = fov + "px";

			cache.camera.fov = fov;

		}

		scene.updateMatrixWorld();

		if ( camera.parent === undefined ) camera.updateMatrixWorld();

		camera.matrixWorldInverse.getInverse( camera.matrixWorld );

		var style = "translate3d(0,0," + fov + "px)" + getCameraCSSMatrix( camera.matrixWorldInverse ) +
			" translate3d(" + _widthHalf + "px," + _heightHalf + "px, 0)";

		if ( cache.camera.style !== style ) {

			cameraElement.style.WebkitTransform = style;
			cameraElement.style.MozTransform = style;
			cameraElement.style.oTransform = style;
			cameraElement.style.transform = style;
			
			cache.camera.style = style;

		}

		renderObject( scene, camera );

	};

};/* END FILE */
var FeaturesController;

(function($) {

    



  var sweetCountSpriteAnimator = new  SpriteAnimator();
  sweetCountSpriteAnimator.init( "js-sweetCanvas" , "designassets/sprites/clock.png" , 266   , 56 ,  91 )

  function loops() {
     sweetCountSpriteAnimator.showDatCount()
  }



 



  var currentlySelected = null;

  var left = function($element) {
   // //console.log("element width", elementWidth);dsdd


  };

  var top = function($element) {
    var parentWidth = window.innerWidth;
    var elementWidth = $element.width() * 0.05;
    var parentHeight = window.innerHeight;
    var elementHeight = $element.height() * 0.05;
   // //console.log("element width", elementWidth);

    $element.css({
      top: (parentHeight - elementHeight) / 4,
      left: (parentWidth - elementWidth) / 2,
    });

  };

 

  var topClose = function($element) {
    var parentWidth = window.innerWidth;
    var elementWidth = $element.width() * 0.05;
    var parentHeight = window.innerHeight;
    var elementHeight = $element.height() * 0.05;
  //  //console.log("element width", elementWidth);

    $element.css({
      top: (parentHeight - elementHeight) / 3,
      left: (parentWidth - elementWidth) / 2,
    });

  };


  var positions = {
    0: "left",
    1: "top",
    2: "top",
    3: "topFar",
    4: "top",
    5: "bottom",
  };

  var edgeOnly = {
    0: false,
    1: false,
    2: false,
    3: false,
    4: true,
    5: false,
  };

  var animations = [];

  function idString(id) {
    return "#spec-" + id;
  };

  function getSpecElement(id) {
    return $(idString(id));
  };

  function staggerInChildren(element, id) {

    var currentAnimation = animations[currentlySelected];
    var tl = new TimelineMax();

    // all in seconds
    var DELAY = 1.1;
    var LENGTH = 0.9;
    var STAGGER_DELAY = 0.3;

    var children = $(element).find('.spec-inner').children();
    var from = {alpha: 0, y: 0};
    var to   = {alpha: 1, y: 0, delay: DELAY};
    tl.staggerFromTo(children, LENGTH, from, to, STAGGER_DELAY, "stagger");

    return tl;
  };

  function fadeOutChildren(element) {
    element.animate({opacity: 0});
  };

  var specContainer = document.getElementById( "specs-container")
  var availableOnEdge = $('#available-on-edge');
  var availableOnEdgeTimeline = new TimelineMax();
  availableOnEdgeTimeline.fromTo(availableOnEdge, 0.2, {alpha: 0}, {alpha: 1});
  availableOnEdgeTimeline.pause();

  function showFeatureById(id) {

    specContainer.style.display = "block"
     sweetCountSpriteAnimator.clearCounter()
   //console.log("showing", id);
    var element = getSpecElement(id).animate({opacity: 1});
    var currentElement = getSpecElement(currentlySelected);

    if (currentElement[0] == element[0]) return;
 //   clearCounter()
    if( id == 0 ){
     // showDatCount()ddzdedse
    }

    if( id == 3 ){
      sweetCountSpriteAnimator.showDatCount()
    }



    fadeOutChildren(currentElement);

    positionAndResize(id);

    animations[id] = staggerInChildren(element, id);

   // //console.log("available text", availableOnEdge[0]);

    if (edgeOnly[id]) {
      availableOnEdgeTimeline.tweenTo(1);
    }
    else {
      availableOnEdgeTimeline.tweenTo(0);
    }


    currentlySelected = id;

  };

  function hideAll() {
    sweetCountSpriteAnimator.clearCounter()
    
    var currentElement = getSpecElement(currentlySelected);
    fadeOutChildren(currentElement);
    currentlySelected = null;
    availableOnEdgeTimeline.tweenTo(0);
  };

  function positionAndResize(id) {

    var $element = getSpecElement(id)


    var position = positions[id]

    var parentWidth = $('#specs-container').width();
    var parentHeight = $('#specs-container').height();

    var elementHeight = $element.height();
    var actualWidth = 1176;

    var top;
    var left;

   // //console.log("parent height", parentHeight, "element height", elementHeight);

    if (position == "left") {
      var actualWidth = 500;
      // hack, hardcoded. deals with bug where spec 0
      // is too high the first time it's shown.
      elementHeight = 176;
      top = (parentHeight - elementHeight) / 2;
      left = 0;
    }
    else if (position == "top") {
      top = (parentHeight - elementHeight) / 4;
      left = (parentWidth - actualWidth) / 2;
    }
    else if (position == "topClose") {
      top = (parentHeight - elementHeight) / 3.0;
      left = (parentWidth - actualWidth) / 2;
    }
    else if (position == "topVeryClose") {
      top = (parentHeight - elementHeight) / 2.8;
      left = (parentWidth - actualWidth) / 2;
    }else if (position == "topFar") {
      top = (parentHeight - elementHeight) / 6;
      left = (parentWidth - actualWidth) / 2;
    }else if (position == "bottom") {
      top = (parentHeight - elementHeight)/1.4;
      left = (parentWidth - actualWidth) / 2;
    }else if (position == "right") {
     // var actualWidth = 500;
      // hack, hardcoded. deals with bug where spec 0
      // is too high the first time it's shown.
    //  elementHeight = 176;esdx

      top = (parentHeight - elementHeight) / 2;
      left = (parentWidth -825);
    }

    $element.css({
      top: top,
      left: left,
      width: actualWidth,
    });

  }

  $(window).resize(function() {
    positionAndResize(currentlySelected);
  });

  positionAndResize(currentlySelected);

  FeaturesController = {
    showFeatureById: showFeatureById,
    loops: loops,
    hideAll: hideAll,
  };

  hideAll();

}).call(null, jQuery);
/* END FILE */
var FeaturesData = [
  //Front
  {
    name: 'front_camera',
    anchor:{ position: {x:1.54,y:3.55,z:.2}},
    mouseUpShuttle:{ position: {x:0,y:0,z:0}},
    btnDesc:"fast launch camera",
    id:0,
    screenId:0
  },
  {
    name: 'display',
    anchor:{ position: {x:0,y:1,z:.2}},
    mouseUpShuttle:{ position: {x:-0.0,y:0.0,z:1.57}},
    btnDesc:"super amoled display",
    id:1,
    screenId:1
  },
  {
    name: 'screen',
    anchor:{ position: {x:0,y:2,z:.25}},
  //  mouseUpShuttle:{ position: {x:1.57,y:0,z:1.52}},
     mouseUpShuttle:{ position: {x:1.55,y:0,z:1.55}},
    btnDesc:"edge notifications",
    id:2,
    screenId:2
  },
  {
    name: 'charger',
    anchor:{ position: {x:0,y:-3.8,z:0}},
    mouseUpShuttle:{ position: {x:-1.1,y:0,z:0}},
    btnDesc:"adaptive fast charging",
    id:3,
    screenId:3
  },
  {
    name: 'storage',
    anchor:{  position: {x:1.6673126307526809,y:0.0016837235113630038,z:0.0016837235113630038}},

     
    mouseUpShuttle:{ position: { x:-1.2807941138320065, y:0.02994974651360672,z:-0.5321734529538134 } },
    btnDesc:"wireless charging",
    id:4,
    screenId:4
  },
    //Bottom edge
  {
    name: 'pen',
    anchor:{ position: {x:1.8,y:-1.2,z:.05}},
    mouseUpShuttle:{ position: {x:-1.19,y:-0.017115363127963346,z:1.5430244940485238}},
    btnDesc:"dual edge display",
    id:5,
    screenId:5
  },

  // redundant range info, for dif ppositions
  {
    name: 'screen',
    anchor:{ position: {x:0,y:2,z:.25}},
  //  mouseUpShuttle:{ position: {x:1.57,y:0,z:1.52}},
     mouseUpShuttle:{ position: {x:1.55,y:0,z:-1.55}},
     btnDesc:"edge notifications",
    id:2,
    screenId:9
  },
  {
    name: 'display',
    anchor:{ position: {x:0,y:1,z:.2}},
    mouseUpShuttle:{ position: {x:-0,y:0,z:-1.57}},
    btnDesc:"super amoled display",
    id:1,
    screenId:7
  },
    //Bottom edge
  {
    name: 'pen',
    anchor:{ position: {x:1.8,y:-1,z:.05}},
    mouseUpShuttle:{ position: {x:-1.25,y:0.011,z:-1.5430244940485238}},
    btnDesc:"dual edge display",
    id:5,
    screenId:8
  },




];
/* END FILE */
var ConnectionController;

(function() {

  $('#connect-button').on('click', function() {
    $(this).animate({opacity: 0}, 200);
    $('#connect-guid').animate({opacity: 1}, 200);
    swapIntroTextHandler()

  });

  function swapIntroTextHandler() {
            trace( "swapIntroTextHandlerswapIntroTextHandler")
            var oldText = document.getElementById("take-control")
            TweenLite.to( oldText , .5 , { opacity:0 , onComplete:showOtherIntroText })

            var oldSubText = document.getElementById("connect-your-phone")
            TweenLite.to(oldSubText , .5 , { opacity:0  })
        }


        function showOtherIntroText() {
            var oldText = document.getElementById("take-control")

           var newSubText = document.getElementById("connect-your-phone2")
          var newText = document.getElementById("js-connectHeader")
          TweenLite.set( newText , { opacity:0  })
          TweenLite.set( newSubText , { opacity:0  })
          //newSubText = document.getElementById("connect-your-phone2")
          // oldText.style.display = "none"
           newSubText.style.display = "block"
           newText.style.display = "block"
          TweenLite.to( newText ,.5 ,{ opacity:1  })
          TweenLite.to( newSubText ,.5 ,{ opacity:1  })
          
        }


}).call(null, jQuery);
/* END FILE */
var GlobalVolumeController = (function() {

    // Just so you can see what "this" refers to. It's the global window object.
    // Never attach anything to "this" because then it's a global var/method
    // and you start polluting the global namespace.
  

    // This pattern gives you closure privacy. This is self executing which
    // means you don't have to use the new operator but this is a static/singleton
    // class. Only one instance is created.

    // All methods are private. You don't have to worry about scoping or using
    // "this". If you were to //trace out "this", you would get an instance of
    // the global window object. Never use "this" within the module pattern.
    'use strict';

    

    
       

        
    var masterVolume = 1;
    var globalUpdateFuntion;
    



    function setVolume( volume ){
        masterVolume = volume
        globalUpdateFuntion( masterVolume );
    }

    function getVolume(){
        return masterVolume
       // globalUpdateFuntion();
    }

    function setGlobalUpdateFunction( function_ ) {
        globalUpdateFuntion = function_
    }


    
    return {

    	// public functions
        
        setVolume: setVolume,
        getVolume:getVolume,
        setGlobalUpdateFunction:setGlobalUpdateFunction
       

       
       
        // public vars

       
    };

})();/* END FILE */
var BackGroundVideoSkrim = (function() {

    // Just so you can see what "this" refers to. It's the global window object.
    // Never attach anything to "this" because then it's a global var/method
    // and you start polluting the global namespace.
  

    // This pattern gives you closure privacy. This is self executing which
    // means you don't have to use the new operator but this is a static/singleton
    // class. Only one instance is created.

    // All methods are private. You don't have to worry about scoping or using
    // "this". If you were to trace out "this", you would get an instance of
    // the global window object. Never use "this" within the module pattern.
    'use strict';

    

     var skrim;
       

        
  

    var isOpen = false;

    function openView()
    {
        if( isOpen == false ) {
           isOpen = true; 
          // TweenLite.to( skrim , .5 ,  { opacity:1 })
           
        }
           
      


    }

   

    function closeView() {

        if( isOpen == true ) {
           isOpen = false; 
           // TweenLite.to( skrim , .5 ,  { opacity:0 })
           
        }
       

    }


   
    

    function addEventListeners()
    {
       
    }

    function removeEventListeners()
    {
       
    }

    function resizeViewport( event )
    {
         
            
    }



   
    
    function init() 
    {
        initDomPointers()
        
    }

    



   function initDomPointers()
    {
        skrim = document.getElementById( "js-exBackGroundVideoSkrim" );
       // TweenLite.set( skrim , { opacity:0 })
    }

   

    
    
    return {

    	// public functions
        
        init: init,
        openView:openView,
        closeView:closeView
       

       
       
        // public vars

       
    };

})();/* END FILE */
var BackGroundVideoPlayer = function () {

    'use strict';
    
    
    

    var videoElement;
    var audioElement
  
    var videoPlaying = false;
    var animateBool = false;
    var seektime = 0;

    var alphaTween = false

    

    var isOpen = false;

    var loop = false

    var volumeObject = {}

    volumeObject.volume = 0;

    var pid;

    var hasAudio = true;

    var isSafari = false

    function openView() {
        if( isOpen == false ) {

            isOpen = true
            TweenLite.killTweensOf( videoElement )
            TweenLite.killTweensOf( volumeObject )
            TweenLite.set( videoElement , { opacity:0  })
           // videoElement.loop = false; 
            videoElement.currentTime = 0.1;
 
            volumeObject.volume = 0;
            videoElement.volume = 0;

            
            TweenLite.to( videoElement , .5 ,  { opacity:1 , delay:.1})
            BackGroundVideoSkrim.openView();

            var volume = GlobalVolumeController.getVolume()
            if( pid == 2 ){
               // volume = 0;
            }
            TweenLite.to( volumeObject , .5 ,  { volume:volume , onUpdate:fadeVolumeHandler , delay:.1})
            playHack()
            if( hasAudio == true  ){
                    audioElement.play()

                }

          
          
            videoPlaying  = true;
           

            
        }
    }

    function fadeVolumeHandler() {
       
        videoElement.volume = volumeObject.volume;
        if( hasAudio == true  ){
            audioElement.volume = volumeObject.volume;
        }
        
    }
    function playHack() {
         if( isSafari == true ){
            TweenLite.delayedCall(   .1 , delyaedPlay  );
            }else{
            videoElement.play();
        }
    }

    function closeView() {
        if( isOpen == true ) {
            
           isOpen = false
           
           videoPlaying  = false;
            BackGroundVideoSkrim.closeView();
            TweenLite.killTweensOf( videoElement )
             TweenLite.killTweensOf( volumeObject )
           TweenLite.to( videoElement , .5 ,  { opacity:0 , onComplete:closeComplete })
           TweenLite.to( volumeObject , .5 ,  { volume:0 , onUpdate:fadeVolumeHandler })
           
        }
            
    }

    function setHasVolume( bool ) {
        hasAudio = bool;
    }

    function updateVolume( vol ){

       
        TweenLite.killTweensOf( volumeObject )
        TweenLite.to( volumeObject , .5 ,  { volume:vol , onUpdate:fadeVolumeHandler , delay:0})
    } 

    function isOpens() {
        return isOpen;
    }

    function init( id  , loop_ , seektime_ ) {

        loop = loop_
        pid = id;
        seektime = seektime_
        BackGroundVideoSkrim.init();
        videoElement = document.getElementById("js-backGroundVideo" +id );

        audioElement = document.getElementById("js-backGroundAudio" +id );
        audioElement.addEventListener("ended",audioEndedHandler,false);
        videoElement.addEventListener("ended",videoEndedHandler,false);
       
       // videoElement.addEventListener("play", capture, false)
      ///   videoElement.addEventListener("timeupdate", upDateTimeHandler );
        TweenLite.set( videoElement , { opacity:0 })

        if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) 
        {
           isSafari = true        
        }
       
    }

    function upDateTimeHandler( e ) {
        var vTime = videoElement.currentTime;
        
    }

  //  Current time  
  

    
    function capture( e ) {
        if (e.type == "play"){
           // //trace( "play event handler ")
        }
    }
  
    function closeComplete() {
        videoPlaying  = false;
        videoElement.currentTime = 0.1;
        videoElement.pause()
        audioElement.currentTime = 0.1;
        audioElement.pause()
        
    }


    
    function videoEndedHandler( e ) {
         //trace(  pid+ " // video id //  video Ended Background screen, currentTime: " + videoElement.currentTime + ", seektime: " + seektime )
        if( loop == true ) {
               // videoElement.load();
            videoElement.currentTime = seektime

            playHack()
           //  videoElement.play();
          //  //trace( videoElement.volume + " videos volumes")
            
            // Guessing this redundant play call was put in place to fix some occasional race condition?
            // Commenting for now to see if it has anything to do with our loop stutter.
             
        }else{
            
        }
               
       
    }

    function audioEndedHandler( e ) {
       
             
             audioElement.currentTime = 0
             audioElement.play();
            
               
       
    }

    function delyaedPlay() {
        videoElement.play()
    }


    function videoCanplayHandler() {
       ////trace( " videoCanplayHandler " );
    }

   
    

    return {

        isOpens: isOpens,        
        openView: openView,
        closeView: closeView,
        updateVolume: updateVolume,
        setHasVolume: setHasVolume,
        init: init


        
    };
}

/* END FILE */
var USBModelView = (function() {

    // Just so you can see what "this" refers to. It's the global window object.
    // Never attach anything to "this" because then it's a global var/method
    // and you start polluting the global namespace.
  

    // This pattern gives you closure privacy. This is self executing which
    // means you don't have to use the new operator but this is a static/singleton
    // class. Only one instance is created.

    // All methods are private. You don't have to worry about scoping or using
    // "this". If you were to //trace out "this", you would get an instance of
    // the global window object. Never use "this" within the module pattern.
    'use strict';

    

    
       

        
    var model;

    var isOpen = false;

    var mat0
    var mat1
    var mat2
    var mat3

    function openView()
    {
        if( isOpen == false ) {
           isOpen = true; 
         
           TweenLite.to(  mat0 , .3 , { opacity:1 , delay:.2 , overwrite: true , onStart:showModel })
            TweenLite.to(  mat1 , .3 , { opacity:1 , delay:.2 , overwrite: true})
             
        }
           
      


    }

   

    function closeView() {

        if( isOpen == true ) {
           isOpen = false; 
          TweenLite.to(  mat0 , .1 , { opacity:0 , delay:0 , overwrite: true})
            TweenLite.to(  mat1 , .1 , { opacity:0 , delay:0 , overwrite: true , onComplete:hideModel})
           
        }
       

    }

    function hideModel() {
        model.visible = false
    }

    function showModel() {
        model.visible = true
    }

     


    

    function addEventListeners()
    {
       
    }

    function removeEventListeners()
    {
       
    }

    function resizeViewport( event )
    {
         
            
    }



   
    
    function init( mat0_ , mat1_ , model_) 
    {
        model = model_
        mat0 = mat0_
        mat1 = mat1_
      
        initDomPointers()
        
    }

    



   function initDomPointers()
    {
       

   
    }
    
    
    return {

    	// public functions
        
        init: init,
        openView:openView,
        closeView:closeView
       

       
       
        // public vars

       
    };

})();/* END FILE */
var ChargerModelView = (function() {

    // Just so you can see what "this" refers to. It's the global window object.
    // Never attach anything to "this" because then it's a global var/method
    // and you start polluting the global namespace.


    // This pattern gives you closure privacy. This is self executing which
    // means you don't have to use the new operator but this is a static/singleton
    // class. Only one instance is created.

    // All methods are private. You don't have to worry about scoping or using
    // "this". If you were to trace out "this", you would get an instance of
    // the global window object. Never use "this" within the module pattern.
    'use strict';







    var model;

    var isOpen = false;

    var mat0
    var mat1
    var mat2
    var mat3
    var mat4

    function openView()
    {
        if( isOpen == false ) {
           isOpen = true;
          model.visible = true
          var fadespeed = .6
          var lightFade = .6
           TweenLite.to(  mat0 , fadespeed , { opacity:1 , delay:.35 , overwrite: true,
                       ease: Linear.easeOut })
            TweenLite.to(  mat1 , fadespeed , { opacity:1 , delay:.35 , overwrite: true,
                       ease: Linear.easeOut })
             TweenLite.to(  mat2 , fadespeed , { opacity:.1, delay:.35 , overwrite: true,
                       ease: Linear.easeOut })
              TweenLite.to(  mat3 , fadespeed , { opacity:1, delay:.35 , overwrite: true,
                       ease: Linear.easeOut })

              TweenLite.to(  mat3 , fadespeed , { opacity:1, delay:.35 , overwrite: true,
                       ease: Linear.easeOut })

              TweenLite.to(  mat4 , lightFade , { opacity:1, delay:2.35 , overwrite: true,
                       ease: Linear.easeOut })

            TweenLite.to(  model.position , 3, { z: 3.95, delay:.2 , overwrite: true,
                       ease: Power3.easeOut , onComplete:playConnectionSound  })



        }




    }

    function playConnectionSound( ) {
      var sound = document.getElementById("js-chargerSound");
      sound.currentTime = 0;
      sound.play()
    }





    function closeView() {

        if( isOpen == true ) {
           isOpen = false;
          TweenLite.to(  mat0 , .4 , { opacity:0 , delay:0 , overwrite: true,
                       ease: Power3.easeInOut   })
            TweenLite.to(  mat1 , .4 , { opacity:0 , delay:0 , overwrite: true,
                       ease: Power3.easeInOut   })
             TweenLite.to(  mat2 , .4 , { opacity:0, delay:0 , overwrite: true,
                       ease: Power3.easeInOut   })
              TweenLite.to(  mat3 , .4 , { opacity:0, delay:0 , overwrite: true,
                       ease: Power3.easeInOut  , onComplete: hideModel })

              TweenLite.to(  mat4 , .4 , { opacity:0, delay:0 , overwrite: true,
                       ease: Power3.easeInOut  , onComplete: hideModel })

               TweenLite.to(  model.position , 1 , { z: -1.5, delay:0 , overwrite: true,
                       ease: Power3.easeInOut   })
        }


    }

    function hideModel() {
        model.visible = false
    }




    function addEventListeners()
    {

    }

    function removeEventListeners()
    {

    }

    function resizeViewport( event )
    {


    }





    function init( mat0_ , mat1_ , mat2_ , mat3_ , mat4_, model_)
    {
        model = model_

        model.position.z = -1.5// 3.41
        model.visible = false;
        mat0 = mat0_
        mat1 = mat1_
        mat2 = mat2_
        mat3 = mat3_
        mat4 = mat4_
        initDomPointers()

    }





   function initDomPointers()
    {



    }


    return {

    	// public functions

        init: init,
        openView:openView,
        closeView:closeView




        // public vars


    };

})();/* END FILE */
var BackGroundLightView = (function() {

    // Just so you can see what "this" refers to. It's the global window object.
    // Never attach anything to "this" because then it's a global var/method
    // and you start polluting the global namespace.
  

    // This pattern gives you closure privacy. This is self executing which
    // means you don't have to use the new operator but this is a static/singleton
    // class. Only one instance is created.

    // All methods are private. You don't have to worry about scoping or using
    // "this". If you were to trace out "this", you would get an instance of
    // the global window object. Never use "this" within the module pattern.
    'use strict';

    

     var exsiteBackgroundOverlayTop;
       

        
  

    var isOpen = false;

    function openView()
    {
        if( isOpen == false ) {
           isOpen = true; 
           lightsDown()
        }
           
      


    }

   

    function closeView() {

        
       

    }


    function lightsUp() {
        var speed = 2+ Math.random()*.4;
        var alpha = .9 + Math.random()* -.4
        TweenLite.to( exsiteBackgroundOverlayTop , speed , { opacity:alpha , onComplete:lightsDown })
    }

    function lightsDown() {
        var speed = 2+ Math.random()*.4;
        var alpha = .1 + Math.random()* .2
        TweenLite.to( exsiteBackgroundOverlayTop , speed , { opacity:alpha , onComplete:lightsUp })
    }

   
    

    function addEventListeners()
    {
       
    }

    function removeEventListeners()
    {
       
    }

    function resizeViewport( event )
    {
         
            
    }



   
    
    function init() 
    {
        initDomPointers()
        
    }

    



   function initDomPointers()
    {
        exsiteBackgroundOverlayTop = document.getElementById( "js-exsiteBackgroundOverlayTop" );
        TweenLite.set( exsiteBackgroundOverlayTop , { xPercent:-50})
    }

   

    
    
    return {

    	// public functions
        
        init: init,
        openView:openView,
        closeView:closeView
       

       
       
        // public vars

       
    };

})();/* END FILE */
var SuccessView = (function() {

    // Just so you can see what "this" refers to. It's the global window object.
    // Never attach anything to "this" because then it's a global var/method
    // and you start polluting the global namespace.
  

    // This pattern gives you closure privacy. This is self executing which
    // means you don't have to use the new operator but this is a static/singleton
    // class. Only one instance is created.

    // All methods are private. You don't have to worry about scoping or using
    // "this". If you were to //trace out "this", you would get an instance of
    // the global window object. Never use "this" within the module pattern.
    'use strict';

    var detection = $('.detection');
    var entertext = $('.exmouseMessageForClickAndDrag')//;document.getElementById("js-exmouseMessageForClickAndDrag")
  //  detection.style.zIndex = 20;

    var mouseText0 = document.getElementById( "js-exdetectionRotateHeader");
    var deviceText0 = document.getElementById( "js-exdetectionHeader");

    var deviceText1 = document.getElementById( "js-exTestDrive");

    function openViewMouse()
    {
        $('.intro').fadeOut();
       
        mouseText0.style.display = "block"
        deviceText1.style.display = "none"
        deviceText0.style.display = "none"
        entertext.fadeIn(800).addClass("on").delay(2000).fadeOut(1300);
       

       // $('.canvas-container').fadeIn();

        TweenLite.delayedCall( 1 , fadeInCanvas );


    }

    function fadeInCanvas() {
        $('.canvas-container').fadeIn();
    }

    function openViewDevice()
    {
        $('.intro').fadeOut();
        
        
        mouseText0.style.display = "none"
        
        deviceText0.style.display = "block"
        deviceText1.style.display = "none"

        TweenLite.set( deviceText1 , { opacity:0 })
        detection.fadeIn(600).addClass("on").delay(600)//.fadeOut(600);
       // $('.canvas-container').fadeIn();
      
        TweenLite.delayedCall( 2.2,  showSecondMessageDevice )
        TweenLite.delayedCall( 1 , fadeInCanvas );

    }

    function showSecondMessageDevice() {
        deviceText1.style.display = "block"
        TweenLite.to( deviceText0 , .4 ,{ opacity:0 })
        TweenLite.to( deviceText1 , .4 ,{ opacity:1 , delay:.2 })
        TweenLite.delayedCall( 3,  hideViewDevice )
    }

    function hideViewDevice() {
        detection.fadeOut(600);
    }



   

    function closeView() {

        
       

    }

   
    

    function addEventListeners()
    {
       
    }

    function removeEventListeners()
    {
       
    }

    function resizeViewport( event )
    {
         
            
    }



    
    

    

   
    
    function init() 
    {
        initDomPointers()
        
    }

    



   function initDomPointers()
    {
        TweenLite.set(  mouseText0 , {xPercent:-50 , yPercent:-50  });
        TweenLite.set(  deviceText0 , {xPercent:-50 , yPercent:-50  });
        TweenLite.set(  deviceText1 , {xPercent:-50 , yPercent:-50  });

        

    }

   

    
    
    return {

    	// public functions
        
        init: init,
        openViewMouse:openViewMouse,
        openViewDevice: openViewDevice,
        closeView:closeView
        


       
       
        // public vars

       
    };

})();/* END FILE */
var PhoneVideoScreenView = function () {

    'use strict';
    
    
    var videoCanvas = document.createElement( "canvas" )
    var videoctx = videoCanvas.getContext("2d");

    var videoElement;
    

    var canvasV = document.createElement( "canvas" )
    var ctxV = canvasV.getContext("2d");
    canvasV.width = 1024
    canvasV.height = 1024


   // var hook  = document.getElementById("js-backgroundPlate");
    
    //videoElement.play()

    var videoPlaying = false;
    var animateBool = false;
    var seektime = .01;

    var alphaTween = false

    var texture;
    var ctx
    var images
    var type = "video"

    var interval

    var isOpen = false;

    var loop = false

    var volumeObject = {}

    volumeObject.volume = 0;

    var pid;

    var isSafari = false

    function openView() {
        if( isOpen == false ) {

            isOpen = true
           // TweenLite.set( videoElement  ,  { opacity: 0})
           
          //  TweenLite.to( videoElement  , .2, { opacity: 1})
            ctx.clearRect(0,0,1024,1024)
            ctxV.clearRect(0,0,1024,1024)
            ctx.drawImage( images, 0 , 0);

            if( type == "video" ){
                videoElement.loop = false; 
                videoElement.currentTime = 0.1;
                videoElement.volume = 0;

                var volume = GlobalVolumeController.getVolume()
                TweenLite.to( volumeObject , .5 ,  { volume:volume , onUpdate:fadeVolumeHandler , delay:.1})
               

            }

            videoPlaying  = true;
            playHack()

            //ctx.globalAlpha = .1;
            alphaTween = true
            ctxV.globalAlpha = 0;
            TweenLite.to( ctxV , .5 , { globalAlpha:1 , onComplete: stopAlphaBlends} )
            if( animateBool == false ){
                animateBool = true
                animate();
           }
        }
    }

    function playHack() {
         if( isSafari == true ){
            TweenLite.delayedCall(   .1 , delyaedPlay  );
            }else{
            videoElement.play();
        }


    }

    function updateVolume( vol ){
         TweenLite.killTweensOf( volumeObject )
        TweenLite.to( volumeObject , .5 ,  { volume:vol , onUpdate:fadeVolumeHandler , delay:0})
    }

    function fadeVolumeHandler() {
       
        videoElement.volume = volumeObject.volume;
        
    }

    function closeView() {
        if( isOpen == true ) {
            alphaTween = true
             isOpen = false
           // ctxV.globalAlpha = 1;
           videoPlaying  = false;
           if( animateBool == false ){
                animateBool = true
                animate();
           }
           TweenLite.to( volumeObject , .5 ,  { volume:0 , onUpdate:fadeVolumeHandler })
            TweenLite.to( ctxV , .2 , { globalAlpha:0 , onComplete: stopAlphaBlendsClose} )

        }
            //ctx.drawImage( images, 0 , 0);
            //TweenLite.to( videoElement  , .2 ,{ opacity: 0, onComplete:closeComplete})
    }
    function isOpens() {
        return isOpen;
    }

    function init( id  , ctx_ , images_ , type_ , loop_ , seektime_) {
        seektime = seektime_
        pid = id;
        loop = loop_
        type = type_;
        ctx = ctx_;
        images = images_

        if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) 
        {
           isSafari = true        
        }


        if( type == "video" ){
            videoElement = document.getElementById("js-video" +id )

            //document.removeChild(videoElement);
            videoElement.addEventListener("ended",videoEndedHandler,false);
            //videoElement.addEventListener("canplay",videoCanplayHandler,false);

          }
       
    }

    

    function stopAlphaBlends(){
        alphaTween = false

    }

    function stopAlphaBlendsClose(){
        
        alphaTween = false
        animateBool = false
        videoPlaying  = false;
        if( type == "video" ){
            ctxV.globalAlpha = 0;
            videoElement.currentTime = .1;
            videoElement.pause()
        }
        ctx.clearRect(0,0,1024,1024)
        ctx.drawImage( images, 0 , 0);
        texture.needsUpdate = true
    }

    function closeComplete() {
        videoPlaying  = false;
        animateBool = false
    }


    
    function videoEndedHandler( e ) {
        //trace( pid + "  /// pid  // video Ended phone screen " + videoElement.currentTime )
        if( loop == true ) {
             videoElement.currentTime = seektime
             playHack()
        }else{
            animateBool = false;
            //trace( "Video done, no looping, draw still IMAGE yo")
           // var still = document.getElementById( "js-imageVideoStill0")
           // ctx.drawImage(still,0,0,1024,1024,0,0,1024,1024)
        }

         if( pid ==  3 ){
            FeaturesController.loops();
        }
               
       
    }

    function delyaedPlay() {
        videoElement.play()
    }
    function videoCanplayHandler() {
       //trace( " videoCanplayHandler " );
    }

    function animate() {

      ////trace( "animating video")
        if( animateBool == true ){
            requestAnimationFrame(animate);
         //   //trace( "renders")
            if( alphaTween == true ) {

               
                ctx.clearRect(0,0,1024,1024)
                ctx.drawImage( images, 0 , 0);
                ctxV.clearRect(0,0,1024,1024)
                ctxV.drawImage(videoElement,0,0,1024,1024,0,0,1024,1024)
                 
                ctx.drawImage( canvasV ,0,0,1024,1024,0,0,1024,1024)
                
                
               //ctx.setTransform(1, 0, 0, 1, 0, 0);
           }else{
                //ctx.clearRect(0,0,779,1385)
               // ctx.clearRect(40,185,782,1384);
                //ctx.drawImage( images, 0 , 0);
                
                ctx.drawImage(videoElement,0,0,1024,1024,0,0,1024,1024)
                
               // //trace( "fu;; alphas")
               
           }
            
           texture.needsUpdate = true
        }
            
               
    }

    function setTexture( texture_ ) {
        texture = texture_
        //trace( texture + " _____________________texture")
    }
    

    return {

        isOpens: isOpens,
        setTexture: setTexture,
        openView: openView,
        closeView: closeView,
        updateVolume: updateVolume,
        init: init


        
    };
}

/* END FILE */
var PhoneImageScreenView = function () {

    'use strict';
    
    
    var imageCanvas = document.createElement( "canvas" )
    var imageCtx = imageCanvas.getContext("2d");

    
    var imageElement;
    

    var canvasV = document.createElement( "canvas" )
    var ctxV = canvasV.getContext("2d");

   


    canvasV.width = 1024
    canvasV.height = 1024


   // var hook  = document.getElementById("js-backgroundPlate");
    
    //imageElement.play()

    var videoPlaying = false;
    var animateBool = false;
    var seektime = 0;

    var alphaTween = false

    var texture;
    var ctx
    var images
    var type = "video"

    var interval

    var isOpen = false;

    var pid

    function openView() {
        if( isOpen == false ) {

            isOpen = true
           
           
            
         
            ctx.drawImage( images, 0 , 0);
           

           
            alphaTween = true
            ctxV.globalAlpha = 0;
            TweenLite.to( ctxV , .5 , { globalAlpha:1 , overwrite: true , onComplete: stopAlphaBlends} )
            if( animateBool == false ){
              animateBool = true;
              animate()
           }
        }
    }



    function closeView() {
        if( isOpen == true ) {
            alphaTween = true
             isOpen = false
           if( animateBool == false ){
              animateBool = true;
              animate()
           }
            TweenLite.to( ctxV , .2 , { globalAlpha:0 , overwrite: true , onComplete: stopAlphaBlendsClose} )
            //trace( "CLOSE THIS IMAGE TEXTURE NOW_________________")
        }
            //ctx.drawImage( images, 0 , 0);
            //TweenLite.to( imageElement  , .2 ,{ opacity: 0, onComplete:closeComplete})
    }
    function isOpens() {
        return isOpen;
    }

    function init( id  , ctx_ , images_ , type_ ) {
        type = type_;
        ctx = ctx_;
        pid = id;
        images = images_
        imageElement = document.getElementById("js-image"+id)
        
       
    }

    function updateVolume( vol ){
    }

    function stopAlphaBlends(){
        alphaTween = false

    }

    function stopAlphaBlendsClose(){
        
        alphaTween = false
        animateBool = false
        
        ctx.clearRect(0,0,1024,1024)
        ctx.drawImage( images, 0 , 0);
        texture.needsUpdate = true
    }

    function closeComplete() {
        videoPlaying  = false;
        animateBool = false
    }


    
    function videoEndedHandler( e ) {
        //trace( "video Ended")

     
       
    }
    function videoCanplayHandler() {
       //trace( " videoCanplayHandler " );
    }

    function animate() {


        if( animateBool == true ){
            requestAnimationFrame(animate);
         //   //trace( "renders")
            if( alphaTween == true ) {

               
                ctx.clearRect(0,0,1024,1024)
                ctx.drawImage( images, 0 , 0);
                ctxV.clearRect(0,0,1024,1024 )
                ctxV.drawImage(imageElement,0,0,1024,1024,0,0,1024,1024)

                

               ctx.drawImage( canvasV ,0,0,1024,1024,0,0,1024,1024)
               ctx.setTransform(1, 0, 0, 1, 0, 0);
           }else{
                animateBool = false
                //ctxV.clearRect(0,0,1024,1024 )
                ctx.drawImage(imageElement,0,0,1024,1024,0,0,1024,1024)
               // //trace( "fu;; alphas")
               
           }
            
           texture.needsUpdate = true
        }
            
               
    }

    function setTexture( texture_ ) {
        texture = texture_
        //trace( texture + " _____________________texture")
    }
    

    return {

        isOpens: isOpens,
        setTexture: setTexture,
        openView: openView,
        updateVolume: updateVolume,
        closeView: closeView,
        init: init


        
    };
}

/* END FILE */
var DotMenuView = (function() {

    // Just so you can see what "this" refers to. It's the global window object.
    // Never attach anything to "this" because then it's a global var/method
    // and you start polluting the global namespace.
  

    // This pattern gives you closure privacy. This is self executing which
    // means you don't have to use the new operator but this is a static/singleton
    // class. Only one instance is created.

    // All methods are private. You don't have to worry about scoping or using
    // "this". If you were to //trace out "this", you would get an instance of
    // the global window object. Never use "this" within the module pattern.
    'use strict';


   

    
   
    var isTouch;
   
    var view;
    var wrapper;
    var featuresData = []

    var btnsArr = []

    var innerDotsArr = []
    var selectDotsArr = [];

    var iconPosDots = [];

    var functionReference

    var length = 6

    var entertext = document.getElementById("js-exmouseMessageForClickAndDrag")
    

    function openView()
    {
       
            centerView();
            var baseDelay = .5;
            TweenLite.to( view , .05 , { opacity:1 , delay:baseDelay })

            for( var i = 0 ; i < length ; i ++ ){
               
                var btn = btnsArr[i]
                var ints = i*.12
                TweenLite.set( btn , { opacity:0 })
                TweenLite.to( btn , .1 , { opacity:1 , delay:baseDelay + ints })

            }
          
           
           
      


    }



    function hasTouch() {
        return (('ontouchstart' in window) ||       // html5 browsers
                (navigator.maxTouchPoints > 0) ||   // future IE
                (navigator.msMaxTouchPoints > 0));  // current IE10
    }
    

    function closeView() {
        //removeEventListeners();
        TweenLite.to( view , .1 , { opacity:0 })
        // close all views
    }

    

    function addEventListeners()
    {
        window.addEventListener("resize", centerView );
    }

    function removeEventListeners()
    {
        window.removeEventListener("resize", centerView );
    }

    function resizeViewport( event )
    {
        resizeViews();       
            
    }

    function centerView ( event )
    {
      
        
      //  var xpos = Math.round( window.innerWidth/2 - 100/2);
        var parentWidth = Math.max(900, window.innerWidth);
        var parentHeight = Math.max(650, window.innerHeight);
        view.style.left =  Math.round((parentWidth / 2)- (view.clientWidth / 2)+10 ) +"px"
        view.style.top =  Math.round((parentHeight)- (view.clientHeight) -98) +"px"
       
        entertext.style.top =  Math.round((parentHeight)- (view.clientHeight) -178) +"px"
        DotLabelView.centerView()
    }

    
    var images = [ "designassets/phone_orientation_icons/orientation_b.png" , "designassets/phone_orientation_icons/orientation_a.png", "designassets/phone_orientation_icons/orientation_c.png" , "designassets/phone_orientation_icons/orientation_f.png","designassets/phone_orientation_icons/orientation_d.png" ,  "designassets/phone_orientation_icons/orientation_e.png"]
    
    function createDots() {
       // var length = 5 //featuresData.length;

       var xBase = -28;
       var xBaseIc = 29;
       var multiplyers = [ 1 , 0 , 2 , 3, 4 ,5 ]
        for( var i = 0 ; i < length ; i ++ ){
            var ref = document.createElement("div")
            ref.className = "exdot"
           

            var innerDot = document.createElement("div")
            innerDot.className = "exdotInner"
            ref.appendChild( innerDot)

            ref.isSelected = false;
            btnsArr.push( ref )
            innerDotsArr.push( innerDot)

            var selectDot = document.createElement("div")
            selectDot.className = "exdotGraphic"
            ref.appendChild( selectDot)
            selectDotsArr.push( selectDot)
            TweenLite.set( selectDot, { opacity:0})
            ref.id = i

            var iconDot = document.createElement("img")
            iconDot.src = images[i];
            //trace( images[i] + " images[i];")
            iconDot.onload = function(){
                
                view.appendChild( this)
                
                //trace( "loadeeds")
            }
            iconPosDots[i] = iconDot;
           
            iconDot.style.position ="absolute"
            iconDot.style.top = "-50px"
            iconDot.style.left = "0px"
            iconDot.style.pointerEvents = "none"
            var xBase = -27.4 + (29 *  multiplyers[i]);
            TweenLite.set( iconDot, {scale:.5 , x:xBase , y:-40, opacity:0, z:-.1})
            
           // ref.addEventListener( "mousedown" , shuttleToPosition )
        }

         view.appendChild( btnsArr[1] )
         view.appendChild( btnsArr[0] )
          view.appendChild( btnsArr[2] )
           view.appendChild( btnsArr[3] )
            view.appendChild( btnsArr[4] )
             view.appendChild( btnsArr[5] )
    }

   
    
    function init( features , func) 
    {
        functionReference = func
        featuresData = features;
        initDomPointers() 
        createDots()      
         addEventListeners();
        centerView ( null )
            
        TweenLite.set( entertext , { xPercent:-50 })
    }


    function shuttleToPosition( e )
    {
        var id = e.currentTarget.id 
        var btn = btnsArr[id]

        if( btn.isSelected == false ){
            functionReference( id  )
        
            setSelect( id )

        }
        

        btn.isSelected = true
        // DotLabelView.closeView()
    }

    function fadeOut(id){
        var iconDot = iconPosDots[id];
        TweenLite.to( iconDot, .5 , { opacity:0})
    }

    function setSelect( id ) {
         //trace( "set select id " + id)
      //  var length = 5 //featuresData.length;
        for( var i = 0 ; i < length ; i ++ ){
            var ref = innerDotsArr[i]
            var btn = btnsArr[i]

            var iconDot = iconPosDots[i];
            var select = selectDotsArr[i]

            if( i != id ) {
                btn.isSelected = false;
                TweenLite.to( ref ,.4 , { opacity:1 , scale:1})
                TweenLite.to( select ,.4 , { opacity:0 , scale:1})

                TweenLite.to( iconDot, .5 , { opacity:0})
            }else{
                 btn.isSelected = true
                 TweenLite.to(ref ,.4, { opacity:0, scale:1.4})
                 TweenLite.to( select ,.4 , { opacity:.8 , scale:1})
                  TweenLite.to( iconDot, .5 , { opacity:.5})
                  TweenLite.delayedCall(  5 ,fadeOut , [id])
            }

        }

        centerView();
    }

    function setMouse() {
       // var length = 5//featuresData.length;
        for( var i = 0 ; i < length ; i ++ ){
            var ref = btnsArr[i]
            ref.addEventListener( "mousedown" , shuttleToPosition )
            ref.addEventListener( "mouseenter" , mouseOverHandler )
            ref.addEventListener( "mouseleave" ,  mouseOutHandler )
            ref.style.cursor = "pointer"
        }
    }

    function setDevice() {
       // var length = 5//featuresData.length;
        for( var i = 0 ; i < length ; i ++ ){
            var ref = btnsArr[i]
            ref.removeEventListener( "mousedown" , shuttleToPosition )
            ref.removeEventListener( "mouseenter" , mouseOverHandler )
            ref.removeEventListener( "mouseleave" ,  mouseOutHandler )
            ref.style.cursor = "default"

        }
    }

    function mouseOverHandler( e ) {
        var id = e.currentTarget.id 
        DotLabelView.openView( id )
    }

    function mouseOutHandler( e ) {
        DotLabelView.closeView()
    }

    function setFullOpacity( id ) {
         var iconDot = iconPosDots[id];
        TweenLite.to( iconDot, .5 , { opacity:0})
    }

    


   function initDomPointers()
    {
        view = document.createElement("div")
        view.className = "exdotMenuWrapper"



        wrapper = document.getElementById( "wrapper")
        wrapper.appendChild( view )
        TweenLite.set( view , { opacity:0 })
        
        isTouch = hasTouch();

        DotLabelView.init();
        

    }

   

    
    
    return {

    	// public functions
        
        init: init,
        setSelect: setSelect,
        setFullOpacity: setFullOpacity,
        setMouse: setMouse,
        setDevice: setDevice,
        closeView: closeView,
        openView: openView
       
        // public vars

       
    };

})();
/* END FILE */
var DrawMaterialView = (function() {

	// Just so you can see what "this" refers to. It's the global window object.
	// Never attach anything to "this" because then it's a global var/method
	// and you start polluting the global namespace.
  

	// This pattern gives you closure privacy. This is self executing which
	// means you don't have to use the new operator but this is a static/singleton
	// class. Only one instance is created.

	// All methods are private. You don't have to worry about scoping or using
	// "this". If you were to //trace out "this", you would get an instance of
	// the global window object. Never use "this" within the module pattern.
	'use strict';

	var canvas = document.createElement( "canvas" )
	var ctx = canvas.getContext("2d");

	canvas.width = 1024;
	canvas.height = 1024;

	var images
   
	var showRenderCanvas = false
	
	
	var videoPhonePlaybackArr = []
	var myPhoneVideoScreenView
	var myPhoneVideoScreenView0

	var myPhoneVideoScreenView1

	//var myPhoneImageScreenView0

	var myPhoneVideoScreenView3
	//var myPhoneImageScreenView3
	var myPhoneImageScreenView4
	var myPhoneImageScreenView5

	var myPhoneImageScreenView7
	var myPhoneVideoScreenView8
	var myPhoneVideoScreenView9
	

	var videoBackGroundPlaybackArr = [];
	var myBackGroundVideoPlayer0 
	var myBackGroundVideoPlayer1;
	var myBackGroundVideoPlayer2;
	var myBackGroundVideoPlayer3;
	 var myBackGroundVideoPlayer4;
	var myBackGroundVideoPlayer5;
  
	var view = document.getElementById( "content-container" )
	var texture;

	

	var ambientAudioElement = document.getElementById( "js-mainAmbientLoop" )

	var volumeObject = {}

    volumeObject.volume = 0;



	var context = ctx;
	var devicePixelRatio = window.devicePixelRatio || 1

	var backingStoreRatio = context.webkitBackingStorePxelRatio ||
							context.mozBackingStorePixelRatio ||
							context.msBackingStorePixelRatio ||
							context.oBackingStorePixelRatio ||
							context.backingStorePixelRatio || 1

	var ratio = devicePixelRatio / backingStoreRatio;

	//trace( backingStoreRatio + " backingStoreRatio " );
	//trace( devicePixelRatio + " devicePixelRatio " );
	//trace( ratio + " devicePixelRatio " );
   // var toggleBtn = document.getElementById( "js-exVideoTextureToggle");
	//toggleBtn.addEventListener( "mousedown" , togglePlayHandler )

	var currentId = ""
	
	var isOpen = false
	function togglePlayHandler() {
		if( isOpen == false ){
			isOpen = true
		   // myPhoneVideoScreenView.openView();
		}else{
			isOpen = false
			//myPhoneVideoScreenView.closeView();
		}
	   
	}

   
	function openView()
	{
	   
		   
		   
	  


	}




	function openById( id , screenId){
		
		if(videoPhonePlaybackArr [ screenId ] )
		{
			currentId = id
			videoPhonePlaybackArr[screenId].openView();
		}

		if( videoBackGroundPlaybackArr[ id ] )
		{
			currentId = id
			videoBackGroundPlaybackArr[id].openView();

		}

		


		
	}



    function updateVolume( vol ){
    	//trace( "volumesssssssssss")


    		var backgroundLength = videoBackGroundPlaybackArr.length;

		   for( var i = 0; i <  backgroundLength ; i ++ ) {
				if( videoBackGroundPlaybackArr[i ]) {
					if( videoBackGroundPlaybackArr[i].isOpens() == true ) {
						videoBackGroundPlaybackArr[i].updateVolume( vol );
				   }
				}
		   }

		   var screenLength = videoPhonePlaybackArr.length;
			for( var i = 0; i <  screenLength ; i ++ ) {
				if( videoPhonePlaybackArr[i ]) {
					if( videoPhonePlaybackArr[i].isOpens() == true ) {
						videoPhonePlaybackArr[i].updateVolume( vol );
				   }
				}
	  		 }

	   
    }

    function updateVolumeAmbient( vol ){
    	TweenLite.to( volumeObject , .5 ,  { volume:vol , onUpdate:fadeVolumeHandler , delay:.1})
    }

     function fadeVolumeHandler() {
       
        ambientAudioElement.volume = volumeObject.volume;
        //trace( "booom that ambient audio is a fading ambientAudioElement.volume " + ambientAudioElement.volume)
        
    }

	function closeView( id ) {

		
	   
	   var backgroundLength = videoBackGroundPlaybackArr.length;

	   for( var i = 0; i <  backgroundLength ; i ++ ) {
			if( videoBackGroundPlaybackArr[i ]) {
				if( videoBackGroundPlaybackArr[i].isOpens() == true ) {
					videoBackGroundPlaybackArr[i].closeView();
			   }
			}
	   }

	   var screenLength = videoPhonePlaybackArr.length;
		for( var i = 0; i <  screenLength ; i ++ ) {
			if( videoPhonePlaybackArr[i ]) {
				if( videoPhonePlaybackArr[i].isOpens() == true ) {
					videoPhonePlaybackArr[i].closeView();
			   }
			}
	   }
	  
	}

	

	function addEventListeners()
	{
	   
	}

	function removeEventListeners()
	{
	   
	}

	function resizeViewport( event )
	{
		 
			
	}

	function centerView ( event )
	{
	  
	   
	   
	   

	}
	
   


   
	
	function init() 
	{
		var mapUrl = "models/obj/tex/screen_square.png";
		images = new Image()
		myPhoneVideoScreenView = new PhoneVideoScreenView();
		myPhoneVideoScreenView.init( 2 , ctx , images , "video" , true , .1)
		videoPhonePlaybackArr[2] = myPhoneVideoScreenView

		myPhoneVideoScreenView0 = new PhoneVideoScreenView();
		myPhoneVideoScreenView0.init( 0 , ctx , images , "video" , true, 10)
		videoPhonePlaybackArr[0] = myPhoneVideoScreenView0

		myPhoneVideoScreenView3 = new PhoneVideoScreenView();
		myPhoneVideoScreenView3.init( 3 , ctx , images ,  "video" , true , .1)
		videoPhonePlaybackArr[3] = myPhoneVideoScreenView3

		myPhoneImageScreenView4 = new PhoneVideoScreenView();
		myPhoneImageScreenView4.init( 4 , ctx , images ,  "video" , true , 6)
		videoPhonePlaybackArr[4] = myPhoneImageScreenView4

		myPhoneImageScreenView5 = new PhoneVideoScreenView();
		myPhoneImageScreenView5.init( 5 , ctx , images ,"video" , true, 4.5 )
		videoPhonePlaybackArr[5] = myPhoneImageScreenView5

		myPhoneVideoScreenView9 = new PhoneVideoScreenView();
		myPhoneVideoScreenView9.init( 9 , ctx , images ,"video" , true, .1 )
		videoPhonePlaybackArr[9] = myPhoneVideoScreenView9




		


		myPhoneImageScreenView7 = new PhoneImageScreenView();
		myPhoneImageScreenView7.init( 7 , ctx , images ,  "image" )
		videoPhonePlaybackArr[7] = myPhoneImageScreenView7

		myPhoneVideoScreenView8  = new PhoneVideoScreenView();
		myPhoneVideoScreenView8.init( 8 , ctx , images ,  "video" , true , 4.5)
		videoPhonePlaybackArr[8] = myPhoneVideoScreenView8


		myPhoneVideoScreenView1 = new PhoneImageScreenView();
		myPhoneVideoScreenView1.init( 1 , ctx , images  ,  "image" )
		videoPhonePlaybackArr[1] = myPhoneVideoScreenView1


		myBackGroundVideoPlayer0 = new BackGroundVideoPlayer()
		myBackGroundVideoPlayer0.init( 0 , true , 10 )
		videoBackGroundPlaybackArr[ 0 ] = myBackGroundVideoPlayer0;

		myBackGroundVideoPlayer1 = new BackGroundVideoPlayer()
		myBackGroundVideoPlayer1.init( 1 , true , .833 )
		videoBackGroundPlaybackArr[ 1 ] = myBackGroundVideoPlayer1;

		myBackGroundVideoPlayer2 = new BackGroundVideoPlayer()
		myBackGroundVideoPlayer2.init( 2 , true , .1 )
		myBackGroundVideoPlayer2.setHasVolume( false )
		videoBackGroundPlaybackArr[ 2 ] = myBackGroundVideoPlayer2;

		myBackGroundVideoPlayer5 = new BackGroundVideoPlayer()
		myBackGroundVideoPlayer5.init( 5 , true , 4.5)
		videoBackGroundPlaybackArr[ 5 ] = myBackGroundVideoPlayer5;

		myBackGroundVideoPlayer4 = new BackGroundVideoPlayer()
		myBackGroundVideoPlayer4.init( 4 , true , 0.1 )
		videoBackGroundPlaybackArr[ 4 ] = myBackGroundVideoPlayer4;

		myBackGroundVideoPlayer3 = new BackGroundVideoPlayer()
		myBackGroundVideoPlayer3.init(3 , true , .1 )
		videoBackGroundPlaybackArr[ 3 ] = myBackGroundVideoPlayer3;

		 

		//  myBackGroundVideoPlayer5
			//var ctx = canvas
		
		images.onload = function() {

			 //   //trace( "loaded images")

				canvas.width = 1024 //images.width
				canvas.height = 1024 //images.height
	
				ctx.drawImage( images, 0 , 0);
				
			   
			  
			}

		images.crossorigin="anonymous"
		images.src =  mapUrl
		if( showRenderCanvas == true ) {
			 view.appendChild( canvas )
			canvas.style.position = "absolute"
			canvas.className = "canvasPreview"
			TweenLite.set( canvas , { scale:.1 , transformOrigin:"0 0" })
		}
	   
		
	}

	function renderOn() {
		texture.needsUpdate = true;
	}

	function renderOff() {
		//texture.needsUpdate = false;

		//trace( texture.needsUpdate + ' texture.needsUpdate')
	}



	function getCanvas() {
		return canvas;
	}

	function setTexture( texture_ ) {
		texture = texture_


		myPhoneVideoScreenView.setTexture( texture )
		myPhoneVideoScreenView0.setTexture( texture )
		myPhoneVideoScreenView1.setTexture( texture )
		myPhoneVideoScreenView3.setTexture( texture )
		myPhoneImageScreenView4.setTexture( texture )
		myPhoneImageScreenView5.setTexture( texture )
		myPhoneImageScreenView7.setTexture( texture )
		myPhoneVideoScreenView8.setTexture( texture )
		myPhoneVideoScreenView9.setTexture( texture )
	   //  myBackGroundVideoPlayer5.setTexture( texture )
		
	}




   function initDomPointers()
	{
		view = document.createElement("div")
	   
		

	}

   

	
	
	return {

		// public functions
		
		init: init,
		setTexture: setTexture,
		getCanvas:getCanvas,
		openById: openById,
		closeView: closeView,
		renderOn: renderOn,
		updateVolume: updateVolume,
		updateVolumeAmbient: updateVolumeAmbient,
		renderOff: renderOff

	   
	   
		// public vars

	   
	};

})();/* END FILE */
var DotLabelView = (function() {

    // Just so you can see what "this" refers to. It's the global window object.
    // Never attach anything to "this" because then it's a global var/method
    // and you start polluting the global namespace.
  

    // This pattern gives you closure privacy. This is self executing which
    // means you don't have to use the new operator but this is a static/singleton
    // class. Only one instance is created.

    // All methods are private. You don't have to worry about scoping or using
    // "this". If you were to //trace out "this", you would get an instance of
    // the global window object. Never use "this" within the module pattern.
    'use strict';

    var isOpen = false;
    var currentId = 666;

    var view;

    var textLabelsArr = []

    function openView( id )
    {
       
                centerView( null )
            //if( isOpen  == false ) {
                isOpen = true

                 for( var i = 0 ; i < 6 ; i ++ ){
                     TweenLite.set( textLabelsArr[i] , {  opacity:0 })

                }


                 TweenLite.set( textLabelsArr[id] , {  opacity:1 })
                 TweenLite.killTweensOf( view  )
                TweenLite.to( view , 0 , { opacity:0 })
                TweenLite.to( view , .4 , { opacity:1 , delay:.2})
                //view.innerHTML = features[id].btnDesc
           // }
            //setText
        
           
      


    }

   

    function closeView() {
       // //trace( "close dat view")
       // if( isOpen  == true ) {
            isOpen = false
            currentId = 666;
            TweenLite.killTweensOf( view  )
            TweenLite.to( view , .1 , { opacity:0 , onComplete: clearDatText   })
      //  }
       

    }

    function clearDatText() {
        //view.innerHTML = ""
    }

    

    function addEventListeners()
    {
       
    }

    function removeEventListeners()
    {
       
    }

    function resizeViewport( event )
    {
         
            
    }

    function centerView ( event )
    {
        var parentHeight = Math.max(650, window.innerHeight);
       view.style.top =  Math.round((parentHeight)- (view.clientHeight) -85) +"px"
       
       

    }

    


   
    
    function init() 
    {
        initDomPointers()
        
    }

    



   function initDomPointers()
    {
        view = document.getElementById( "js-exDotTextLabelView")
        view.className = "exDotTextLabelView"

        for( var i = 0 ; i < 6 ; i ++ ){
            textLabelsArr[i] = document.getElementById( "js-exImageTagLables" +i);
             TweenLite.set( textLabelsArr[i] , { xPercent:-50 , opacity:0 })

        }
        //TweenLite.set( "exImageTagLables" , { xPercent:-50 })

        
       // view.innerHTML = ""

    }

   

    
    
    return {

    	// public functions
        
        init: init,
        centerView: centerView,
        openView:openView,
        closeView:closeView


       
       
        // public vars

       
    };

})();/* END FILE */
var CheckRange = (function() {

    // Just so you can see what "this" refers to. It's the global window object.
    // Never attach anything to "this" because then it's a global var/method
    // and you start polluting the global namespace.
  

    // This pattern gives you closure privacy. This is self executing which
    // means you don't have to use the new operator but this is a static/singleton
    // class. Only one instance is created.

    // All methods are private. You don't have to worry about scoping or using
    // "this". If you were to //trace out "this", you would get an instance of
    // the global window object. Never use "this" within the module pattern.
    'use strict';

    var checkRangeUpdateById;
    var nullRange;

    function openView( id )
    {
       
       
           
      


    }

   

    function closeView() {

        
       

    }

   
    

    function addEventListeners()
    {
       
    }

    function removeEventListeners()
    {
       
    }

    function resizeViewport( event )
    {
         
            
    }



    function setFuctionPointers( checkRangeUpdateById_, nullRange_) {
        checkRangeUpdateById = checkRangeUpdateById_;
        nullRange = nullRange_
    }
    

    

    function checkRangeByPhoneMesh( phoneModel ) {
        var model = phoneModel;
           
            var rotationX = model.rotation.x;
            var rotationY = model.rotation.y;
            var rotationZ = model.rotation.z;

           // //trace( phoneModel.rotation.x + ":x  " + phoneModel.rotation.y + ":y  " + phoneModel.rotation.z + ":z  ")
             if( rotationX <  0.5 && rotationX >  -0.5 && model.rotation.y > -.9 && model.rotation.y < .9 && model.rotation.z > -.3 && model.rotation.z < .3  ){
                               // //trace( "Oh snap facingforward")
                                checkRangeUpdateById( 0 )
                               
          
             }else if( rotationX <  0.8 && rotationX >  -.8 && model.rotation.y > -.85 && model.rotation.y < .85 && model.rotation.z > 1.2 && model.rotation.z < 1.7  ){
                              //  //trace( "So real its unreal id 1 screen side ways")
                                checkRangeUpdateById( 1 )
          
             }else if( rotationX <  0.8 && rotationX >  -.8 && model.rotation.y > -.85 && model.rotation.y < .85 && model.rotation.z < - 1.2 && model.rotation.z >  -1.7  ){
                               // //trace( "So real its unreal id 1 screen side ways versiopn 2")
                                checkRangeUpdateById( 7 )
          
             }else if( rotationX >  1 && rotationX <  2.4 && model.rotation.y > -.2 && model.rotation.y < .2 && model.rotation.z < 2.5 && model.rotation.z > .5  ){ 
                               // //trace( "on side")
                               checkRangeUpdateById( 2 )

             }else if( rotationX >  1 && rotationX <  2.4 && model.rotation.y > -.2 && model.rotation.y < .2 && model.rotation.z > -2 && model.rotation.z < -.8  ){ 
                               // //trace( "on side  2")
                               checkRangeUpdateById( 6 )

             }else if(rotationX >   -1.4 && rotationX <  -.65 && model.rotation.y > -.45 && model.rotation.y < .85 && model.rotation.z > -.05 && model.rotation.z < .4  ){
                               // //trace( "charging")
                                checkRangeUpdateById( 3 )

             }else if( rotationX >   -2 && rotationX <  -.6 && model.rotation.y > -.4 && model.rotation.y < .03 && model.rotation.z > -1.5 && model.rotation.z < -.2  ){
                              //  //trace( "wire less charging")
                            
                                checkRangeUpdateById( 4 )

             }else if(rotationX >   -2 && rotationX <  -.5 && model.rotation.y > -.3 && model.rotation.y < .3 && model.rotation.z > .8 && model.rotation.z < 2.8  ){
                               // //trace( "sunset stuffs")
                               checkRangeUpdateById( 5 )
             }else if(rotationX >   -2 && rotationX <  -.5 && model.rotation.y > -.3 && model.rotation.y < .3 && model.rotation.z < -.8 && model.rotation.z > -2.8  ){
                               // //trace( "sunset stuffs side 2")
                               checkRangeUpdateById( 8 )
             }else{

                nullRange()
               // //trace( "npes")
             }

    }

    function checkRangeByPhoneMesh2( phoneModel ) {
        var model = phoneModel;
           
         //   var rotationX = model.rotation.x;
          //  var rotationY = model.rotation.y;
          //  var rotationZ = model.rotation.z;

         // //trace( phoneModel.rotation.x + ":x  " + phoneModel.rotation.y + ":y  " + phoneModel.rotation.z + ":z  ")
             if( model.rotation.x <  2 && model.rotation.x >  .8 && model.rotation.y > -1 && model.rotation.y < 1 && model.rotation.z > -.6 && model.rotation.z < .6  ){
                                //trace( "Oh snap facingforward")
                                checkRangeUpdateById( 0 )
                               
          
             }else if( model.rotation.x <  2 && model.rotation.x >  1 && model.rotation.y > -.8 && model.rotation.y < .8 && model.rotation.z > 1.2 && model.rotation.z < 1.8 ){
                                //trace( "So real its unreal id 1")
                                checkRangeUpdateById( 1 )
          
             }else if( model.rotation.x <  2.2 && model.rotation.x >  .7 && model.rotation.y > -.8 && model.rotation.y < .8 && model.rotation.z < -1.2 && model.rotation.z > -1.8 ){
                                //trace( "So real its unreal id side 222")
                                checkRangeUpdateById( 7 )
          
             }else if( model.rotation.x >  2.6 && model.rotation.x < 3.2 && model.rotation.y > -.3 && model.rotation.y < .3 && model.rotation.z < 2 && model.rotation.z > .8  ){ 
                                //trace( "on side")
                               checkRangeUpdateById( 2 )

             }else if( model.rotation.x >  -3.2 && model.rotation.x < -2.8 && model.rotation.y > -.3 && model.rotation.y < .3 && model.rotation.z < 2 && model.rotation.z > .8  ){ 
                                //trace( "on side")
                               checkRangeUpdateById( 2 )

             }else if( model.rotation.x >  2.6 && model.rotation.x < 3.2 && model.rotation.y > -.3 && model.rotation.y < .3 && model.rotation.z > -2 && model.rotation.z < -.8  ){ 
                                //trace( "reversise  side dual range on side")
                               checkRangeUpdateById( 6 )

             }else if( model.rotation.x > -3.2 && model.rotation.x < -2.8 && model.rotation.y > -.3 && model.rotation.y < .3 && model.rotation.z > -2 && model.rotation.z < -.8 ){ 
                                //trace( "reversise  side dual range on side id 66")
                               checkRangeUpdateById( 6 )

             }else if( model.rotation.x <  .65 && model.rotation.x >  0 && model.rotation.y > -.55 && model.rotation.y < .55 && model.rotation.z > -.1 && model.rotation.z < .5  ){
                                //trace( "charging")
                                checkRangeUpdateById( 3 )

             }else if( model.rotation.x <  .35 && model.rotation.x >  0 && model.rotation.y > -.55 && model.rotation.y < .55 && model.rotation.z > -1 && model.rotation.z < -.2  ){
                                //trace( "wire less charging")
                                 checkRangeUpdateById( 4 )

             }else if( model.rotation.x >   0 && model.rotation.x <  .6 && model.rotation.y > -.3 && model.rotation.y < .3 && model.rotation.z > 1 && model.rotation.z < 2  ){
                                //trace( "sunset stuffs")
                                checkRangeUpdateById( 5 )

             }else if( model.rotation.x >   -.2 && model.rotation.x <  .5 && model.rotation.y > -.3 && model.rotation.y < .3 && model.rotation.z < -1 && model.rotation.z > -2  ){
                                //trace( "sunset stuffs 2222")
                                checkRangeUpdateById( 8 )

             }/*else if(model.rotation.x >   -2 && model.rotation.x <  -.5 && model.rotation.y > -.3 && model.rotation.y < .3 && model.rotation.z > .8 && model.rotation.z < 2.8  ){
                                //trace( "sunset stuffs")
                               checkRangeUpdateById( 5 )
             }*/else{

                nullRange()
               // //trace( "npes")
             }

    }
   
    
    function init() 
    {
        initDomPointers()
        
    }

    



   function initDomPointers()
    {
        

    }

   

    
    
    return {

    	// public functions
        
        init: init,
        openView:openView,
        closeView:closeView,
        checkRangeByPhoneMesh: checkRangeByPhoneMesh,
        checkRangeByPhoneMesh2: checkRangeByPhoneMesh2,
        setFuctionPointers: setFuctionPointers


       
       
        // public vars

       
    };

})();