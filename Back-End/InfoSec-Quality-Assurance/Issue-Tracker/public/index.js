$(function() {
        $.ajax({
          url: '/api/projects',
          type: 'get',
          success: function(data) {
            console.log(data)
            var projects = ['Projects: |'];
            data.forEach(ele => {
              var list = ' <a href="/'+ele+'/" class="text-info"><i>/'+ele+'/</i></a> |';
              projects.push(list);
            })
            $('#projects').html(projects.join(''))
          }
        });
        $('#testForm').submit(function(e) {
          $.ajax({
            url: '/api/issues/apitest',
            type: 'post',
            data: $('#testForm').serialize(),
            success: function(data) {
              $('#jsonResult').text(JSON.stringify(data));
            }
          });
          e.preventDefault();
        });
        $('#testForm2').submit(function(e) {
          $.ajax({
            url: '/api/issues/apitest',
            type: 'put',
            data: $('#testForm2').serialize(),
            success: function(data) {
              $('#jsonResult').text(JSON.stringify(data));
            }
          });
          e.preventDefault();
        });
        $('#testForm3').submit(function(e) {
          $.ajax({
            url: '/api/issues/apitest',
            type: 'delete',
            data: $('#testForm3').serialize(),
            success: function(data) {
              $('#jsonResult').text(JSON.stringify(data));
            }
          });
          e.preventDefault();
        });
      });