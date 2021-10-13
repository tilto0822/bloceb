import Blockly from 'blockly/core';

import {Color} from "../lib/constant";

export default function setWrapperBlocks() {
    Blockly.Blocks['header_wrapper'] = {
        init: function() {
            this.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField("헤더");
            this.appendStatementInput("content")
                .setCheck(null)
                .setAlign(Blockly.ALIGN_CENTRE);
            this.appendValueInput("css")
                .setCheck("CSS_EXTEND")
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField("CSS");
            this.setInputsInline(false);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(120);
            this.setTooltip("헤더를 생성합니다.");
            this.setHelpUrl("");
        }
    };

    Blockly.Blocks['sidebar_wrapper'] = {
        init: function() {
            this.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField("사이드바");
            this.appendStatementInput("content")
                .setCheck(null)
                .setAlign(Blockly.ALIGN_CENTRE);
            this.appendValueInput("css")
                .setCheck("CSS_EXTEND")
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField("CSS");
            this.setInputsInline(false);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(120);
            this.setTooltip("사이드바를 생성합니다.");
            this.setHelpUrl("");
        }
    };

    Blockly.Blocks['footer_wrapper'] = {
        init: function() {
            this.appendDummyInput()
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField("푸터");
            this.appendStatementInput("content")
                .setCheck(null)
                .setAlign(Blockly.ALIGN_CENTRE);
            this.appendValueInput("css")
                .setCheck("CSS_EXTEND")
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField("CSS");
            this.setInputsInline(false);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(120);
            this.setTooltip("푸터를 생성합니다.");
            this.setHelpUrl("");
        }
    };
}