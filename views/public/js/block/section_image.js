Blockly.Blocks['image_section'] = {
    init: function () {
        this.appendDummyInput().appendField('이미지 섹션');
        this.appendDummyInput()
            .appendField('배경 링크 :')
            .appendField(
                new Blockly.FieldTextInput(
                    'https://bootstrapmade.com/demo/templates/Lumia/assets/img/hero-bg.jpg'
                ),
                'bg_link'
            );
        this.appendDummyInput()
            .appendField('타이틀 :')
            .appendField(new Blockly.FieldTextInput('MY SITE'), 'sec_title');
        this.appendDummyInput()
            .appendField('내용 :')
            .appendField(
                new Blockly.FieldTextInput('Welcome to My Site!'),
                'sec_content'
            );
        this.setInputsInline(false);
        this.setPreviousStatement(true, 'section');
        this.setNextStatement(true, 'section');
        this.setColour(330);
        this.setTooltip('');
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['image_section'] = function (block) {
    let text_bg_link = block.getFieldValue('bg_link');
    let text_sec_title = block.getFieldValue('sec_title');
    let text_sec_content = block.getFieldValue('sec_content');
    let code = `
    <section class="hero d-flex flex-column justify-content-center align-items-center" style="background: url('${text_bg_link}') center center;">
    <div class="container text-center text-md-left" data-aos="fade-up">
      <h1>${text_sec_title}</h1>
      <h2>${text_sec_content}</h2>
    </div>
    </section>
    `;
    return code;
};
