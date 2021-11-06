Blockly.Blocks['content_icon_box'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(
                new Blockly.FieldDropdown([
                    ['큰', 'big'],
                    ['작은', 'small'],
                ]),
                'type'
            )
            .appendField('아이콘 박스');
        this.appendDummyInput()
            .appendField('아이콘 :')
            .appendField(new Blockly.FieldTextInput('bi-code'), 'icon_tag');
        this.appendDummyInput()
            .appendField('제목 :')
            .appendField(new Blockly.FieldTextInput('Title'), 'box_title');
        this.appendDummyInput()
            .appendField('내용 :')
            .appendField(
                new Blockly.FieldTextInput('This is a description'),
                'box_content'
            );
        this.setInputsInline(false);
        this.setPreviousStatement(true, 'section_inner');
        this.setNextStatement(true, 'section_inner');
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['content_icon_box'] = function (block) {
    let dropdown_type = block.getFieldValue('type');
    let text_icon_tag = block.getFieldValue('icon_tag');
    let text_box_title = block.getFieldValue('box_title');
    let text_box_content = block.getFieldValue('box_content');

    let code = '';
    switch (dropdown_type) {
        case 'small':
            code = `
            <div class="col-lg-4 col-md-6 d-flex align-items-stretch mt-4">
            <div class="icon-box-small">
              <div class="icon"><i class="bx ${text_icon_tag}"></i></div>
              <h4><a href="">${text_box_title}</a></h4>
              <p>${text_box_content}</p>
            </div>
            </div>
            `;
            break;
        case 'big':
            code = `
            <div class="col-md-6 mt-4">
            <div class="icon-box-big">
              <i class="bi ${text_icon_tag}"></i>
              <h4><a href="#">${text_box_title}</a></h4>
              <p>${text_box_content}</p>
            </div>
            </div>
            `;
            break;
    }
    return code;
};

Blockly.Blocks['image_context_box'] = {
    init: function () {
        this.appendDummyInput().appendField('이미지 박스');
        this.appendDummyInput()
            .appendField('이미지 링크 :')
            .appendField(
                new Blockly.FieldTextInput(
                    'https://bootstrapmade.com/demo/templates/Lumia/assets/img/about.jpg'
                ),
                'image_link'
            );
        this.appendDummyInput()
            .appendField('제목 :')
            .appendField(new Blockly.FieldTextInput('Title'), 'box_title');
        this.appendDummyInput()
            .appendField('내용 :')
            .appendField(
                new Blockly.FieldTextInput(
                    'Donec pretium efficitur volutpat. Sed pretium ante non fringilla placerat. Sed quis tortor dignissim, luctus felis faucibus, fermentum neque. Nulla eu varius metus. Aliquam vel dignissim augue, facilisis pellentesque leo. Vivamus vitae pretium erat. Etiam facilisis laoreet turpis nec convallis. In pulvinar mollis nisi a maximus.'
                ),
                'box_content'
            );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['image_context_box'] = function (block) {
    let text_image_link = block.getFieldValue('image_link');
    let text_box_title = block.getFieldValue('box_title');
    let text_box_content = block.getFieldValue('box_content');
    let code = `
    <div class="col-lg-6">
        <img src="${text_image_link}" class="img-fluid" alt="">
    </div>
    <div class="col-lg-6 pt-4 pt-lg-0">
        <h3>${text_box_title}</h3>
        <p>
        ${text_box_content}
        </p>
    </div>
    `;
    return code;
};
