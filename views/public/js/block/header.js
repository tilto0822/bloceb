Blockly.Blocks['wrapper_header'] = {
    init: function () {
        this.appendDummyInput().appendField('헤더');
        this.appendDummyInput()
            .appendField('타이틀 :')
            .appendField(new Blockly.FieldTextInput('MY SITE'), 'header_title');
        this.appendStatementInput('menus')
            .setCheck('header_menus')
            .appendField('메뉴 :');
        this.setPreviousStatement(true, 'section');
        this.setNextStatement(true, 'section');
        this.setColour(120);
        this.setTooltip('해더를 생성합니다.');
        this.setHelpUrl('');
    },
};

Blockly.Blocks['header_menus'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('메뉴 :')
            .appendField(new Blockly.FieldTextInput('About'), 'menu_text');
        this.appendDummyInput()
            .appendField('위치 연결 :')
            .appendField(
                new Blockly.FieldDropdown([
                    ['Home', 'HOME'],
                    ['About', 'ABOUTUS'],
                    ['Services', 'SERVICE'],
                ]),
                'context'
            );
        this.setPreviousStatement(true, 'header_menus');
        this.setNextStatement(true, 'header_menus');
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['wrapper_header'] = function (block) {
    let text_header_title = block.getFieldValue('header_title');
    let statements_menus = Blockly.JavaScript.statementToCode(block, 'menus');
    let code = `
    <header id="header" class="fixed-top d-flex align-items-center">
    <div class="container d-flex align-items-center">

      <div class="logo me-auto">
        <h1><a href="index.html">${text_header_title}</a></h1>
      </div>

      <nav id="navbar" class="navbar order-last order-lg-0">
        <ul>
          ${statements_menus}
        <i class="bi bi-list mobile-nav-toggle"></i>
      </nav>
    </div>
    </header>`;
    return code;
};

Blockly.JavaScript['header_menus'] = function (block) {
    let text_menu_text = block.getFieldValue('menu_text');
    let dropdown_context = block.getFieldValue('context');
    let code = `<li><a class="nav-link scrollto active" href="#${dropdown_context}">${text_menu_text}</a></li>`;
    return code;
};
