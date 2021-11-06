Blockly.Blocks['page'] = {
    init: function () {
        this.appendDummyInput().appendField('페이지');
        this.appendStatementInput('page_container').setCheck('section');
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('');
    },
};

Blockly.JavaScript['page'] = function (block) {
    let statements_page_container = Blockly.JavaScript.statementToCode(
        block,
        'page_container'
    );
    let code = `${statements_page_container}`;
    return code;
};

// const lang = 'JavaScript';
// $('#blocklyButton').on('click', function () {
//     const code = Blockly[lang].workspaceToCode(workspace);
//     console.log(code);
// });

const blockly = document.querySelector('#blocklyDiv');
const toolbox = document.querySelector('#toolbox');

const workspace = Blockly.inject(blockly, {
    toolbox: toolbox,
    grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
    trashcan: true,
    scrollbars: true,
    zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.5,
        scaleSpeed: 1.2,
        pinch: true,
    },
    theme: Blockly.Themes.Classic,
});

Blockly.svgResize(workspace);

window.puuid = window.location.href.split('?puuid=')[1];
window.title = document.title.split(' - ')[0];

$.post('/api/projects/load', {
    puuid: puuid,
})
    .done(function (data) {
        window.data = data;
        if (data.type === 'Success' && data.project.xmlCode !== '') {
            let dom = Blockly.Xml.textToDom(data.project.xmlCode);
            workspace.clear();
            Blockly.Xml.domToWorkspace(workspace, dom);
        }
    })
    .fail(function (err) {
        console.log(err);
    });

function saveProject() {
    let Dom = Blockly.Xml.domToPrettyText(
        Blockly.Xml.workspaceToDom(workspace)
    );
    let View = Blockly['JavaScript'].workspaceToCode(workspace);
    $.post(`/api/projects/save`, {
        puuid: puuid,
        title: title,
        xmlCode: Dom,
        viewCode: View,
    })
        .done(function (data) {
            console.log(data);
            if (data.type == 'Success') {
                if (!$('.toast.align-item-center').hasClass('bg-success'))
                    $('.toast.align-item-center').addClass('bg-success');
                if ($('.toast.align-item-center').hasClass('bg-danger'))
                    $('.toast.align-item-center').removeClass('bg-danger');
                $('.toast .d-flex .toast-body').html(data.message);
                let toast = new bootstrap.Toast(
                    document.getElementById('alert-toast')
                );
                toast.show();
            } else {
                if ($('.toast.align-item-center').hasClass('bg-success'))
                    $('.toast.align-item-center').removeClass('bg-success');
                if (!$('.toast.align-item-center').hasClass('bg-danger'))
                    $('.toast.align-item-center').addClass('bg-danger');
                $('.toast .d-flex .toast-body').html(data.message);
                let toast = new bootstrap.Toast(
                    document.getElementById('alert-toast')
                );
                toast.show();
            }
        })
        .fail(function (err) {
            console.log(err);
        });
}

$('#save-project').on('click', function () {
    saveProject();
});

let isEditMode = true;

$('#view-mode').on('click', function () {
    saveProject();
    if (!isEditMode) return;
    isEditMode = false;
    if ($('#edit-mode').hasClass('selected'))
        $('#edit-mode').removeClass('selected');
    if (!$('#view-mode').hasClass('selected'))
        $('#view-mode').addClass('selected');
    $('#viewDiv').show();
    $.post('/api/projects/load', {
        puuid: puuid,
    })
        .done(function (data) {
            console.log(data);
            if (data.type == 'Success') {
                $('#viewDiv').attr('src', `/view?puuid=${window.puuid}`);
            }
        })
        .fail(function (err) {
            console.log(err);
        });
});

$('#edit-mode').on('click', function () {
    if (isEditMode) return;
    isEditMode = true;
    if (!$('#edit-mode').hasClass('selected'))
        $('#edit-mode').addClass('selected');
    if ($('#view-mode').hasClass('selected'))
        $('#view-mode').removeClass('selected');
    $('#viewDiv').hide();
});
