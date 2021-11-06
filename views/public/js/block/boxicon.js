Blockly.Blocks['boxicon'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('박스아이콘 :')
            .appendField(new Blockly.FieldTextInput('bx-code'), 'icon_tag');
        this.setOutput(true, 'Icon');
        this.setColour(20);
        this.setTooltip('BoxIcon 로고를 적용합니다.');
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['boxicon'] = function (block) {
    let text_icon_tag = block.getFieldValue('icon_tag');
    let code = `<i class='bx ${text_icon_tag}' ></i>`;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};
