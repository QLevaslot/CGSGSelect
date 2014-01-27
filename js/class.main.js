var CGMain = CGSGView.extend(
    {
        initialize : function(canvas) {
            this._super(canvas);

            ////// INITIALIZATION /////////
            this.initializeCanvas();
            this.createScene();

            this.startPlaying();
        },

        initializeCanvas : function() {
            //redimensionnement du canvas pour être full viewport en largeur
            this.viewDimension = cgsgGetRealViewportDimension();
            this.setCanvasDimension(this.viewDimension);
        },

        /**
         * create example
         *
         */
        createScene : function() {
            //create a first root node.
            this.rootNode = new CGSGNode(0, 0);
            CGSG.sceneGraph.addNode(this.rootNode, null);

            var val1 = {"key":"moins de 60cm", "value":"-60"},
                val2 = {"key":"120cm", "value":"120"},
                val3 = {"key":"180cm", "value":"180"},
                val4 = {"key":"210cm", "value":"210"};

            var myValues = [val1, val2, val3];

            this.selectTest = new CGSGNodeSelect(400, 200, 200, 20, myValues, "key", "value");
            this.rootNode.addChild(this.selectTest, null);

            this.selectTest.setSelectedValue("120");

            this.selectTest.onSwitchValueChanged = function (event) {
                console.log(event);
            }

            //Text log to preview selection change
            this.textNode = new CGSGNodeText(400, 20, "Value : "+this.selectTest.getSelectedValue());
            this.textNode.setSize(10);
            this.rootNode.addChild(this.textNode, null);
            var that = this;
            this.selectTest.onSelectedValueChanged = function (event) {
                console.log(event);
                that.textNode.setText("Value : "+that.selectTest.getSelectedValue());
            }
            var myValues = [val2, val3, val4];
            this.selectTest.setValues(myValues);
        }
    }
);