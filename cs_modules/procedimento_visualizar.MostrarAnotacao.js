function MostrarAnotacao(BaseName) {
  /** inicialização do módulo ***************************************************/
  var mconsole = new __mconsole(BaseName + ".MostrarAnotacao");

  var txanotacao = "";
  var prioridade = false;

  /** Pega a url de alteração do processo ***************************************/
  var head = $('head').html();
  var a = head.indexOf("controlador.php?acao=anotacao_registrar&");
  if (a == -1) return;
  var b = head.indexOf("\"", a);
  var url = head.substring(a, b);
  url = GetBaseUrl() + url;
  mconsole.log(url);

  /* Pega o html da pagina de alteração do processo */
  mconsole.log("Carregado os dados...");
  var WebHttp = $.ajax({ url: url });
  WebHttp.done(function (html) {
    txanotacao = $(html).find("#txaDescricao").text();
    prioridade = ($(html).find("#chkSinPrioridade:checked").length > 0) ? true : false;
        mconsole.log("Prioridade: " + prioridade);
    mconsole.log("Texto: " + txanotacao);

    if (txanotacao != "") {
      $("body").append("<div id='seipp_div_anotacao'/>");
      $("#seipp_div_anotacao").append("<div class='seipp_anotacao'/>");
      $("div.seipp_anotacao").text(txanotacao);
      if (prioridade) {
        $("div.seipp_anotacao").addClass("seipp-anotacao-red");
      }
    }
  });
}