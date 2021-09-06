import Blockly from 'blockly/core';

import {Color} from "../lib/constant";

export default function setWidgetBlocks() {
    Blockly.Blocks['widget'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([["이미지","image"], ["버튼","button"], ["텍스트","text"]]), "widget_type")
                .appendField("위젯");
            this.appendDummyInput()
                .appendField("ID : ")
                .appendField(new Blockly.FieldTextInput("widget_id"), "widget_id");
            this.appendDummyInput()
                .appendField("내용 : ")
                .appendField(new Blockly.FieldTextInput("default"), "widget_content");
            this.setPreviousStatement(true, "widget");
            this.setNextStatement(true, "widget");
            this.setColour(290);
            this.setTooltip("");
            this.setHelpUrl("");
        }
    };

    Blockly.JavaScript['widget'] = function(block) {
        let dropdown_widget_type = block.getFieldValue('widget_type');
        let text_widget_id = block.getFieldValue('widget_id');
        let text_widget_content = block.getFieldValue('widget_content');
        // TODO: Assemble JavaScript into code variable.
        return `<div id="${text_widget_id}" class="widget widget-${dropdown_widget_type}">${text_widget_content}</div>`;
    };
}