import Blockly from 'blockly/core';

export default function setContainerBlocks() {
    let container_mutator = {
        mutationToDom: function () {
            console.log('mutationToDom');
            let container = document.createElement('mutation');
            return container;
        },
        domToMutation: function (xmlElement) {
            console.log('domToMutation');
            let test = xmlElement.getAttribute('test');
        },
        decompose: function (workspace) {
            console.log('decompose');
            let topBlock = workspace.newBlock('widget_container');
            topBlock.initSvg();
            if (this.mutatorSave === undefined) this.mutatorSave = [];
            console.log(topBlock.getInput('container_class').connection);
            // for (let i of this.mutatorSave) {
            //     let tempBlock = workspace.newBlock(`container_w_class`);
            //     tempBlock.initSvg();
            //     console.log(tempBlock.getConnections_());
            //     topBlock.getFirstStatementConnection().connect(tempBlock.getConnections_()[0]);
            // }
            let tempBlock = workspace.newBlock(`container_w_class`);
            tempBlock.initSvg();
            console.log(tempBlock.getConnections_());
            topBlock.getFirstStatementConnection().connect(tempBlock.getConnections_()[0]);
            return topBlock;
        },
        compose: function (containerBlock) {
            console.log('compose');
            let innerBlocks = Blockly.JavaScript.statementToCode(containerBlock, 'container_class').trim().split(" ");
            console.log(innerBlocks);
            this.mutatorSave = innerBlocks;
        },
        saveConnection: function (containerBlock) {
            console.log('saveConnection');
        }
    }

    Blockly.Blocks['container'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([["수평","horizontal"], ["수직","vertical"]]), "container_type")
                .appendField("컨테이너");
            // this.appendDummyInput()
            //     .appendField("ID : ")
            //     .appendField(new Blockly.FieldTextInput("container_id"), "containerID");
            this.appendDummyInput()
                .appendField("Class : ")
                .appendField(new Blockly.FieldTextInput("container"), "containerClass");
            this.appendStatementInput("content")
                .setCheck(null)
                .setAlign(Blockly.ALIGN_CENTRE);
            this.appendValueInput("css")
                .setCheck("CSS_EXTEND")
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField("CSS");
            this.setInputsInline(false);
            this.setPreviousStatement(true, "container");
            this.setNextStatement(true, "container");
            this.jsonInit({'mutator':'container_mutator'});
            this.setColour(120);
            this.setTooltip("컨테이너를 생성합니다.");
            this.setHelpUrl("");
        }
    };

    Blockly.Blocks['widget_container'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("컨테이너");
            this.appendStatementInput("container_class")
                .setCheck("container_parameter");
            this.setColour(120);
            this.setTooltip("");
            this.setHelpUrl("");
        }
    };

    Blockly.Blocks['container_w_class'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Class");
            this.setPreviousStatement(true, "container_parameter");
            this.setNextStatement(true, "container_parameter");
            this.setColour(120);
            this.setTooltip("");
            this.setHelpUrl("");
        }
    };

    Blockly.Blocks['container_w_css'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Css");
            this.setPreviousStatement(true, "container_parameter");
            this.setNextStatement(true, "container_parameter");
            this.setColour(330);
            this.setTooltip("");
            this.setHelpUrl("");
        }
    };

    console.log(Blockly.JavaScript);


    Blockly.JavaScript['container'] = function(block) {
        let dropdown_container_type = block.getFieldValue('container_type');
        let text_containerid = block.getFieldValue('containerID');
        let text_containerclass = block.getFieldValue('containerClass');
        let statements_content = Blockly.JavaScript.statementToCode(block, 'content');
        let value_css = Blockly.JavaScript.valueToCode(block, 'css', Blockly.JavaScript.ORDER_ATOMIC);
        return `<div id="${text_containerid}" class="container container-${dropdown_container_type} ${text_containerclass}">${statements_content}</div>`;
    };

    Blockly.JavaScript['container_w_class'] = function(block) {
        return `w_class `;
    };
    Blockly.JavaScript['container_w_css'] = function(block) {
        return `w_css `;
    };

    Blockly.Extensions.registerMutator('container_mutator', container_mutator, null, ['container_w_class', 'container_w_css']);
}