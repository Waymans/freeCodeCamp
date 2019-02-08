$(function() {
  $('#testForm').submit( (e) => {
    e.preventDefault();
    const stock = $('#stock')[0].value;
    const like1 = $('#like1')[0].checked;
    $.getJSON('/api/stock-prices?stock='+stock+'&like='+like1, function(res) {
      $('#jsonResult').html(JSON.stringify(res, null, ' '));
      $('#Rstock1').html(res.stockData.stock);
      $('#Rprice1').html(res.stockData.price);
      $('#Rlikes1').html(res.stockData.likes);
      $('#Rstock2').html('');
      $('#Rprice2').html('');
      $('#Rlikes2').html('');
      $("#Tlikes").html("Likes");
      $(".form-control").val("");
      $("input[type=checkbox]").removeAttr("checked");
    });
  });
  $('#testForm2').submit( (e) => {
    e.preventDefault();
    const stock1 = $('#stock1')[0].value;
    const stock2 = $('#stock2')[0].value;   
    const like2 = $('#like2')[0].checked;
    $.getJSON('/api/stock-prices?stock='+stock1+'&stock='+stock2+'&like='+like2, function(res) {
      $('#jsonResult').html(JSON.stringify(res, null, ' '));
      $('#Rstock1').html(res.stockData[0].stock);
      $('#Rprice1').html(res.stockData[0].price);
      $('#Rlikes1').html(res.stockData[0].rel_likes);
      $('#Rstock2').html(res.stockData[1].stock);
      $('#Rprice2').html(res.stockData[1].price);
      $('#Rlikes2').html(res.stockData[1].rel_likes);
      $('#Tlikes').html('Relative Likes');
      $(".form-control").val("");
      $("input[type=checkbox]").removeAttr("checked");
    });
  });
  $('#like1').popover({placement: 'top'});
  $('#like2').popover({placement: 'top'});
});