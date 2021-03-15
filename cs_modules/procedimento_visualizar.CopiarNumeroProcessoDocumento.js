function CopiarNumeroProcessoDocumento(BaseName) {

	/** inicialização do módulo ***************************************************/
	var mconsole = new __mconsole(BaseName + ".CopiarNumeroProcessoDocumento");

	var srcImgCopiar = 'data:image/gif;base64,R0lGODdhEAAQAMZNAAQCBISCdERCPMzCpGxmVOzixHRyXCQiHKyijNzStGxqXPTu3FxaTMS6nBQWFHx2bPz23ExORNTKrGRmZDQyLOTavGxqZERCRPTq1HRyZMS6pAwKDKSejMzGrGRiXCwqJPz27HR2ZOzizLSqlNzWvGxuXPzy5FxeXCQeHOTaxGxuZERGRMS+pGRmXAQGBJSKdExGPNTGpCwmJPzy3GReVMy6nBwWFHx6bPz25NzOtGxmZDw6NPTu1HxyZAwODKSelNTGrCwuJPz67Hx2ZPTmzLSulOTWvHRuXOTexHRuZExGRMy+pGxmXP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ywAAAAAEAAQAAAHqoAnNEOEhYaEDDsMOCAgOIyOjZAQDAaMODOXlzNCjiFHJjOioQClAJmPISUYrKylrQA8oRklRLZEpbe3GAsZCgXABaXBwCIiGL4VSMulSMrLyyJJCkbVRqXW2SkqTAneCaXf4iQWLRLn56XoAOc55UDw8aYAQDExQBYeAwNL+/z7/Zb00+FhCYsaGhDWMIhQg4YlEwQAaUCx4sSKDYCscHHBg8ePID1e2BAIADs=';
	var srcImgEspaco = '/infra_css/imagens/espaco.gif';
  var idmod = "seipp-cnpd";

	function gerarInserirLink(element, numeroDocumento, numeroSei, nomeDocumento) {

	    var linkSei = document.createElement('a');
	    linkSei.id = 'lnkSei' + numeroDocumento;
	    linkSei.className = 'ancoraSei';
      $(linkSei).append(numeroSei);

	    var spanNotEditable = document.createElement('span');
	    spanNotEditable.setAttribute('contenteditable', 'false');
	    spanNotEditable.appendChild(linkSei);

	    var spanGeral = document.createElement('span');
	    if (nomeDocumento) $(spanGeral).append(nomeDocumento + ' (');
	    spanGeral.appendChild(spanNotEditable);
	    if (nomeDocumento) $(spanGeral).append(')');
	    spanGeral.style.display = 'none';

	    var spanParent = element.parentNode;
	    spanParent.parentNode.insertBefore(spanGeral, spanParent.nextSibling);

	    return spanGeral;
	}

	function gerarInserirCopy(span, title) {

	    var imgCopiar = document.createElement('img');
	    imgCopiar.src = srcImgCopiar;
	    imgCopiar.title = title;
	    imgCopiar.id = idmod + span.id.substr(4);

	    var imgEspaco = document.createElement('img');
	    imgEspaco.src = srcImgEspaco;

	    var spanParent = span.parentNode;
	    spanParent.parentNode.insertBefore(imgCopiar, spanParent.nextSibling);
	    spanParent.parentNode.insertBefore(imgEspaco, spanParent.nextSibling);
	    mconsole.log("Link copiar adicionado: " + $(span).text());
	    return imgCopiar;
	}

	function getNumeroDocumento(text) {
	    var resultIdRegex = /^span([0-9]{1,9})$/g.exec(text);
	    if (resultIdRegex) return resultIdRegex[1];
	}

	function copiarNumero(spanGeral) {
	    spanGeral.style.display = 'block';
	    var range = document.createRange();
	    range.selectNodeContents(spanGeral);
	    var sel = window.getSelection();
	    sel.removeAllRanges();
	    sel.addRange(range);
	    try {
          document.execCommand('copy');
	        sel.removeAllRanges();
	    } catch (err) {
	        alert('Infelizmente, seu sistema não permite copiar automaticamente. Pressione Ctrl + C para copiar.');
	    }
	    spanGeral.style.display = 'none';
	}

	function iniciar() {
	    var span = document.querySelector('#divArvore>a>span');
	    if (span && $("#"+idmod + span.id.substr(4)).length == 0) {

	        var numeroDocumento = getNumeroDocumento(span.id);
	        if (numeroDocumento) {

	            var spanGeral = gerarInserirLink(span, numeroDocumento, span.innerHTML.trim());
	            gerarInserirCopy(span, 'Copiar Número do Processo').addEventListener('click', function() {AnimacaoFade(this); copiarNumero(spanGeral); });
	        }
	    }

      $("#divArvore > div a[target='ifrVisualizacao'] > span").each(function(index, element) {

	        var numeroSei;
	        var nomeDocumento;
	        var numeroDocumento = getNumeroDocumento(element.id);

	        if ($("#"+idmod + element.id.substr(4)).length != 0) return;
	        var resultNomeRegex = /^(.+)\s+\(?([0-9]{7,8})\)?$/.exec(element.title);
	        if (resultNomeRegex) {
	            nomeDocumento = resultNomeRegex[1];
	            numeroSei = resultNomeRegex[2];
	        }

	        if (numeroSei && numeroDocumento && nomeDocumento) {

	            var spanGeral = gerarInserirLink(element, numeroDocumento, numeroSei, nomeDocumento);
	            gerarInserirCopy(element, 'Copiar Documento').addEventListener('click', function() {AnimacaoFade(this); copiarNumero(spanGeral); });
	        }
      });
	}

	ExecutarNaArvore(mconsole,iniciar);
}