#### Install
```shell
cd [Path to the root website directory]\Terrasoft.WebApp\Terrasoft.Configuration\Pkg\
git clone https://github.com/lets-look/KL.MaskEdit.git KL.MaskEdit
```

#### Using
[Documentation](https://github.com/RobinHerbots/Inputmask)

Additional parameters:
  * `canSaveInvalidValue` - the ability to save with an invalid value (false by default)
  * `invalidMessage` - invalid value message

```javascript
define("AccountPageV2", ["KlMaskEdit"],
    function() {
        return {
            entitySchemaName: "Account",
            attributes: {},
            mixins: {},
            details: {},
            diff: /**SCHEMA_DIFF*/[
                {
                    "operation": "merge",
                    "name": "Code",
                    "values": {
                        "controlConfig": {
                            "className": "Terrasoft.KL.MaskEdit",
                            "maskConfig": {
                                "bindTo": "CodeMaskValue"
                            }
                        }
                    }
                }
            ]/**SCHEMA_DIFF*/,
            methods: {
                onEntityInitialized: function () {
                    this.callParent(arguments);
                    this.set("CodeMaskValue", {
                        mask: "9[-9999]",
                        greedy: false
                    });
                }
            }
        };
    }
);
```