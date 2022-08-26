function ConsultarInteressado(BaseName) {
  /** inicialização do módulo ***************************************************/
  var mconsole = new __mconsole(BaseName + ".ConsultarInteressado");

  /** Variaveis *****************************************************************/
  var processo = { numero: "", interessados: [], tipo: "" };

  /** Pega a url de alteração do processo ***************************************/
  var head = $('head').html();
  var a = head.indexOf("controlador.php?acao=procedimento_alterar&");
  if (a == -1) { a = head.indexOf("controlador.php?acao=procedimento_consultar&"); }
  if (a == -1) {
    mconsole.log("Consulta não disponível para este processo!!!");
    return;
  }
  var b = head.indexOf("\"", a);
  var url = head.substring(a, b);
  url = GetBaseUrl() + url;
  mconsole.log(url);

  DetalheProcesso_Criar();

  /* Pega o html da pagina de alteração do processo */
  var WebHttp = $.ajax({ url: url });
  WebHttp.done(function (html) {
    let $html = $(html);
    processo.numero = $(".infraArvoreNoSelecionado").text();
    mconsole.log("Lendo dados do processo: " + processo.numero);
    processo.tipo = $html.find("#selTipoProcedimento option[selected='selected']").text();
    processo.interessados = $html.find("#selInteressadosProcedimento option").map(function () { return { id: $(this).val(), nome: $(this).text() }; }).get();

    DetalheProcesso_Preencher();
    ExibirDadosProcesso($html);

    /* adiciona as informações sobre o interessado */
    if (SavedOptions.CheckTypes.includes('mostrardetalhesinteressados')) {
      let urlEditarInteressado = obterUrl_EditarInteressado(html);
      if (urlEditarInteressado) abrir_EditarInteressado(urlEditarInteressado);
    }
  });

  /** Funções *******************************************************************/

  function obterUrl_EditarInteressado(html) {
    let regex = /^\s*seiAlterarContato\(valor, 'selInteressadosProcedimento', 'frmProcedimentoCadastro','(.*)'\);/m;
    let resultado = regex.exec(html);
    return resultado !== null ? resultado[1] : null;
  }

  function obterUrl_dadosInteressado(html) {
    let regex = /^\s*objAjaxDadosContatoAssociado = new infraAjaxComplementar\(null,'(.*)'\);/m;
    let resultado = regex.exec(html);
    return resultado !== null ? resultado[1] : null;
  }

  function abrir_EditarInteressado(urlEditarInteressado) {
    $.ajax({
      url: GetBaseUrl() + urlEditarInteressado,
      success: function(resposta) {
        let urlCarregarDados = obterUrl_dadosInteressado(resposta);
        if (urlCarregarDados) abrir_DetalhesInteressados(urlCarregarDados);
      },
    });
  }

  function abrir_DetalhesInteressados(urlCarregarDados) {
    $('#seipp_interessados > div').each(function() {
      let elInteressado = $(this);
      let idContato = elInteressado.data('id');
      if (!idContato) return;
      abrir_DetalhesInteressado(urlCarregarDados, idContato, elInteressado);
    });
  }

  function ler_campoInteressado(resposta, nomeCampo, prefixo) {
    let campo = resposta.querySelector(`complemento[nome='${nomeCampo}']`);
    return campo && campo.textContent.length > 0
      ? `${prefixo ? prefixo : ''}${campo.textContent}`
      : null;
  }

  function abrir_DetalhesInteressado(urlCarregarDados, idContato, elInteressado) {
    $.ajax({
      url: GetBaseUrl() + urlCarregarDados,
      method: 'POST',
      data: `id_contato_associado=${idContato}`,
      success: function(resposta) {
        let dados = [
          ler_campoInteressado(resposta, 'Endereco'),
          ler_campoInteressado(resposta, 'Complemento'),
          ler_campoInteressado(resposta, 'Bairro'),
          ler_campoInteressado(resposta, 'NomeCidade'),
          ler_campoInteressado(resposta, 'SiglaUf'),
          ler_campoInteressado(resposta, 'NomePais'),
          ler_campoInteressado(resposta, 'Cep', 'CEP '),
        ];
        preencher_DetalhesInteressado(elInteressado, dados);
      },
    });
  }

  function preencher_DetalhesInteressado(elInteressado, dados) {
    let detalheInteressado = $('<p />', {
      class: 'seipp-detalhe-interessado',
      text: dados.filter(Boolean).join(', '),
    });
    elInteressado.append(detalheInteressado);
  };

  function DetalheProcesso_Criar() {

    let container = $("#container").length > 0 ? $("#container") : $("body");

    container.append(`
      <div class='seipp-separador'><span>Tipo do processo</span></div>
      <div id='seipp_tipo'>
        <p class="seipp-tipo-processo"></p>
      </div>
      <div class='seipp-separador'><span>Interessado(s)</span></div>
      <div id='seipp_interessados'></div>
    `);

  }

  function DetalheProcesso_Preencher() {

    /* tipo do processo */
    $("#seipp_tipo").attr("title", "Tipo de processo");
    $("#seipp_tipo p.seipp-tipo-processo").text(processo.tipo);

    /* dados dos interessados */
    $("#seipp_interessados").attr("title", "Interessado(s)");
    if (processo.interessados.length > 0) {
      processo.interessados.forEach(function(interessado) {
        $('#seipp_interessados').append(`
          <div data-id="${interessado.id}">
            <p class="seipp-interessado">
              <img height="10" width="12" src="${browser.runtime.getURL('icons/interessado.png')}"/>
              <span>${interessado.nome}</span>
            </p>
          </div>
        `);
      });
    } else {
      $('#seipp_interessados').append(`<p class="seipp-interessado">Nenhum interessado especificado.</p>`);
    }
  }

  function ExibirDadosProcesso($html) {
    mconsole.log("ExibirDadosProcesso");
    var iframe = window.parent.document.getElementById('ifrVisualizacao');
    var $iframe = $(iframe);

    $iframe.on("load", function () {
      // https://stackoverflow.com/questions/726816/how-to-access-iframe-parent-page-using-jquery/726866
      // https://stackoverflow.com/questions/6316979/selecting-an-element-in-iframe-jquery
      if ($iframe.contents().find("#divArvoreHtml iframe").length != 0) {$(this).off("load"); return; }
      else if ($iframe.contents().find("#divInformacao").length == 0) {$(this).off("load"); return; }

      var mask_processo = $(".infraArvoreNoSelecionado").text();
      var interessados = $html.find("#selInteressadosProcedimento option").map(function () { return $(this).text(); }).get();
      var descricao = $html.find("#txtDescricao").val();
      var data = $html.find("#txtDtaGeracaoExibir").val();
      mconsole.log(mask_processo);
      mconsole.log(interessados);
      mconsole.log(descricao);
      mconsole.log(data);

      $iframe.contents().find("#divInformacao").css('width', '300px');
      mconsole.log($iframe.prop("id"));

      $("<div id='detalhes' style='margin-left: 300px; border: 1px solid; padding: 2px;'/>")
        .insertAfter($iframe.contents().find("#divInformacao"))
        .append('<div id="divInfraBarraLocalizacao" class="infraBarraLocalizacao" style="display:block;">Dados do Processo</div>')
        .append('<div id="divProtocoloExibir" class="infraAreaDados" style="height:4.5em; clear: both;"><label id="lblProtocoloExibir" for="txtProtocoloExibir" accesskey="" class="infraLabelObrigatorio">Protocolo:</label><input id="txtProtocoloExibir" name="txtProtocoloExibir" class="infraText infraReadOnly" readonly="readonly" type="text" style="width:150px;" value="' + mask_processo + '"><label id="lblDtaGeracaoExibir" for="txtDtaGeracaoExibir" accesskey="" class="infraLabelObrigatorio" style="margin-left: 20px;">Data de Autuação:</label><input type="text" id="txtDtaGeracaoExibir" name="txtDtaGeracaoExibir" class="infraText infraReadOnly" readonly="readonly" /></div>')
        .append('<div id="divTipoProcedimento" class="infraAreaDados" style="height:4.5em; clear: none;"><label id="lblTipoProcedimento" for="selTipoProcedimento" accesskey="" class="infraLabelObrigatorio">Tipo do Processo:</label><input id="selTipoProcedimento" name="selTipoProcedimento" class="infraText infraReadOnly" readonly="readonly" style="width: 95%;" value="' + processo.tipo + '"></div>')
        .append('<div id="divDescricao" class="infraAreaDados" style="height:4.7em; clear: none;"><label id="lblDescricao" for="txtDescricao" accesskey="" class="infraLabelOpcional">Especificação:</label><input id="txtDescricao" name="txtDescricao" class="infraText infraReadOnly" readonly="readonly" type="text" style="width: 95%;"></div>')
        .append('<div id="divInteressados" class="infraAreaDados" style="height:11em; clear: none;"><label id="lblInteressadosProcedimento" for="txtInteressadoProcedimento" accesskey="I" class="infraLabelOpcional"><span class="infraTeclaAtalho">I</span>nteressados:</label><br/><textarea id="txtInteressadosProcedimento" name="txtInteressadosProcedimento" class="infraText infraReadOnly" readonly="readonly" style="width: 95%";>' + interessados.join("\n") + '</textarea></div>');

      var newiframe = window.parent.document.getElementById('ifrVisualizacao');
      var $newiframe = $(newiframe);

      $newiframe.contents().find("#txtDescricao").attr("value", descricao);
      $newiframe.contents().find("#txtDtaGeracaoExibir").attr("value", data);
      $newiframe.contents().find("#txtInteressadosProcedimento").css("height", "50px");

      mconsole.log("Fechou");
      $(this).off("load");
    });
  }
}
