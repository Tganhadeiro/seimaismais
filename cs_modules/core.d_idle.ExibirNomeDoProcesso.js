function ExibirNomeDoProcesso(BaseName) {
  /** inicialização do módulo */
  //mconsole.log("entrou1");
  //var mconsole = new __mconsole(BaseName + ".ExibirNomeDoProcesso");
  //mconsole.log("entrou2");

  var processos = document.getElementsByClassName("processoVisualizado");
  for (var i = 0; i < processos.length; i++) {
    var p = processos[i];
    var text = p.onmouseover+"";
    var extracted = text.substring(text.lastIndexOf("(")+1,text.lastIndexOf(")"));
    extracted = extracted.substring(1, extracted.lastIndexOf(",")-1);
  
    if (extracted.length>0){
        p.innerText = extracted;
    }
  }
}