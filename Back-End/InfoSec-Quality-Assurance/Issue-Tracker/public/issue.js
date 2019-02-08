$(function() {
        var currentProject = window.location.pathname.replace(/\//g, "");;
        var url = "/api/issues/"+currentProject;
        $('#projectTitle').text('All issues for: '+currentProject)
        $.ajax({
          type: "GET",
          url: url,
          success: function(data)
          {
            var issues= [];
            data.forEach(function(ele) {
              console.log(ele);
              var openstatus, bgColor;
              (ele.open) ? openstatus = 'open' : openstatus = 'closed';
              openstatus === 'open' ? bgColor = 'light': bgColor = 'secondary';
              var single = [
                '<div class="container p-0">',
                '<div class="bg-'+bgColor+' border">',
                '<p>id: <em id="num">'+ele._id+'</em> <button id="copy" class="btn-sm btn-dark">Copy</button></p>',
                '<h3>'+ele.issue_title+' -  ('+openstatus+')</h3>',
                '<br>',
                '<p>'+ele.issue_text+'</p>',
                '<p>'+ele.status_text+'</p>',
                '<br>',
                '<p><b>Created by:</b> '+ele.created_by+'  <b>Assigned to:</b> '+ele.assigned_to,
                '<p><b>Created on:</b> '+ele.created_on+'  <b>Last updated:</b> '+ele.updated_on,
                '<br><a href="#" class="closeIssue" id="'+ele._id+'">close?</a> <a href="#" class="deleteIssue" id="'+ele._id+'">delete?</a>',
                '</div>',
                '</div>'             
              ];
              issues.push(single.join(''));
            });
            $('#issueDisplay').html(issues.join(''));
          }
        });
        
        $('#newIssue').submit(function(e){
          e.preventDefault();
          $(this).attr('action', "/api/issues/" + currentProject);
          $.ajax({
            type: "POST",
            url: url,
            data: $(this).serialize(),
            success: function(data) { window.location.reload(true); }
          });
        });
        
        $('#issueDisplay').on('click','.closeIssue', function(e) {
          var url = "/api/issues/"+currentProject;
          $.ajax({
            type: "PUT",
            url: url,
            data: {_id: $(this).attr('id'), open: false},
            success: function(data) { alert(data); window.location.reload(true); }
          });
          e.preventDefault();
        });
        $('#issueDisplay').on('click','.deleteIssue', function(e) {
          var url = "/api/issues/"+currentProject;
          $.ajax({
            type: "DELETE",
            url: url,
            data: {_id: $(this).attr('id')},
            success: function(data) { alert(data); window.location.reload(true); }
          });
          e.preventDefault();
        });
        $('#issueDisplay').on('click','#copy', function(e) {
          var $temp = $("<textarea>");
          $("body").append($temp);
          $temp.html($('#num').html()).select();
          document.execCommand("copy");
          $temp.remove();
        });
      });