import Blockly from 'blockly';
import setContainerBlocks from './block/container';
import setWrapperBlocks from "./block/wrapper";
import setWidgetBlocks from "./block/widget";
import setCssBlocks from './block/css';

const $ = require('jquery');

// Blockly.JavaScript = {};

$(document).ready(function () {
    setContainerBlocks();
    setWrapperBlocks();
    setWidgetBlocks();
    setCssBlocks();

    Blockly.Blocks['page'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("페이지 : ")
                .appendField(new Blockly.FieldTextInput("my_page"), "page_id");
            this.appendStatementInput("page_container")
                .setCheck("container");
            this.setColour(230);
            this.setTooltip("페이지를 생성합니다");
            this.setHelpUrl("");
        }
    };

    Blockly.JavaScript['page'] = function(block) {
        let text_page_id = block.getFieldValue('page_id');
        let statements_page_container = Blockly.JavaScript.statementToCode(block, 'page_container');
        return `<div id="${text_page_id}" class="page">${statements_page_container}</div>`;
    };

    const workspace = Blockly.inject('blocklyDiv', {
        toolbox: document.getElementById('toolbox'),
        media: 'media/'
    });

    const lang = 'JavaScript';
    $('#blocklyButton').on('click', function () {
        const code = Blockly[lang].workspaceToCode(workspace);
        console.log(code);
    });
});