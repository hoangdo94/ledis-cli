$(document).ready(function() {
    console.log('ledis-cli');
    // Variables & functions
    var endpoint = 'http://localhost:8080/';
    var cmds = [],
        cmdIdx = -1;

    function retrieveCmdHistory(isUp) {
        // Retrieve the corresponding index
        if (isUp) {
            if (cmdIdx == -1) {
              cmdIdx = cmds.length - 1;
            } else if (cmdIdx > 0) {
              cmdIdx--;
            }
        } else {
            if (cmdIdx != -1 && cmdIdx < cmds.length - 1) {
              cmdIdx++;
            }
        }

        if (cmdIdx == -1) {
          return;
        }
        $("#command-input").val(cmds[cmdIdx]);
    }

    function parseResponse(res) {
        return res.replace(/\n\r/g, '<br/>');
    }

    function sendCmd(cmd) {
        // Disable the input
        $("#command-input").prop('disabled', true);

        // Command history
        cmds.push(cmd);
        cmdIdx = -1;

        $.post(endpoint, cmd, function(res) {
            // Enable & clear the input
            $('#command-input').val('');
            $("#command-input").prop('disabled', false);

            // Append result
            var cmdHtml = '<p class="terminal-command">~> ' + cmd + '</p>';
            var resHtml = '<p class="terminal-response">' + parseResponse(res) + '</p>';
            $('#terminal-logs').append(cmdHtml).append(resHtml);

            // Scroll to bottom of the terminal-command
            $('html,body').scrollTop($('html,body').height());

            // Focus on the input
            $('#command-input').focus();
        });
    }

    // Actions
    $('#command-input').focus();

    // Events
    $(document).click(function() {
        $('#command-input').focus();
    });

    $('#command-input').keyup(function(e) {
        e.preventDefault();

        // Enter
        if (e.keyCode == 13) {
            var cmd = $(this).val();
            if (cmd) {
                sendCmd(cmd);
            }
        }
        // Up
        if (e.keyCode == 38) {
          retrieveCmdHistory(true);
        }
        // Down
        if (e.keyCode == 40) {
          retrieveCmdHistory(false);
        }
    })
});
