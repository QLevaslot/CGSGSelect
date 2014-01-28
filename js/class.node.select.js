/**
 * Created with IntelliJ IDEA.
 * User: qlevaslo
 * Date: 21/01/14
 * Time: 16:21
 */
cgsgEventTypes.ON_SELECTED_VALUE_CHANGED = "onSelectedValueChanged";

/**
 * This class represents a select option.
 * @class CGSGSelect
 * @module Node
 * @extends CGSGNodeDomElement
 * @constructor
 * @param {Number} x Relative position on X
 * @param {Number} y Relative position on Y
 * @param {Number} width Relative dimension
 * @param {Number} height Relative Dimension
 * @param {Array of Collection} array of collections with key and value
 * @param {String} name of the key parameter (text appearing in select box as option)
 * @param {String} name of the value parameter (value of the option)
 * @type {CGSGNodeSelect}
 */
var CGSGNodeSelect = CGSGNodeDomElement.extend(
    {
        initialize : function (x, y, width, height, values, getKey, getValue) {
            this._super(x, y, width, height, document.createElement("select"));

            // parent of select is a div, to allow further customisation
            this._htmlParentElement = document.createElement("div");

            this.resizeTo(CGSGMath.fixedPoint(width), CGSGMath.fixedPoint(height));
            this.isDraggable = true;

            this.width = width;
            this.height = height;

            /**
             * Select customization
             */
            this.arrowURL = null;
            this.color = "White";
            this.fontColor = "Black";

            /**
             * @property classType
             * @type {String}
             */
            this.classType = "CGSGNodeSelect";

            /**
             * Values of the web page
             * @property _values
             * @type {String}
             * @private
             */
            this._values = values;

            this.getKey = getKey;
            this.getValue = getValue;

            /**
             * Value selected
             * @property _selectedValue
             * @private
             * @type {String}
             */
            this._selectedValue = null;

            /**
             * Initialisation of the container
             */
            this._createContainer();
            this._initContainer();

            /**
             * Handle event when changing selected value
             * @property ON_SELECTED_VALUE_CHANGED
             * @default null
             * @type {Function}
             */
            this.onSelectedValueChanged = null;

        },

        /**
         * Initialize and add the deployed container to the HTML body
         * @method _initContainer
         * @private
         */
        _initContainer : function () {
            if (!cgsgExist(this._htmlElement)) {
                this._createContainer();
            }
            document.body.appendChild(this._htmlParentElement);
            this._htmlParentElement.appendChild(this._htmlElement);
            this.updateRender();
        },

        /**
         * Create a select tag in the _container property
         * @method _createContainer
         * @private
         */
        _createContainer : function () {
            var values = [];
            if (cgsgExist(this._values)) {
                values = this._values;
            }

            var onClickStartHandler = function (event) {
                if ( cgsgExist(this.onSelectedValueChanged)) {
                    this._selectedValue =  this._htmlElement.value;
                    CGSG.eventManager.dispatch(this, cgsgEventTypes.ON_SELECTED_VALUE_CHANGED, new CGSGEvent(this, null));
                };
            }.bind(this);

            this._htmlElement.onchange = onClickStartHandler;

            if(values.length > 0){
                for(var i = 0; i < values.length; i++){
                    var option = document.createElement("option");

                    option.value = values[i][this.getValue];
                    option.text = values[i][this.getKey];
                    this._htmlElement.add(option);
                }
                if(this._selectedValue != null){
                    this._htmlElement.value = this._selectedValue;
                } else {
                    this._selectedValue != values[0][this.getValue];
                }
            }
        },

        updateRender : function (){

            if (cgsgExist(this._htmlParentElement) && cgsgExist(this._htmlElement)) {

                // Custom Div containing select
                this._htmlParentElement.style.position = "absolute";
                this._htmlParentElement.style.overflow = "hidden";
                this._htmlParentElement.style.border = "1px solid #ccc"
                this._htmlParentElement.style.left = (this.getAbsoluteLeft()) + "px";
                this._htmlParentElement.style.top = (this.getAbsoluteTop()) + "px";
                this._htmlParentElement.style.width = (this.getAbsoluteWidth()) + "px";
                this._htmlParentElement.style.height = (this.getAbsoluteHeight()) + "px";

                // Custom Select
                this._htmlElement.style.position = "";
                this._htmlElement.style.fontSize = (this.height - 30/100*this.height) +"px";
                this._htmlElement.style.color = this.fontColor;
                //Those properties should rather be modified in parent div for uniformity
                this._htmlElement.style.border = "none";
                this._htmlElement.style.backgroundColor = "transparent";

                this._htmlElement.style.height = (this.getAbsoluteHeight()-4) + "px";

                // Handle Custom Arrows
                if(this.arrowURL !== null){
                    this._htmlParentElement.style.background = "url("+this.arrowURL+") no-repeat right ";
                    this._htmlElement.style.width = (this.getAbsoluteWidth() + 20 ) + "px";
                } else {
                    this._htmlElement.style.width = (this.getAbsoluteWidth()) + "px";
                }
                //Background color comes after background, to avoid property overlap
                this._htmlParentElement.style.backgroundColor = this.color;

            }
        },

        /**
         * Set new values INSTEAD of the old ones
         * @method setValues
         * @param {String Array} values
         */
        setValues : function (values) {
            this._values = values;

            if (cgsgExist(this._htmlElement)) {
                this.reset();
            }
        },

        /**
         * Get a String representing the Values
         * @method getValues
         * @return {String Array}
         */
        getValues : function () {
            return this._values;
        },

        /**
         * @method setSelectedValue
         * @param {String} selected value
         */
        setSelectedValue : function (value) {
            this._selectedValue = value;
            if (cgsgExist(this._htmlElement)) {
                this._htmlElement.value = value;
            }
        },

        /**
         * Get a String representing the Values
         * @method getValues
         * @return {string}
         */
        getSelectedValue : function () {
            return this._selectedValue;
        },

        /**
         * @protected
         * @method render
         * Custom rendering
         * */
        render : function (context) {
            context.fillStyle = this.color;
            //we draw the rect at (0,0) because we have already translated the context to the correct position
            context.fillRect(0, 0, this.dimension.width, this.dimension.height);




        },

        /**
         * Reset the memory taken by this node
         * @method reset
         */
        reset : function () {
            if (cgsgExist(this._htmlElement)) {
                this._htmlElement.innerHTML = '';
                this._createContainer();
            }
        }
    }
);