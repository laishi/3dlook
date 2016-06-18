pc.script.create('blobs', function (app) {
    // Creates a new Blobs instance
    var Blobs = function (entity) {
        this.entity = entity;
    };
    
    var vecA = new pc.Vec3();
    var vecB = new pc.Vec3(0, 0, 1);

    Blobs.prototype = {
        initialize: function () {
            var self = this;
            var i;
            this.list = [ ];
            
            vecA.set(0, 1, 0);
            
            this.material = new pc.BasicMaterial();
            this.material.updateShader = function(device) {
                this.shader = new pc.Shader(device, {
                    attributes: {
                        vertex_position: 'POSITION'
                    },
                    vshader: ' \
                        attribute vec3 vertex_position;\n \
                        uniform mat4 matrix_model;\n \
                        uniform mat4 matrix_projection;\n \
                        uniform mat4 matrix_view;\n \
                        uniform mat3 matrix_normal;\n \
                        uniform float scale;\n \
                        varying vec2 vUv0;\n \
                        void main(void)\n \
                        {\n \
                            vec3 normal = normalize(matrix_normal * vec3(0, 1, 0));\n \
                            float d = max(0.0, (dot(vec3(matrix_view[0][2], matrix_view[1][2], matrix_view[2][2]), normal) - 0.35) * (1.0 / (1.0 - 0.35)));\n \
                            mat4 modelMatrix = matrix_view * matrix_model;\n \
                            modelMatrix[0][0] = 1.0;\n \
                            modelMatrix[0][1] = 0.0;\n \
                            modelMatrix[0][2] = 0.0;\n \
                            modelMatrix[1][0] = 0.0;\n \
                            modelMatrix[1][1] = 1.0;\n \
                            modelMatrix[1][2] = 0.0;\n \
                            modelMatrix[2][0] = 0.0;\n \
                            modelMatrix[2][1] = 0.0;\n \
                            modelMatrix[2][2] = 1.0;\n \
                            vec4 positionW = modelMatrix * vec4(vertex_position * scale * d, 1.0);\n \
                            gl_Position = matrix_projection * positionW;\n \
                            vUv0 = vertex_position.xy + vec2(0.5);\n \
                            vUv0.y = 1.0 - vUv0.y;\n \
                        }\n',
                    fshader: ' \
                        precision highp float;\n \
                        varying vec2 vUv0;\n \
                        uniform float opacity;\n \
                        uniform sampler2D texture_diffuseMap;\n \
                        void main(void)\n \
                        {\n \
                            vec3 diffuse = texture2D(texture_diffuseMap, vUv0).rgb;\n \
                            if (diffuse.r * opacity < 0.001) discard;\n \
                            gl_FragColor = vec4(diffuse * opacity, 1.0);\n \
                        }\n'
                });
            };
            this.material.depthTest = false;
            this.material.depthWrite = false;
            this.material.blend = true;
            this.material.blendSrc = 1;
            this.material.blendDst = 1;
            this.material.update();
            
            var positions = [ -0.5, 0.5, 0, 0.5, 0.5, 0, 0.5, -0.5, 0, -0.5, -0.5, 0 ];
            var indices = [ 2, 1, 0, 0, 3, 2 ];
            var vertexFormat = new pc.VertexFormat(app.graphicsDevice, [
                { semantic: pc.SEMANTIC_POSITION, components: 3, type: pc.ELEMENTTYPE_FLOAT32 }
            ]);
            var vertexBuffer = new pc.VertexBuffer(app.graphicsDevice, vertexFormat, positions.length / 3);
            var iterator = new pc.VertexIterator(vertexBuffer);
            for (i = 0; i < positions.length / 3; i++) {
                iterator.element[pc.SEMANTIC_POSITION].set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
                iterator.next();
            }
            iterator.end();
            var indexBuffer = new pc.IndexBuffer(app.graphicsDevice, pc.INDEXFORMAT_UINT16, indices.length);
            var dst = new Uint16Array(indexBuffer.lock());
            dst.set(indices);
            indexBuffer.unlock();
            
            var mesh = new pc.Mesh();
            mesh.vertexBuffer = vertexBuffer;
            mesh.indexBuffer[0] = indexBuffer;
            mesh.primitive[0].type = pc.PRIMITIVE_TRIANGLES;
            mesh.primitive[0].base = 0;
            mesh.primitive[0].count = indices.length;
            mesh.primitive[0].indexed = true;
            
            var node = new pc.GraphNode();
            
            var meshInstance = new pc.MeshInstance(node, mesh, this.material);
            meshInstance.updateKey();

            var model = new pc.Model();
            model.graph = node;
            model.meshInstances = [ meshInstance ];
            
            var processEntity = function(entity) {
                if (entity.script && entity.script.blob) {
                    self.list.push(entity);
                    entity.model.model = model.clone();
                }
                var children = entity.getChildren();
                for(var i = 0; i < children.length; i++) {
                    processEntity(children[i]);
                }
            };
            
            processEntity(this.entity);
            this.camera = app.root.findByName('camera-demo');
            
            this.last = Date.now();
            this.frequency = 50;
        },

        update: function (dt) {
        }
    };

    return Blobs;
});