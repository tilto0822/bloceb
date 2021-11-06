Blockly.Blocks['title_section'] = {
    init: function () {
        this.appendDummyInput().appendField('일반 섹션');
        this.appendDummyInput()
            .appendField('ID :')
            .appendField(new Blockly.FieldTextInput('about'), 'id');
        this.appendDummyInput()
            .appendField('제목 :')
            .appendField(new Blockly.FieldTextInput('About Us'), 'title');
        this.appendDummyInput()
            .appendField('설명 :')
            .appendField(
                new Blockly.FieldTextInput('Lorem ipsum dolor sit amet'),
                'desc'
            );
        this.appendStatementInput('inner').setCheck('section_inner');
        this.setPreviousStatement(true, 'section');
        this.setNextStatement(true, 'section');
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['title_section'] = function (block) {
    let text_id = block.getFieldValue('id');
    let text_title = block.getFieldValue('title');
    let text_desc = block.getFieldValue('desc');
    let statements_inner = Blockly.JavaScript.statementToCode(block, 'inner');
    // TODO: Assemble JavaScript into code variable.
    let code = `
    <section id="${text_id}" class="${text_id}">
      <div class="container">
        <div class="section-title">
          <h2>${text_title}</h2>
          <p>${text_desc}</p>
        </div>
        <div class="row">
        ${statements_inner}
        </div>
      </div>
    </section>
    `;
    return code;
};
