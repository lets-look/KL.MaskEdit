define("KlMaskEdit", ["KlMaskEditResources", "KlInputMask"], function (resources) {
    Ext.define("Terrasoft.controls.KL.MaskEdit", {
        extend: "Terrasoft.TextEdit",
        alternateClassName: "Terrasoft.KL.MaskEdit",

        /**
         * Mask configuration
         * See docs https://github.com/RobinHerbots/Inputmask
         */
        maskConfig: {},

        /**
         * Can save page with invalid value
         */
        canSaveInvalidValue: false,

        /**
         * Message with an invalid value
         */
        invalidMessage: "",

        /**
         * @inheritdoc Terrasoft.controls.Component#initDomEvents
         * @override
         */
        initDomEvents: function () {
            this.callParent(arguments);
            this.setMaskConfig(this.maskConfig);
        },

        /**
         * @inheritdoc Terrasoft.Bindable#subscribeForEvents
         * @override
         */
        subscribeForEvents: function(binding, property, model) {
            this.callParent(arguments);
            if (property === "value" && model.canValidate) {
                var modelColumns = model.columns || [],
                    columnName = binding.modelItem,
                    column = modelColumns[columnName];
                if (column && !!model.validationConfig && !this.canSaveInvalidValue) {
                    var validationConfig = model.validationConfig[columnName] || [];
                    validationConfig.push(this.validate.bind(this));
                    model.validationConfig[columnName] = validationConfig;
                }
            }
        },

        /**
         * @inheritdoc Terrasoft.BaseEdit#changeValue
         * @override
         */
        changeValue: function (value) {
            this.validate(value);
            return this.callParent(arguments);
        },

        /**
         * @inheritdoc Terrasoft.Component#getBindConfig
         * @overriden
         */
        getBindConfig: function() {
            var bindConfig = this.callParent(arguments),
                multiMaskEditBindConfig = {
                    maskConfig: {
                        changeMethod: "setMaskConfig"
                    },
                    invalidMessage: {
                        changeMethod: "setInvalidMessage"
                    }
                };
            Ext.apply(bindConfig, multiMaskEditBindConfig);
            return bindConfig;
        },

        /**
         * Set mask configuration
         * @param value
         */
        setMaskConfig: function(value) {
            this.maskConfig = value;
            /*jshint ignore:start*/
            var el = this.getEl();
            if (el) {
                if (Ext.isEmpty(value)) {
                    Inputmask.remove(el.dom);
                }
                else {
                    Inputmask(this.maskConfig).mask(el.dom);
                }
            }
            /*jshint ignore:end*/
            this.validate(this.getValue());
        },

        /**
         * Validate value of edit
         * @param value
         * @returns {{invalidMessage: string, isValid: boolean}}
         */
        validate: function (value) {
            var validationInfo = {
                isValid: true,
                invalidMessage: ""
            };
            if (!Ext.isEmpty(this.maskConfig)) {
                if (!Ext.isEmpty(value)) {
                    /*jshint ignore:start*/
                    validationInfo.isValid = Inputmask.isValid(value, this.maskConfig);
                    /*jshint ignore:end*/
                    if (!validationInfo.isValid) {
                        validationInfo.invalidMessage = this.invalidMessage ||
                            resources.localizableStrings.DefaultInvalidMessage;
                    }
                }
                this.setValidationInfo(validationInfo);
            }
            return validationInfo;
        },

        /**
         * Set mask invalid message
         * @param value
         */
        setInvalidMessage: function (value) {
            this.invalidMessage = value
        }
    });

    return Terrasoft.KL.MaskEdit;
});